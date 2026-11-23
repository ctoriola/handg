/* Hare & Grouse — shared UI: header, footer, currency, favourites, bag, search */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- storage helpers (safe in private mode) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("hg_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("hg_" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- currency ---------- */
  const RATES = { USD: { r: 1, s: "$" }, GBP: { r: 0.79, s: "£" }, EUR: { r: 0.92, s: "€" }, NGN: { r: 1550, s: "₦" } };
  HG.currency = store.get("cur", "USD");
  HG.money = (usd) => {
    const c = RATES[HG.currency] || RATES.USD;
    return c.s + Math.round(usd * c.r).toLocaleString("en-US");
  };

  /* ---------- favourites & bag ---------- */
  HG.favs = new Set(store.get("favs", []));
  HG.bag = store.get("bag", []);
  HG.toggleFav = (id) => {
    HG.favs.has(id) ? HG.favs.delete(id) : HG.favs.add(id);
    store.set("favs", [...HG.favs]);
    updateCounts();
    $$(`[data-fav="${id}"]`).forEach((b) => b.classList.toggle("on", HG.favs.has(id)));
    toast(HG.favs.has(id) ? "Saved to Favorites" : "Removed from Favorites");
  };
  HG.addToBag = (id) => {
    if (!HG.bag.includes(id)) HG.bag.push(id);
    store.set("bag", HG.bag);
    updateCounts();
    renderBag();
    openDrawer("bag");
  };
  HG.removeFromBag = (id) => {
    HG.bag = HG.bag.filter((x) => x !== id);
    store.set("bag", HG.bag);
    updateCounts();
    renderBag();
  };

  /* ---------- icons ---------- */
  const ico = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-9-9.2C1.7 7.3 4 4 7.4 4c2 0 3.6 1.1 4.6 2.7C13 5.1 14.6 4 16.6 4 20 4 22.3 7.3 21 10.8 19 15.6 12 20 12 20z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };
  HG.ico = ico;

  /* ---------- product card ---------- */
  HG.card = (p) => {
    return `<article class="card">
      <a class="card-img" href="product.html?id=${p.id}">
        <img src="${HG.img(p.img)}" alt="${p.name}" loading="lazy">
        ${p.sale ? '<span class="badge">Sale</span>' : p.isNew ? '<span class="badge badge-light">New Arrival</span>' : ""}
      </a>
      <button class="fav ${HG.favs.has(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Save ${p.name}">${ico.heart}</button>
      <a class="card-body" href="product.html?id=${p.id}">
        ${p.artist ? `<p class="card-artist">${p.artist}</p>` : ""}
        <h3 class="${p.artist ? "work-title" : ""}">${p.name}</h3>
        ${p.artist ? `<p class="meta">${p.material}</p>` : `<p class="meta">${p.sub} · ${p.period.replace("-", "–")}</p>`}
        <p class="price">${p.was ? `<s>${HG.money(p.was)}</s> ` : ""}${HG.money(p.price)}</p>
      </a>
    </article>`;
  };

  /* ---------- header ---------- */
  function header() {
    const mega = (c) => `
      <li class="has-mega">
        <a href="shop.html?cat=${c.slug}">${c.name}</a>
        <div class="mega">
          <div class="mega-inner">
            <div><h4>${c.name}</h4><ul>${c.subs.map((s) => `<li><a href="shop.html?cat=${c.slug}&sub=${encodeURIComponent(s)}">${s}</a></li>`).join("")}<li><a class="all" href="shop.html?cat=${c.slug}">View all ${c.name}</a></li></ul></div>
            <div><h4>Explore</h4><ul>
              <li><a href="shop.html?cat=${c.slug}&new=1">New to the Gallery</a></li>
              ${HG.styles.slice(0, 5).map((s) => `<li><a href="shop.html?cat=${c.slug}&style=${encodeURIComponent(s)}">${s}</a></li>`).join("")}
              <li><a href="auctions.html">${c.name} at Auction</a></li></ul></div>
            <a class="mega-feature" href="shop.html?cat=${c.slug}"><img src="${HG.img(c.feature)}" alt="" loading="lazy"><span>${c.name}<small>${c.blurb}</small></span></a>
          </div>
        </div>
      </li>`;
    const sales = (HG.sales || []).filter((s) => !s.past);
    const auctionMega = `
      <li class="has-mega">
        <a href="auctions.html" class="nav-auction">Auction</a>
        <div class="mega">
          <div class="mega-inner">
            <div><h4>Auctions</h4><ul>
              <li><a href="auctions.html">Live &amp; Upcoming</a></li>
              <li><a href="auctions.html#results">Past Results</a></li>
              <li><a href="auctions.html#mybids">My Bids &amp; Watchlist</a></li>
              <li><a href="auctions.html#how">How to Bid</a></li>
              <li><a href="index.html#consign">Consign to Auction</a></li></ul></div>
            <div><h4>Current Sales</h4><ul>${sales.map((s) => `<li><a href="sale.html?id=${s.id}">${s.title}</a></li>`).join("")}</ul></div>
            <a class="mega-feature" href="auctions.html"><img src="${HG.img("gallery-auction.jpg")}" alt="" loading="lazy"><span>The Saleroom<small>Bid live online from anywhere in the world.</small></span></a>
          </div>
        </div>
      </li>`;

    return `
    <div class="topbar">
      <p>An art gallery for paintings, vintage design and fine watches · Viewing by appointment</p>
      <div class="topbar-right">
        <a href="index.html#journal">The Journal</a>
        <a href="index.html#consign">Consign</a>
        <a href="auctions.html#mybids">My Bids</a>
        <label class="cur"><span class="sr">Currency</span>
          <select id="currency">${Object.keys(RATES).map((k) => `<option ${k === HG.currency ? "selected" : ""}>${k}</option>`).join("")}</select>
        </label>
      </div>
    </div>
    <header class="site-header">
      <div class="header-row">
        <button class="icon-btn only-mobile" id="menuBtn" aria-label="Open menu">${ico.menu}</button>
        <form class="search" id="searchForm" role="search" action="shop.html">
          ${ico.search}<input id="searchInput" name="q" type="search" placeholder="Search artists, works, watches and lots" autocomplete="off">
          <div class="search-results" id="searchResults"></div>
        </form>
        <a class="brand" href="index.html" aria-label="Hare &amp; Grouse home">
          <img class="brand-mono" src="assets/img/monogram.png" alt="">
          <img class="brand-word" src="assets/img/wordmark.png" alt="Hare &amp; Grouse">
        </a>
        <div class="actions">
          <button class="icon-btn only-mobile" id="searchBtn" aria-label="Search">${ico.search}</button>
          <a class="icon-btn hide-mobile" href="auctions.html#mybids" aria-label="Account">${ico.user}<span class="lbl" id="acctLbl">Log In</span></a>
          <a class="icon-btn" href="shop.html?favs=1" aria-label="Favorites">${ico.heart}<span class="count" id="favCount"></span></a>
          <button class="icon-btn" id="bagBtn" aria-label="Shopping bag">${ico.bag}<span class="count" id="bagCount"></span></button>
        </div>
      </div>
      <nav class="main-nav" id="mainNav" aria-label="Main">
        <div class="mobile-nav-head only-mobile"><img src="assets/img/wordmark.png" alt="Hare &amp; Grouse"><button class="icon-btn" id="menuClose" aria-label="Close menu">${ico.close}</button></div>
        <ul>
          ${HG.categories.map(mega).join("")}
          ${auctionMega}
        </ul>
      </nav>
    </header>`;
  }

  /* ---------- footer ---------- */
  function footer() {
    return `
    <section class="trust">
      <div class="wrap trust-grid">
        <div><h4>Authenticity Guaranteed</h4><p>Every work is researched, documented and backed by our guarantee.</p></div>
        <div><h4>Specialist Advice</h4><p>Speak to our art, design and horology specialists before you buy or bid.</p></div>
        <div><h4>Secure Payments</h4><p>Pay by card, bank transfer or Paystack with full encryption.</p></div>
        <div><h4>Insured Global Shipping</h4><p>Fine-art couriers and insured delivery to more than 120 countries.</p></div>
      </div>
    </section>
    <footer class="site-footer">
      <div class="wrap footer-top">
        <div class="newsletter">
          <img src="assets/img/monogram-white.png" alt="" class="foot-mono">
          <h3>Be the first to know</h3>
          <p>New works, auction previews and stories from The Journal, delivered weekly.</p>
          <form id="newsForm"><input type="email" required placeholder="Your email address" aria-label="Email address"><button class="btn btn-gold">Sign Up</button></form>
        </div>
        <div class="foot-cols">
          <div><h4>Shop</h4><ul>${HG.categories.map((c) => `<li><a href="shop.html?cat=${c.slug}">${c.name}</a></li>`).join("")}</ul></div>
          <div><h4>About</h4><ul><li><a href="#">The Gallery</a></li><li><a href="#">Artists</a></li><li><a href="index.html#journal">The Journal</a></li><li><a href="#">Exhibitions</a></li><li><a href="index.html#visit">Visit &amp; Contact</a></li></ul></div>
          <div><h4>Customer Care</h4><ul><li><a href="#">Help Centre</a></li><li><a href="#">Conditions of Sale</a></li><li><a href="#">Shipping &amp; Returns</a></li><li><a href="#">Track an Order</a></li><li><a href="#">Make an Enquiry</a></li></ul></div>
          <div><h4>Auctions</h4><ul><li><a href="auctions.html">Live Auctions</a></li><li><a href="auctions.html#results">Past Results</a></li><li><a href="auctions.html#how">How to Bid</a></li><li><a href="index.html#consign">Consign</a></li></ul></div>
        </div>
      </div>
      <div class="wrap footer-bottom">
        <p>© ${new Date().getFullYear()} Hare &amp; Grouse. All rights reserved.</p>
        <ul><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li><li><a href="#">Cookies</a></li><li><a href="#">Accessibility</a></li></ul>
        <ul class="social"><li><a href="#">Instagram</a></li><li><a href="#">Pinterest</a></li><li><a href="#">LinkedIn</a></li><li><a href="#">TikTok</a></li></ul>
      </div>
    </footer>
    <aside class="drawer" id="bagDrawer" aria-label="Shopping bag" aria-hidden="true">
      <div class="drawer-head"><h3>Your Bag</h3><button class="icon-btn" data-close aria-label="Close bag">${ico.close}</button></div>
      <div class="drawer-body" id="bagBody"></div>
      <div class="drawer-foot" id="bagFoot"></div>
    </aside>
    <div class="scrim" id="scrim"></div>
    <div class="toast" id="toast" role="status"></div>`;
  }

  /* ---------- bag drawer ---------- */
  function renderBag() {
    const body = $("#bagBody"), foot = $("#bagFoot");
    if (!body) return;
    const items = HG.bag.map(HG.byId).filter(Boolean);
    if (!items.length) {
      body.innerHTML = '<p class="empty">Your bag is empty.<br>Discover something extraordinary.</p><a class="btn btn-dark block" href="shop.html">Start Shopping</a>';
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = items.map((p) => `
      <div class="bag-item">
        <img src="${HG.img(p.img)}" alt="">
        <div><a href="product.html?id=${p.id}">${p.name}</a><p class="muted">${HG.byline(p)}</p><strong>${HG.money(p.price)}</strong></div>
        <button class="link" data-remove="${p.id}">Remove</button>
      </div>`).join("");
    const total = items.reduce((s, p) => s + p.price, 0);
    foot.innerHTML = `<div class="sum"><span>Subtotal</span><strong>${HG.money(total)}</strong></div>
      <p class="muted small">Shipping and duties calculated at checkout.</p>
      <button class="btn btn-dark block" id="checkoutBtn">Proceed to Checkout</button>`;
  }

  function openDrawer() {
    $("#bagDrawer").classList.add("open");
    $("#bagDrawer").setAttribute("aria-hidden", "false");
    $("#scrim").classList.add("on");
  }
  function closeAll() {
    $("#bagDrawer").classList.remove("open");
    $("#bagDrawer").setAttribute("aria-hidden", "true");
    $("#mainNav").classList.remove("open");
    document.body.classList.remove("nav-open");
    $("#scrim").classList.remove("on");
    document.body.classList.remove("search-open");
  }

  function updateCounts() {
    const f = $("#favCount"), b = $("#bagCount");
    if (f) f.textContent = HG.favs.size || "";
    if (b) b.textContent = HG.bag.length || "";
  }

  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("on"), 2200);
  }
  HG.toast = toast;

  /* ---------- search ---------- */
  function search(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    return HG.products.filter((p) =>
      [p.name, p.artist, p.cat, p.sub, p.style, p.material, p.period].join(" ").toLowerCase().includes(q));
  }
  HG.search = search;

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    $("#hg-header").outerHTML = header();
    $("#hg-footer").outerHTML = footer();
    updateCounts();
    renderBag();
    try { const r = JSON.parse(localStorage.getItem("hg_auction_v1") || "{}").reg; if (r) $("#acctLbl").textContent = "Paddle " + r.paddle; } catch (e) {}

    $("#currency").addEventListener("change", (e) => {
      store.set("cur", e.target.value);
      location.reload();
    });
    $("#bagBtn").addEventListener("click", openDrawer);
    $("#scrim").addEventListener("click", closeAll);
    $("#menuBtn").addEventListener("click", () => { $("#mainNav").classList.add("open"); document.body.classList.add("nav-open"); $("#scrim").classList.add("on"); });
    $("#menuClose").addEventListener("click", closeAll);
    $("#searchBtn").addEventListener("click", () => { document.body.classList.toggle("search-open"); $("#searchInput").focus(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

    // mobile: tap category to expand mega list
    $$(".has-mega > a").forEach((a) => a.addEventListener("click", (e) => {
      if (window.innerWidth <= 900) { e.preventDefault(); a.parentElement.classList.toggle("expanded"); }
    }));

    const input = $("#searchInput"), res = $("#searchResults");
    input.addEventListener("input", () => {
      const r = search(input.value).slice(0, 5), q = input.value.trim().toLowerCase();
      const lots = [];
      if (q) (HG.sales || []).forEach((s) => s.lots.forEach((l) => (l.title + " " + l.artist).toLowerCase().includes(q) && lots.push([s, l])));
      res.innerHTML = r.length || lots.length
        ? r.map((p) => `<a href="product.html?id=${p.id}"><img src="${HG.img(p.img)}" alt=""><span>${p.name}<small>${p.artist ? p.artist + " · " : ""}${HG.catName(p.cat)} · ${HG.money(p.price)}</small></span></a>`).join("") +
          lots.slice(0, 3).map(([s, l]) => `<a href="lot.html?sale=${s.id}&lot=${l.n}"><img src="${HG.img(l.img)}" alt=""><span>${l.title}<small>Auction · Lot ${l.n} · ${s.title}</small></span></a>`).join("") +
          `<a class="see-all" href="shop.html?q=${encodeURIComponent(input.value)}">See all results for “${input.value}”</a>`
        : input.value ? '<p class="none">No matches yet. Try “oil”, “abstract” or “chronograph”.</p>' : "";
      res.classList.toggle("on", !!input.value);
    });
    input.addEventListener("blur", () => setTimeout(() => res.classList.remove("on"), 200));

    document.addEventListener("click", (e) => {
      const fav = e.target.closest("[data-fav]");
      if (fav) { e.preventDefault(); HG.toggleFav(fav.dataset.fav); }
      const rm = e.target.closest("[data-remove]");
      if (rm) HG.removeFromBag(rm.dataset.remove);
      if (e.target.closest("[data-close]")) closeAll();
      if (e.target.closest("#checkoutBtn")) toast("Checkout connects to your payment provider (Stripe / Paystack).");
    });

    $("#newsForm").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast("Thank you. You're on the list."); });

    // sticky header shadow
    const h = $(".site-header");
    window.addEventListener("scroll", () => h.classList.toggle("scrolled", window.scrollY > 40), { passive: true });

    document.dispatchEvent(new Event("hg:ready"));
  });
})();
