/* Hare & Grouse — auction sales and lots (sample data)
   Times are offsets in minutes from the demo anchor (see auction.js).
   In production these come from the `sales` and `lots` tables (docs/auction-supabase.sql).

   Lot fields
     estLow / estHigh  published estimate (USD)
     start             opening bid
     reserve           confidential minimum (0 = no reserve)
     rival             hidden maximum of the simulated competing bidder (demo only)
     seed              number of bids already placed before the visitor arrives (demo only)
*/
window.HG = window.HG || {};

HG.sales = [
  {
    id: "hg-2611", title: "Modern & Contemporary Art", code: "HG2611",
    subtitle: "Online auction · Lots close one by one, two minutes apart",
    img: "gallery-auction.jpg", category: "art",
    opens: -4320, closes: 45, stagger: 2,
    intro: "A tightly edited sale of paintings and works on paper, from Old Master scenes to bold contemporary abstraction, with strong West African representation.",
    lots: [
      { n: 1, title: "Cavalry Skirmish in a Rocky Landscape", artist: "Italian School, 17th Century", img: "art-cavalry.jpg", medium: "Oil on canvas", dims: "74 × 112 cm", estLow: 8000, estHigh: 12000, start: 4000, reserve: 6500, rival: 9500, seed: 6, provenance: "Private collection, Florence; by descent.", condition: "Relined. Scattered retouching visible under UV, principally in the sky. Surface stable." },
      { n: 2, title: "A Man-of-War Firing a Salute in a Calm", artist: "Dutch School, circa 1680", img: "art-ship.jpg", medium: "Oil on panel", dims: "48 × 63 cm", estLow: 15000, estHigh: 25000, start: 8000, reserve: 12000, rival: 19000, seed: 8, provenance: "Acquired by the present owner's grandfather, London, 1950s.", condition: "Panel cradled. Minor losses along lower edge. Varnish slightly discoloured." },
      { n: 3, title: "Roses, Tulips and Morning Glory in a Stone Niche", artist: "Flemish School, 18th Century", img: "art-flowers.jpg", medium: "Oil on canvas", dims: "66 × 52 cm", estLow: 12000, estHigh: 18000, start: 6000, reserve: 9000, rival: 14500, seed: 5, provenance: "Country house sale, Wiltshire, 1987; private collection, Lagos.", condition: "Good overall. Fine craquelure throughout. Retouching to background, upper left." },
      { n: 4, title: "The Entombment", artist: "Spanish School, 17th Century", img: "art-entomb.jpg", medium: "Oil on canvas", dims: "102 × 84 cm", estLow: 20000, estHigh: 30000, start: 10000, reserve: 18000, rival: 17000, seed: 3, provenance: "Private collection, Madrid.", condition: "Relined. Areas of restoration to drapery. Presented in a later carved frame." },
      { n: 5, title: "Lovers in a Garden", artist: "French School, 19th Century", img: "art-swing.jpg", medium: "Oil on canvas", dims: "55 × 70 cm", estLow: 6000, estHigh: 9000, start: 3000, reserve: 0, rival: 7000, seed: 4, provenance: "Private collection, Paris.", condition: "Very good. Original canvas. Light surface dirt." },
      { n: 6, title: "Lakeside Pastoral at Dusk", artist: "English School, 19th Century", img: "painting.jpg", medium: "Oil on board", dims: "45 × 70 cm", estLow: 4000, estHigh: 6000, start: 2000, reserve: 3000, rival: 5200, seed: 7, provenance: "Private collection, Yorkshire.", condition: "Good. Minor frame abrasions to edges." },
      { n: 7, title: "Drip Field", artist: "Kojo Osei", img: "art-drip.jpg", medium: "Enamel on canvas, 2023", dims: "90 × 120 cm", estLow: 3000, estHigh: 5000, start: 1500, reserve: 0, rival: 4100, seed: 9, provenance: "Acquired directly from the artist.", condition: "Excellent. As made." },
      { n: 8, title: "Tide Study No. 4", artist: "Maren Lindqvist", img: "art-tide.jpg", medium: "Ink and acrylic on paper, 2023", dims: "50 × 70 cm", estLow: 1500, estHigh: 2500, start: 800, reserve: 1200, rival: 2000, seed: 4, provenance: "Acquired directly from the artist.", condition: "Excellent. Unframed." }
    ]
  },
  {
    id: "hg-2612", title: "Design & Decorative Arts", code: "HG2612",
    subtitle: "Online auction · Vintage furniture, lighting, objects and jewelry",
    img: "room1.jpg", category: "vintage",
    opens: -1440, closes: 360, stagger: 2,
    intro: "Mid-century furniture, lighting, ceramics and jewelry, ready to live alongside great art.",
    lots: [
      { n: 1, title: "Lacquered Credenza with Brass Sabots", artist: "European, 1970s", img: "mirror.jpg", medium: "Lacquer, brass", dims: "W 180 × D 45 × H 70 cm", estLow: 3000, estHigh: 5000, start: 1500, reserve: 2500, rival: 3800, seed: 5, provenance: "Private residence, Ikoyi.", condition: "Very good. Light scratches to top consistent with use." },
      { n: 2, title: "Danish Shell Side Chair", artist: "Danish, 1970s", img: "chair2.jpg", medium: "Moulded polymer, beech", dims: "W 49 × D 54 × H 82 cm", estLow: 600, estHigh: 900, start: 300, reserve: 0, rival: 750, seed: 6, provenance: "Private collection, Copenhagen.", condition: "Good. Minor scuffs to seat." },
      { n: 3, title: "Pair of Ladder-Back Chairs", artist: "English, early 19th Century", img: "chair3.jpg", medium: "Elm, rush", dims: "W 44 × D 42 × H 96 cm", estLow: 1200, estHigh: 1800, start: 600, reserve: 900, rival: 1400, seed: 3, provenance: "Country house, Suffolk.", condition: "Age-appropriate wear. Structurally sound." },
      { n: 4, title: "Floating Oak Wall Cabinet", artist: "Contemporary", img: "cabinet.jpg", medium: "Limed oak", dims: "W 60 × D 30 × H 180 cm", estLow: 2000, estHigh: 3000, start: 1000, reserve: 1600, rival: 2400, seed: 2, provenance: "Commissioned by the present owner.", condition: "Excellent." },
      { n: 5, title: "Industrial Dome Pendant", artist: "European, 1960s", img: "lamp2.jpg", medium: "Spun aluminium", dims: "Ø 40 × H 28 cm", estLow: 400, estHigh: 700, start: 200, reserve: 0, rival: 560, seed: 7, provenance: "Former textile mill, Manchester.", condition: "Good. Rewired to current standards." },
      { n: 6, title: "Set of Five Hand-Thrown Tumblers", artist: "Studio Pottery", img: "ceramics.jpg", medium: "Speckled stoneware", dims: "H 9–12 cm", estLow: 250, estHigh: 400, start: 120, reserve: 0, rival: 300, seed: 3, provenance: "Acquired from the potter.", condition: "Excellent." },
      { n: 7, title: "Crescent Moon & Topaz Layered Necklace", artist: "Contemporary", img: "necklace.jpg", medium: "18k gold, London blue topaz", dims: "L 40 / 50 cm", estLow: 1800, estHigh: 2800, start: 900, reserve: 1500, rival: 2300, seed: 5, provenance: "Private collection, Abuja.", condition: "As new." },
      { n: 8, title: "Porcelain Bud Vase", artist: "Scandinavian, 1980s", img: "vase2.jpg", medium: "Porcelain", dims: "H 18 cm", estLow: 150, estHigh: 250, start: 80, reserve: 0, rival: 190, seed: 4, provenance: "Private collection, Oslo.", condition: "Excellent." }
    ]
  },
  {
    id: "hg-2701", title: "Important Watches", code: "HG2701",
    subtitle: "Online auction · Previewing now, bidding opens soon",
    img: "watch-trio.jpg", category: "watches",
    opens: 4320, closes: 14400, stagger: 2,
    intro: "Independent and vintage timepieces, each authenticated and serviced by our horology specialists before sale.",
    lots: [
      { n: 1, title: "Skeleton Automatic, 42 mm", artist: "Swiss, circa 2020", img: "watch-skeleton.jpg", medium: "Titanium, rubber strap", dims: "Case 42 mm", estLow: 9000, estHigh: 14000, start: 5000, reserve: 8000, rival: 12000, seed: 0, provenance: "Single owner. Box and papers.", condition: "Unworn. Factory stickers intact." },
      { n: 2, title: "Military Field Watch on NATO Strap", artist: "British, 1960s", img: "watch-field.jpg", medium: "Steel, nylon strap", dims: "Case 36 mm", estLow: 1200, estHigh: 2000, start: 600, reserve: 1000, rival: 1700, seed: 0, provenance: "Issued 1964; by descent.", condition: "Patinated dial. Serviced 2025." },
      { n: 3, title: "A Collection of Three Chronographs", artist: "Swiss & Japanese, 1990s–2010s", img: "watch-trio.jpg", medium: "Steel and titanium", dims: "Cases 40–44 mm", estLow: 4000, estHigh: 6000, start: 2000, reserve: 3500, rival: 5000, seed: 0, provenance: "Private collection, Lagos.", condition: "Good to very good. Sold as one lot." }
    ]
  },
  {
    id: "hg-2609", title: "Collected Interiors & 19th Century Pictures", code: "HG2609",
    subtitle: "Online auction · Results", img: "art-landscape.jpg", category: "art",
    opens: -30240, closes: -20160, stagger: 2, past: true,
    intro: "Our autumn sale of pictures and furnishings achieved 92% sold by lot.",
    lots: [
      { n: 1, title: "Wooded Landscape with Drovers", artist: "Circle of the Norwich School", img: "art-landscape.jpg", medium: "Oil on panel", dims: "45 × 70 cm", estLow: 10000, estHigh: 15000, hammer: 17500, bids: 14 },
      { n: 2, title: "The Water Carrier", artist: "Continental School, 19th Century", img: "art-water.jpg", medium: "Oil on canvas", dims: "64 × 40 cm", estLow: 6000, estHigh: 9000, hammer: 8500, bids: 9 },
      { n: 3, title: "Camel Leather Lounge Sofa", artist: "Contemporary", img: "sofa2.jpg", medium: "Aniline leather, oak", dims: "W 230 cm", estLow: 5000, estHigh: 8000, hammer: 7000, bids: 6 },
      { n: 4, title: "Modular Sectional in Charcoal Wool", artist: "Scandinavian, 2010s", img: "sofa3.jpg", medium: "Wool, steel", dims: "W 280 cm", estLow: 3000, estHigh: 5000, hammer: 0, bids: 2 },
      { n: 5, title: "Sunlit Interior Study", artist: "Contemporary", img: "hero2.jpg", medium: "Archival pigment print", dims: "80 × 120 cm", estLow: 800, estHigh: 1200, hammer: 1600, bids: 11 }
    ]
  }
];

HG.sale = (id) => HG.sales.find((s) => s.id === id);
