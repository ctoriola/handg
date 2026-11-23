-- =====================================================================
-- Hare & Grouse — Auction back end for Supabase (Postgres)
--
-- The website's demo engine (assets/js/auction.js) stores bids in the
-- browser. For a live sale the server must be the single source of truth.
-- This file creates the tables, a secure place_bid() function with the
-- same rules (increments, proxy bidding, reserves, soft close), and a
-- close_lots() job that settles lots and raises invoices.
--
-- Run it in Supabase: SQL Editor → New query → paste → Run.
-- =====================================================================

-- ---------- 1. Tables ----------

create table if not exists profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text not null,
  phone       text not null,
  country     text,
  paddle      int generated always as identity (start with 2001) unique,
  approved    boolean not null default true,      -- set false to vet bidders manually
  created_at  timestamptz not null default now()
);

create table if not exists sales (
  id               text primary key,               -- e.g. 'hg-2611'
  code             text not null,
  title            text not null,
  intro            text,
  image_url        text,
  opens_at         timestamptz not null,
  first_close_at   timestamptz not null,
  stagger_minutes  int not null default 2,
  premium_rate     numeric not null default 0.25
);

create table if not exists lots (
  id           uuid primary key default gen_random_uuid(),
  sale_id      text not null references sales on delete cascade,
  lot_number   int not null,
  title        text not null,
  artist       text,
  medium       text,
  dims         text,
  condition    text,
  provenance   text,
  image_url    text,
  est_low      numeric not null,
  est_high     numeric not null,
  start_bid    numeric not null,
  has_reserve  boolean not null default false,
  reserve_met  boolean not null default true,
  ends_at      timestamptz not null,
  current_bid  numeric not null default 0,
  bid_count    int not null default 0,
  status       text not null default 'open' check (status in ('open','sold','unsold')),
  unique (sale_id, lot_number)
);

-- Confidential per-lot data: never readable by the website
create table if not exists lot_secrets (
  lot_id      uuid primary key references lots on delete cascade,
  reserve     numeric not null default 0,
  leader_id   uuid references profiles,
  leader_max  numeric
);

create table if not exists bids (
  id          bigint generated always as identity primary key,
  lot_id      uuid not null references lots on delete cascade,
  bidder_id   uuid not null references profiles,
  paddle      int not null,                       -- shown publicly instead of names
  amount      numeric not null,
  is_auto     boolean not null default false,     -- placed by the proxy engine
  created_at  timestamptz not null default now()
);
create index if not exists bids_lot_idx on bids (lot_id, created_at desc);

create table if not exists watchlist (
  bidder_id uuid references profiles on delete cascade,
  lot_id    uuid references lots on delete cascade,
  primary key (bidder_id, lot_id)
);

create table if not exists invoices (
  id          bigint generated always as identity primary key,
  lot_id      uuid not null unique references lots,
  bidder_id   uuid not null references profiles,
  hammer      numeric not null,
  premium     numeric not null,
  total       numeric not null,
  status      text not null default 'unpaid' check (status in ('unpaid','paid','cancelled')),
  created_at  timestamptz not null default now()
);

-- ---------- 2. Row-level security ----------

alter table profiles    enable row level security;
alter table sales       enable row level security;
alter table lots        enable row level security;
alter table lot_secrets enable row level security;   -- no policies = no client access at all
alter table bids        enable row level security;
alter table watchlist   enable row level security;
alter table invoices    enable row level security;

create policy "read own profile"   on profiles  for select using (id = auth.uid());
create policy "create own profile" on profiles  for insert with check (id = auth.uid());
create policy "update own profile" on profiles  for update using (id = auth.uid());
create policy "sales are public"   on sales     for select using (true);
create policy "lots are public"    on lots      for select using (true);
create policy "bids are public"    on bids      for select using (true);   -- website shows paddle, never names
create policy "own watchlist"      on watchlist for all using (bidder_id = auth.uid()) with check (bidder_id = auth.uid());
create policy "own invoices"       on invoices  for select using (bidder_id = auth.uid());
-- There are no insert/update policies on lots or bids: the only way to bid is place_bid().

-- The website can ask "am I winning?" without seeing anyone's maximum
create or replace function my_lot_status(p_lot uuid) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object('leading', s.leader_id = auth.uid(),
                           'your_max', case when s.leader_id = auth.uid() then s.leader_max end)
  from lot_secrets s where s.lot_id = p_lot;
$$;
grant execute on function my_lot_status(uuid) to authenticated;

-- ---------- 3. Bid increments ----------

create or replace function bid_increment(x numeric) returns numeric
language sql immutable as $$
  select case
    when x < 1000   then 50
    when x < 2000   then 100
    when x < 5000   then 250
    when x < 10000  then 500
    when x < 20000  then 1000
    when x < 50000  then 2500
    when x < 100000 then 5000
    else 10000 end;
$$;

-- ---------- 4. place_bid: the only way to bid ----------
-- Call from the website with: supabase.rpc('place_bid', { p_lot: lotId, p_max: 12000 })

create or replace function place_bid(p_lot uuid, p_max numeric)
returns json
language plpgsql security definer set search_path = public as $$
declare
  me       uuid := auth.uid();
  my_pad   int;
  lead_pad int;
  l        lots%rowtype;
  x        lot_secrets%rowtype;
  s        sales%rowtype;
  next_min numeric;
  new_cur  numeric;
  outcome  text;
