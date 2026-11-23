# Hare & Grouse

Website for Hare & Grouse, an art gallery. It has four main sections: **Art**, **Vintage**, **Watches** and **Auction**. It is a plain HTML, CSS and JavaScript site with no build step.

Brand colours: deep green `#031706`, gold `#CD9A49` and white `#FFFFFF`. They are defined as tokens at the top of `assets/css/styles.css`.

## Pages
| Page | Purpose |
|---|---|
| `index.html` | Homepage with a hero carousel, the four sections, a live auction band, new works, artists, Vintage, Watches & Jewelry, Consign and Advisory banners, The Journal and a Visit the Gallery section |
| `shop.html` | Art, Vintage and Watches listings with filters (category, price, style, artist, sale, new) and sorting. Uses `?cat=art`, `?q=`, `?style=` and similar parameters |
| `product.html?id=` | A single work, with a gallery and zoom, Add to Bag, favourites, Enquire or Make an Offer, and similar works |
| `auctions.html` | The Saleroom, with tabs for Live & Upcoming, Past Results and My Bids & Watchlist, plus How to Bid |
| `sale.html?id=` | A sale's lots, with search, filters (open, my bids, watching), sorting and live countdowns |
| `lot.html?sale=&lot=` | Lot detail with the bidding panel, bid history, condition, provenance and next/previous lot links |

## How the auction works
- **Registration:** a bidder registers once and gets a paddle number that covers every sale.
- **Maximum (proxy) bidding:** the bidder enters the most they will pay. The system bids for them one increment at a time, only when someone bids against them.
- **Tie rule:** when two maximum bids are equal, the earlier bid wins.
- **Bid increments** rise with the price: $50 under $1k, $100 under $2k, $250 under $5k, $500 under $10k, $1,000 under $20k, $2,500 under $50k, $5,000 under $100k, then $10,000.
- **Confidential reserves:** the price jumps to the reserve once a maximum bid covers it. The lot shows "Reserve met" or "Reserve not met".
- **Staggered closing with soft close:** lots close 2 minutes apart. A bid in the final 2 minutes extends that lot by 2 minutes.
- **Buyer's premium:** 25%, shown on every bid confirmation and on the winning invoice.
- **Notifications:** on-page alerts when the bidder is outbid, when their maximum bid responds, or when a lot is extended.

### Demo mode vs production
`assets/js/auction.js` runs the auction in the browser so the site works with no server. A simulated room of other bidders places bids while a page is open. The demo timeline restarts 8 hours after a visitor's first visit. Sale and lot data are in `assets/js/auction-data.js`.

For real sales, use **Supabase**. `docs/auction-supabase.sql` creates the tables, security rules, a server-side `place_bid()` function with the same rules, `close_lots()` to settle lots and create invoices, and real-time updates. It was tested on Postgres 16. Paste it into the Supabase SQL Editor and run it. Then:
1. Enable `pg_cron` and schedule `close_lots()` every minute. The line to do this is at the bottom of the SQL file.
2. In the site, replace `HG.auction.placeBid` with `supabase.rpc('place_bid', { p_lot, p_max })`, and subscribe to the `lots` and `bids` tables for live updates.
3. Connect an n8n or Make webhook to new `invoices` rows to email winners and send a Paystack or Stripe payment link.

## Content to replace before launch
- `assets/js/data.js`: works for sale, artists, categories and articles. The artist names and works are **samples**.
- `assets/js/auction-data.js`: auction sales and lots (samples).
- The Visit section in `index.html`: the gallery address and opening hours are placeholders.
- `assets/photos/`: stock photos from Unsplash. Replace them with photographs of the real works.

## Run locally
```
python3 -m http.server 8000
```
Then open http://localhost:8000.
