# Hare & Grouse

A luxury marketplace website for antique and vintage furniture, lighting, décor, fine art, jewelry, fashion and watches. It is a plain HTML, CSS and JavaScript site with no build step.

## Pages
- `index.html`: homepage with a hero carousel, category circles, New Arrivals, Trending, Shop by Style, Jewelry & Watches, Featured Dealers, Trade and Sell banners, and The Journal
- `shop.html`: category and search results with filters (category, price, style, dealer location, sale, new, favorites) and sorting. It reads URL parameters such as `?cat=furniture`, `?style=Art%20Deco`, `?q=chair`, `?sale=1` and `?new=1`
- `product.html?id=hg-1001`: product detail page with a gallery and zoom, Add to Bag, favorites, a Make an Offer form, spec accordions, a dealer card and similar items

## Shared features
Mega-menu navigation, live search, a bag drawer, favorites, a currency switcher (USD, GBP, EUR and NGN), a mobile menu and a newsletter form. The bag, favorites and currency are saved in the browser's localStorage.

## Editing content
- Products, dealers, categories and articles are in `assets/js/data.js`. You can replace them with data from Airtable or Supabase.
- Brand colours and fonts are set at the top of `assets/css/styles.css`.
- Logo files are in `assets/img/`: gold, white and dark versions of the full logo, the monogram and the wordmark.
- The product photos in `assets/photos/` are Unsplash placeholders. Replace them with real inventory photos.

## Run locally
```
python3 -m http.server 8000
```
Then open http://localhost:8000. The site can also be deployed as-is to Netlify, Vercel or GitHub Pages.

## Not yet connected
Checkout, login, Make an Offer and the newsletter only show confirmation messages for now. They need to be connected to a backend, for example Stripe or Paystack for payments and n8n or Make webhooks for forms.