begin
  if me is null then raise exception 'Please sign in to bid'; end if;
  select paddle into my_pad from profiles where id = me and approved;
  if my_pad is null then raise exception 'Please complete registration to bid'; end if;

  select * into l from lots where id = p_lot for update;          -- lock the lot row
  if not found then raise exception 'Lot not found'; end if;
  select * into x from lot_secrets where lot_id = p_lot for update;
  if not found then insert into lot_secrets (lot_id) values (p_lot) returning * into x; end if;
  select * into s from sales where id = l.sale_id;

  if now() < s.opens_at then raise exception 'Bidding has not opened yet'; end if;
  if now() >= l.ends_at or l.status <> 'open' then raise exception 'This lot has closed'; end if;
  if p_max > l.est_high * 5 then raise exception 'Please contact us to bid above five times the high estimate'; end if;

  next_min := case when l.bid_count = 0 then l.start_bid else l.current_bid + bid_increment(l.current_bid) end;
  select paddle into lead_pad from profiles where id = x.leader_id;

  if x.leader_id = me then
    -- already winning: only the hidden maximum changes
    if p_max <= x.leader_max then raise exception 'Enter more than your current maximum of %', x.leader_max; end if;
    x.leader_max := p_max;
    outcome := 'raised';

  elsif p_max < next_min then
    raise exception 'The minimum bid is %', next_min;

  elsif x.leader_id is null then
    -- first bid on the lot
    l.current_bid := next_min; x.leader_id := me; x.leader_max := p_max;
    insert into bids (lot_id, bidder_id, paddle, amount) values (l.id, me, my_pad, l.current_bid);
    outcome := 'leading';

  elsif p_max <= x.leader_max then
    -- the existing leader's earlier maximum wins (ties go to the earlier bid)
    insert into bids (lot_id, bidder_id, paddle, amount) values (l.id, me, my_pad, p_max);
    new_cur := least(x.leader_max, p_max + bid_increment(p_max));
    insert into bids (lot_id, bidder_id, paddle, amount, is_auto) values (l.id, x.leader_id, lead_pad, new_cur, true);
    l.current_bid := new_cur;
    outcome := 'outbid';

  else
    -- new leader: price moves to one increment above the old leader's maximum
    if x.leader_max > l.current_bid then
      insert into bids (lot_id, bidder_id, paddle, amount, is_auto) values (l.id, x.leader_id, lead_pad, x.leader_max, true);
    end if;
    new_cur := greatest(next_min, least(p_max, x.leader_max + bid_increment(x.leader_max)));
    insert into bids (lot_id, bidder_id, paddle, amount, is_auto) values (l.id, me, my_pad, new_cur, x.leader_max > l.current_bid);
    l.current_bid := new_cur; x.leader_id := me; x.leader_max := p_max;
    outcome := 'leading';
  end if;

  -- reserve: jump the price to the reserve once the leader's maximum covers it
  if x.reserve > 0 and l.current_bid < x.reserve and x.leader_max >= x.reserve then
    l.current_bid := x.reserve;
    select paddle into lead_pad from profiles where id = x.leader_id;
    insert into bids (lot_id, bidder_id, paddle, amount, is_auto) values (l.id, x.leader_id, lead_pad, x.reserve, true);
  end if;

  -- soft close: a bid in the final 2 minutes extends the lot to 2 minutes from now
  if l.ends_at - now() < interval '2 minutes' then
    l.ends_at := now() + interval '2 minutes';
  end if;

  update lot_secrets set leader_id = x.leader_id, leader_max = x.leader_max where lot_id = l.id;
  update lots set current_bid = l.current_bid, ends_at = l.ends_at,
                  reserve_met = (x.reserve = 0 or l.current_bid >= x.reserve),
                  bid_count = (select count(*) from bids where lot_id = l.id)
  where id = l.id;

  return json_build_object(
    'outcome', outcome,
    'current_bid', l.current_bid,
    'ends_at', l.ends_at,
    'reserve_met', (x.reserve = 0 or l.current_bid >= x.reserve),
    'your_max', case when x.leader_id = me then x.leader_max end
  );
end $$;

revoke all on function place_bid(uuid, numeric) from public, anon;
grant execute on function place_bid(uuid, numeric) to authenticated;

-- ---------- 5. Settle closed lots and raise invoices ----------

create or replace function close_lots() returns int
language plpgsql security definer set search_path = public as $$
declare r record; n int := 0; rate numeric;
begin
  for r in select l.id, l.sale_id, l.current_bid, x.leader_id, coalesce(x.reserve, 0) as reserve
           from lots l left join lot_secrets x on x.lot_id = l.id
           where l.status = 'open' and l.ends_at <= now()
           for update of l skip locked loop
    if r.leader_id is not null and (r.reserve = 0 or r.current_bid >= r.reserve) then
      select premium_rate into rate from sales where id = r.sale_id;
      update lots set status = 'sold' where id = r.id;
      insert into invoices (lot_id, bidder_id, hammer, premium, total)
      values (r.id, r.leader_id, r.current_bid, round(r.current_bid * rate), round(r.current_bid * (1 + rate)));
    else
      update lots set status = 'unsold' where id = r.id;
    end if;
    n := n + 1;
  end loop;
  return n;
end $$;

-- Run close_lots() every minute (enable the pg_cron extension under Database → Extensions first)
-- select cron.schedule('close-lots', '* * * * *', 'select close_lots()');

-- ---------- 6. Live updates ----------
-- Lets every open browser see new bids and extended closing times instantly.
alter publication supabase_realtime add table lots, bids;

-- ---------- 7. Helper: create a sale's lots with staggered closing times ----------
-- After inserting lots, set their closing times from the sale's first_close_at:
-- update lots l set ends_at = s.first_close_at + (l.lot_number - 1) * (s.stagger_minutes || ' minutes')::interval
-- from sales s where s.id = l.sale_id and s.id = 'hg-2611';
