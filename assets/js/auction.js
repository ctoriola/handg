/* Hare & Grouse — auction engine (front-end demo)

   Implements the rules a real online saleroom uses:
     • Bid increments that step up with price
     • Proxy ("max") bidding: you set a ceiling, the system bids for you only as much as needed
     • Earlier bid wins a tie
     • Confidential reserves: price jumps to the reserve when a max bid covers it
     • Staggered lot closing with soft close (a bid in the last 2 minutes extends the lot by 2 minutes)
     • Registration (paddle number) before bidding, watchlist, My Bids, results
     • 25% buyer's premium shown on every bid confirmation

   State is kept in localStorage so the demo works with no server. A simulated "room" of other
   bidders places bids while a page is open. For production, move placeBid() into the Supabase
   function in docs/auction-supabase.sql so the server, not the browser, is the source of truth.
*/
(function () {
  const A = (HG.auction = {});
  const MIN = 60 * 1000;
  const CYCLE = 8 * 60 * MIN;          // demo resets 8 hours after first visit
  const SOFT_CLOSE = 2 * MIN;
  A.PREMIUM = 0.25;
  const KEY = "hg_auction_v1";

  /* ---------------- persistence ---------------- */
  let db;
  function load() {
    try { db = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { db = {}; }
    const now = Date.now();
    if (!db.anchor || now > db.anchor + CYCLE) {
      db = { anchor: now, lots: {}, reg: db.reg || null, watch: db.watch || [], notes: [] };
      save();
    }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
  load();

  A.resetDemo = () => { db.anchor = 0; save(); load(); };

  /* ---------------- money & time ---------------- */
  A.usd = (n) => "$" + Math.round(n).toLocaleString("en-US");
  A.approx = (n) => (HG.currency && HG.currency !== "USD" ? ` <span class="approx">≈ ${HG.money(n)}</span>` : "");
  A.inc = (x) =>
    x < 1000 ? 50 : x < 2000 ? 100 : x < 5000 ? 250 : x < 10000 ? 500 :
    x < 20000 ? 1000 : x < 50000 ? 2500 : x < 100000 ? 5000 : 10000;
  A.withPremium = (x) => Math.round(x * (1 + A.PREMIUM));

  A.fmt = (ms) => {
    if (ms <= 0) return "Closed";
    const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600),
      m = Math.floor((s % 3600) / 60), sec = s % 60, p = (v) => String(v).padStart(2, "0");
    if (d) return `${d}d ${h}h ${p(m)}m`;
    if (h) return `${h}h ${p(m)}m ${p(sec)}s`;
    return `${p(m)}m ${p(sec)}s`;
  };
  A.date = (t) => new Date(t).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  /* ---------------- lookups ---------------- */
  A.key = (sale, lot) => sale.id + ":" + lot.n;
  A.lot = (sale, n) => sale.lots.find((l) => l.n === +n);
  A.opensAt = (sale) => db.anchor + sale.opens * MIN;
  A.baseEnd = (sale, lot) => db.anchor + (sale.closes + (lot.n - 1) * sale.stagger) * MIN;
  A.endsAt = (sale, lot) => (sale.past ? A.baseEnd(sale, lot) : A.state(sale, lot).endsAt);
  A.saleEnd = (sale) => Math.max(...sale.lots.map((l) => A.endsAt(sale, l)));
  A.saleStart = (sale) => Math.min(...sale.lots.map((l) => A.endsAt(sale, l)));

  A.status = (sale, lot) => {
    if (sale.past) return "closed";
    const now = Date.now();
    if (now < A.opensAt(sale)) return "upcoming";
    return now < A.endsAt(sale, lot) ? "live" : "closed";
  };
  A.saleStatus = (sale) => {
    if (sale.past) return "closed";
    const now = Date.now();
    if (now < A.opensAt(sale)) return "upcoming";
    return now < A.saleEnd(sale) ? "live" : "closed";
  };

  /* deterministic pseudo-random so seeded histories look the same on every reload */
  function rng(seedStr) {
    let h = 2166136261;
    for (const c of seedStr) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  }
  const paddle = (r) => String(1000 + Math.floor(r() * 8999));

  A.state = (sale, lot) => {
    const k = A.key(sale, lot);
    if (db.lots[k]) return db.lots[k];
    const r = rng(k), bids = [];
    let amt = lot.start, t = db.anchor - lot.seed * 47 * MIN;
    for (let i = 0; i < (lot.seed || 0) && amt <= lot.rival; i++) {
      bids.push({ p: paddle(r), a: amt, t: (t += Math.floor(r() * 40 + 5) * MIN) });
      amt += A.inc(amt);
    }
    const st = {
      bids, yourMax: 0, rivalMax: lot.rival, rivalCeil: Math.round(lot.rival * 1.3),
      leader: bids.length ? "room" : null, endsAt: A.baseEnd(sale, lot)
    };
    db.lots[k] = st;
    return st;
  };
  A.current = (st) => (st.bids.length ? st.bids[st.bids.length - 1].a : 0);
  A.nextMin = (sale, lot) => {
    const st = A.state(sale, lot), c = A.current(st);
    return st.bids.length ? c + A.inc(c) : lot.start;
  };
  A.reserveMet = (sale, lot) => !lot.reserve || A.current(A.state(sale, lot)) >= lot.reserve;
  A.youBid = (st) => st.bids.some((b) => b.you);

  /* your relationship to a lot: leading | outbid | won | lost | null */
  A.yours = (sale, lot) => {
    if (sale.past) return null;
    const st = A.state(sale, lot);
    if (!A.youBid(st)) return null;
    const closed = A.status(sale, lot) === "closed";
    if (st.leader === "you") return closed ? (A.reserveMet(sale, lot) ? "won" : "lost") : "leading";
    return closed ? "lost" : "outbid";
  };

  /* final result for a closed lot */
  A.result = (sale, lot) => {
    if (sale.past) return lot.hammer ? { sold: true, price: lot.hammer } : { sold: false };
    const st = A.state(sale, lot);
    if (!st.bids.length || !A.reserveMet(sale, lot)) return { sold: false };
    return { sold: true, price: A.current(st), you: st.leader === "you" };
  };

  /* ---------------- bidding ---------------- */
  function push(st, a, who, auto) {
    st.bids.push({ p: who === "you" ? (db.reg ? db.reg.paddle : "You") : who, a, t: Date.now(), you: who === "you", auto: !!auto });
  }
  function softClose(st) {
    if (st.endsAt - Date.now() < SOFT_CLOSE) { st.endsAt = Date.now() + SOFT_CLOSE; return true; }
    return false;
  }
  function roomPaddle(st) {
    const last = [...st.bids].reverse().find((b) => !b.you);
    return last ? last.p : String(1000 + Math.floor(Math.random() * 8999));
  }

  /** Place (or raise) a maximum bid. Returns { ok, outcome, message } */
  A.placeBid = (sale, lot, max) => {
    max = Math.round(+max);
    const st = A.state(sale, lot);
    if (A.status(sale, lot) !== "live") return { ok: false, message: "Bidding is not open on this lot." };
    if (!db.reg) return { ok: false, message: "Please register to bid first." };

    if (st.leader === "you") {
      if (max <= st.yourMax) return { ok: false, message: `Your maximum is already ${A.usd(st.yourMax)}. Enter a higher amount to raise it.` };
      st.yourMax = max;
      if (lot.reserve && A.current(st) < lot.reserve && max >= lot.reserve) push(st, lot.reserve, "you");
      const ext = softClose(st); save();
      return { ok: true, outcome: "raised", extended: ext, message: `Maximum bid raised to ${A.usd(max)}. You are still the highest bidder.` };
    }

    const min = A.nextMin(sale, lot);
    if (max < min) return { ok: false, message: `The minimum bid is ${A.usd(min)}.` };

    const R = st.rivalMax, rp = roomPaddle(st);
    st.yourMax = max;
    let outcome;
    if (max <= R) {
      // the room's earlier maximum beats yours (ties go to the earlier bid)
      push(st, max, "you");
      push(st, Math.min(R, max + A.inc(max)), rp, true);
      st.leader = "room";
      outcome = "outbid";
    } else {
      if (R >= min && R > A.current(st)) {
        push(st, R, rp, true);
        push(st, Math.min(max, R + A.inc(R)), "you", true);
      } else {
        push(st, min, "you");
      }
      st.leader = "you";
      if (lot.reserve && A.current(st) < lot.reserve && max >= lot.reserve) push(st, lot.reserve, "you", true);
      outcome = "leading";
    }
    const ext = softClose(st); save();
    const cur = A.usd(A.current(st));
    return {
      ok: true, outcome, extended: ext,
      message: outcome === "leading"
        ? `You're the highest bidder at ${cur}${A.reserveMet(sale, lot) ? "" : " (reserve not yet met)"}.`
        : `You've been outbid. Another bidder's maximum was higher. Current bid: ${cur}.`
    };
  };

  /* ---------------- the simulated room ---------------- */
  A.simulate = () => {
    const events = [];
    const live = [];
    HG.sales.forEach((s) => !s.past && s.lots.forEach((l) => A.status(s, l) === "live" && live.push([s, l])));
    if (!live.length || Math.random() > 0.55) return events;
    const [sale, lot] = live[Math.floor(Math.random() * live.length)];
    const st = A.state(sale, lot), cur = A.current(st);
    const next = st.bids.length ? cur + A.inc(cur) : lot.start;
    if (next > st.rivalCeil) return events;
    const who = String(1000 + Math.floor(Math.random() * 8999));

    if (st.leader === "you") {
      if (Math.random() > 0.5) return events;
      if (next > st.yourMax) {
        st.bids.push({ p: who, a: next, t: Date.now() });
        st.leader = "room"; st.rivalMax = Math.max(st.rivalMax, next);
        events.push({ type: "outbid", sale, lot, text: `Outbid on Lot ${lot.n}: ${lot.title}. Current bid ${A.usd(next)}.` });
      } else {
        st.bids.push({ p: who, a: next, t: Date.now() });
        push(st, Math.min(st.yourMax, next + A.inc(next)), "you", true);
        events.push({ type: "auto", sale, lot, text: `Your maximum bid responded on Lot ${lot.n}. You're still leading.` });
      }
    } else {
      st.bids.push({ p: who, a: next, t: Date.now() });
      st.leader = "room"; st.rivalMax = Math.max(st.rivalMax, next);
      events.push({ type: "room", sale, lot });
    }
    if (softClose(st)) events.push({ type: "extended", sale, lot, text: `Lot ${lot.n} extended by 2 minutes after a late bid.` });
    save();
    return events;
  };

  /* ---------------- registration & watchlist ---------------- */
  A.reg = () => db.reg;
  A.register = (data) => {
    db.reg = { ...data, paddle: String(2000 + Math.floor(Math.random() * 7999)), at: Date.now() };
    save();
    return db.reg;
  };
  A.watching = (sale, lot) => db.watch.includes(A.key(sale, lot));
  A.toggleWatch = (sale, lot) => {
    const k = A.key(sale, lot);
    db.watch = db.watch.includes(k) ? db.watch.filter((x) => x !== k) : [...db.watch, k];
    save();
    return db.watch.includes(k);
  };
  A.myLots = () => {
    const out = [];
    HG.sales.forEach((s) => !s.past && s.lots.forEach((l) => (A.youBid(A.state(s, l)) || A.watching(s, l)) && out.push([s, l])));
    return out;
  };

  /* ---------------- shared UI ---------------- */
  A.pill = (sale, lot) => {
    const y = A.yours(sale, lot), s = A.status(sale, lot);
    if (y === "leading") return '<span class="pill pill-gold">Highest bidder</span>';
    if (y === "outbid") return '<span class="pill pill-alert">Outbid</span>';
    if (y === "won") return '<span class="pill pill-gold">You won</span>';
    if (s === "upcoming") return '<span class="pill">Preview</span>';
    if (s === "closed") return A.result(sale, lot).sold ? '<span class="pill pill-dark">Sold</span>' : '<span class="pill">Unsold</span>';
    return "";
  };

  A.lotCard = (sale, lot) => {
    const s = A.status(sale, lot), st = sale.past ? null : A.state(sale, lot);
    let priceLine;
    if (s === "closed") {
      const r = A.result(sale, lot);
      priceLine = r.sold ? `<span class="lbl">Sold for</span><strong>${A.usd(sale.past ? r.price : A.withPremium(r.price))}</strong>` : `<span class="lbl">Result</span><strong>Unsold</strong>`;
    } else if (s === "upcoming") {
      priceLine = `<span class="lbl">Starting bid</span><strong>${A.usd(lot.start)}</strong>`;
    } else {
      const c = A.current(st);
      priceLine = `<span class="lbl">${c ? "Current bid" : "Starting bid"}</span><strong>${A.usd(c || lot.start)}</strong><span class="muted small">${st.bids.length} bid${st.bids.length === 1 ? "" : "s"}</span>`;
    }
    const href = `lot.html?sale=${sale.id}&lot=${lot.n}`;
    return `<article class="lot-card" data-sale="${sale.id}" data-lot="${lot.n}">
      <a class="card-img" href="${href}"><img src="${HG.img(lot.img)}" alt="${lot.title}" loading="lazy">${A.pill(sale, lot)}</a>
      ${sale.past ? "" : `<button class="fav ${A.watching(sale, lot) ? "on" : ""}" data-watch="${sale.id}:${lot.n}" aria-label="Watch lot ${lot.n}">${HG.ico.heart}</button>`}
      <a class="card-body" href="${href}">
        <span class="lot-no">Lot ${lot.n}</span>
        <p class="lot-artist">${lot.artist}</p>
        <h3>${lot.title}</h3>
        <p class="est">Estimate ${A.usd(lot.estLow)} – ${A.usd(lot.estHigh)}</p>
        <div class="bidline">${priceLine}</div>
        ${s === "live" ? `<p class="closes"><span class="dot"></span><span data-countdown="${sale.id}:${lot.n}">${A.fmt(A.endsAt(sale, lot) - Date.now())}</span></p>` :
          s === "upcoming" ? `<p class="closes muted">Opens ${A.date(A.opensAt(sale))}</p>` : ""}
      </a>
    </article>`;
  };

  /* modals: registration + bid confirmation */
  function modals() {
    if (document.getElementById("regModal")) return;
    document.body.insertAdjacentHTML("beforeend", `
    <div class="modal" id="regModal" role="dialog" aria-modal="true" aria-labelledby="regTitle">
      <form class="modal-box" id="regForm">
        <button type="button" class="icon-btn" data-modal-close aria-label="Close">${HG.ico.close}</button>
        <span class="eyebrow">Hare &amp; Grouse Auctions</span>
        <h3 id="regTitle">Register to Bid</h3>
        <p class="muted small">Registration is free and covers every online sale. You'll get a paddle number to bid with.</p>
        <label for="rName">Full name</label><input id="rName" required autocomplete="name">
        <label for="rEmail">Email</label><input id="rEmail" type="email" required autocomplete="email">
        <label for="rPhone">Phone</label><input id="rPhone" type="tel" required autocomplete="tel">
        <label for="rCountry">Country</label>
        <select id="rCountry" class="select"><option>Nigeria</option><option>United Kingdom</option><option>United States</option><option>Ghana</option><option>South Africa</option><option>Other</option></select>
        <label class="check"><input type="checkbox" required> I agree to the Conditions of Sale, including the ${A.PREMIUM * 100}% buyer's premium.</label>
        <button class="btn btn-dark block">Create Paddle</button>
      </form>
    </div>
    <div class="modal" id="bidModal" role="dialog" aria-modal="true" aria-labelledby="bidTitle">
      <div class="modal-box">
        <button type="button" class="icon-btn" data-modal-close aria-label="Close">${HG.ico.close}</button>
        <span class="eyebrow" id="bidLot"></span>
        <h3 id="bidTitle">Confirm Your Bid</h3>
        <div class="confirm-rows" id="bidRows"></div>
        <p class="muted small">Your bid is a binding commitment to buy if you win. If this is a maximum bid, we'll bid on your behalf only as much as needed to keep you in the lead.</p>
        <button class="btn btn-dark block" id="bidConfirm">Confirm Bid</button>
      </div>
    </div>`);
    document.querySelectorAll("[data-modal-close]").forEach((b) => b.addEventListener("click", () => b.closest(".modal").classList.remove("on")));
    document.querySelectorAll(".modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("on"); }));
  }

  A.requireReg = (then) => {
    modals();
    if (db.reg) return then();
    const m = document.getElementById("regModal");
    m.classList.add("on");
    document.getElementById("rName").focus();
    document.getElementById("regForm").onsubmit = (e) => {
      e.preventDefault();
      const v = (id) => document.getElementById(id).value.trim();
      const r = A.register({ name: v("rName"), email: v("rEmail"), phone: v("rPhone"), country: v("rCountry") });
      m.classList.remove("on");
      HG.toast(`Welcome, ${r.name.split(" ")[0]}. Your paddle number is ${r.paddle}.`);
      document.dispatchEvent(new Event("hg:registered"));
      then();
    };
  };

  A.confirmBid = (sale, lot, amount, done) => {
    A.requireReg(() => {
      const m = document.getElementById("bidModal");
      document.getElementById("bidLot").textContent = `Lot ${lot.n} · ${sale.title}`;
      document.getElementById("bidRows").innerHTML = `
        <div><span>Your maximum bid</span><strong>${A.usd(amount)}</strong></div>
        <div><span>Buyer's premium (${A.PREMIUM * 100}%)</span><span>${A.usd(amount * A.PREMIUM)}</span></div>
        <div class="total"><span>Total if won at this price</span><strong>${A.usd(A.withPremium(amount))}</strong></div>
        <p class="muted small">Plus shipping and any import duties. Paddle ${db.reg.paddle}.</p>`;
      m.classList.add("on");
      document.getElementById("bidConfirm").onclick = () => {
        m.classList.remove("on");
        done(A.placeBid(sale, lot, amount));
      };
    });
  };

  /* live ticking: countdowns update every second; the room bids every few seconds */
  A.run = (onChange) => {
    setInterval(() => {
      document.querySelectorAll("[data-countdown]").forEach((el) => {
        const [sid, n] = el.dataset.countdown.split(":");
        const sale = HG.sale(sid), lot = A.lot(sale, n);
        const ms = A.endsAt(sale, lot) - Date.now();
        el.textContent = A.fmt(ms);
        el.closest(".closes, .countdown")?.classList.toggle("urgent", ms > 0 && ms < 5 * MIN);
        if (ms <= 0 && !el.dataset.done) { el.dataset.done = 1; onChange && onChange({ type: "closed", sale, lot }); }
      });
    }, 1000);
    setInterval(() => {
      const ev = A.simulate();
      ev.forEach((e) => e.text && HG.toast(e.text));
      if (ev.length && onChange) ev.forEach(onChange);
    }, 6000);
  };

  document.addEventListener("click", (e) => {
    const w = e.target.closest("[data-watch]");
    if (!w) return;
    e.preventDefault();
    const [sid, n] = w.dataset.watch.split(":");
    const sale = HG.sale(sid), on = A.toggleWatch(sale, A.lot(sale, n));
    document.querySelectorAll(`[data-watch="${w.dataset.watch}"]`).forEach((b) => b.classList.toggle("on", on));
    HG.toast(on ? `Watching Lot ${n}` : `Stopped watching Lot ${n}`);
  });
})();
