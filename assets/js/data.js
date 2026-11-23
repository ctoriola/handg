/* Hare & Grouse — gallery catalogue data
   Sample records for layout. Replace with live inventory (Airtable / Supabase / CMS). */
window.HG = window.HG || {};

HG.categories = [
  { slug: "art", name: "Art", img: "art-saffron.jpg", feature: "gallery-salon.jpg",
    blurb: "Paintings, works on paper, prints and sculpture, from Old Masters to the most exciting contemporary voices.",
    subs: ["Paintings", "Works on Paper", "Prints & Multiples", "Photography", "Sculpture"] },
  { slug: "vintage", name: "Vintage", img: "vin-pendants.jpg", feature: "room1.jpg",
    blurb: "Vintage design, furniture, lighting, jewelry and objects, chosen to live alongside great art.",
    subs: ["Furniture", "Lighting", "Décor & Objects", "Jewelry", "Fashion & Handbags", "Rugs"] },
  { slug: "watches", name: "Watches", img: "watch-bronze.jpg", feature: "watch-trio.jpg",
    blurb: "Pre-owned and vintage timepieces, authenticated and serviced by our horology specialists.",
    subs: ["Wrist Watches", "Pocket Watches", "Clocks"] }
];

HG.styles = ["Old Masters", "19th Century", "Modern", "Contemporary", "Abstract", "Mid-Century Modern", "Art Deco", "Scandinavian"];

/* Sample artists. Names are placeholders: replace with the gallery's real roster. */
HG.artists = [
  { id: "okafor", name: "Adaeze Okafor", origin: "Lagos, b. 1988", img: "art-portrait.jpg", note: "Large-scale portraiture" },
  { id: "bakare", name: "Tunde Bakare", origin: "Ibadan, b. 1979", img: "art-blue.jpg", note: "Gestural abstraction" },
  { id: "lindqvist", name: "Maren Lindqvist", origin: "Stockholm, b. 1972", img: "art-sea.jpg", note: "Seascapes in oil" },
  { id: "osei", name: "Kojo Osei", origin: "Accra, b. 1991", img: "art-geometric.jpg", note: "Hard-edge geometry" }
];

HG.products = [
  /* ---------- ART ---------- */
  { id: "hg-1001", name: "Still Life with Peonies and Tulips", artist: "Dutch School, 17th Century", cat: "art", sub: "Paintings", style: "Old Masters", period: "1650-1699", material: "Oil on canvas", price: 38000, img: "art.jpg", gallery: ["art.jpg", "gallery-salon.jpg"], dims: "61 × 91 cm (unframed)", condition: "Good, relined", isNew: true },
  { id: "hg-1002", name: "Lady in Saffron", artist: "English School, 19th Century", cat: "art", sub: "Paintings", style: "19th Century", period: "1860-1869", material: "Oil on canvas", price: 46500, img: "art-saffron.jpg", gallery: ["art-saffron.jpg", "gallery-salon.jpg"], dims: "92 × 66 cm", condition: "Very good, original frame", isNew: true },
  { id: "hg-1003", name: "Gaze", artist: "Adaeze Okafor", artistId: "okafor", cat: "art", sub: "Paintings", style: "Contemporary", period: "2024", material: "Acrylic and spray paint on canvas", price: 14800, img: "art-portrait.jpg", gallery: ["art-portrait.jpg", "gallery-white.jpg"], dims: "150 × 120 cm", condition: "New, direct from the artist", isNew: true },
  { id: "hg-1004", name: "Harmattan Blue", artist: "Tunde Bakare", artistId: "bakare", cat: "art", sub: "Paintings", style: "Abstract", period: "2023", material: "Oil on linen", price: 9200, img: "art-blue.jpg", gallery: ["art-blue.jpg", "gallery-white.jpg"], dims: "100 × 100 cm", condition: "New", isNew: true },
  { id: "hg-1005", name: "North Sea, Evening", artist: "Maren Lindqvist", artistId: "lindqvist", cat: "art", sub: "Paintings", style: "Contemporary", period: "2022", material: "Oil on canvas", price: 7600, img: "art-sea.jpg", gallery: ["art-sea.jpg"], dims: "120 × 90 cm", condition: "Excellent" },
  { id: "hg-1006", name: "Composition in Primaries", artist: "Kojo Osei", artistId: "osei", cat: "art", sub: "Paintings", style: "Abstract", period: "2024", material: "Acrylic on board", price: 5400, img: "art-geometric.jpg", gallery: ["art-geometric.jpg"], dims: "80 × 60 cm", condition: "New" },
  { id: "hg-1008", name: "Sunfire", artist: "Tunde Bakare", artistId: "bakare", cat: "art", sub: "Paintings", style: "Abstract", period: "2021", material: "Acrylic on canvas", price: 6200, img: "art2.jpg", gallery: ["art2.jpg"], dims: "120 × 150 cm", condition: "Excellent" },
  { id: "hg-1009", name: "Bloom I", artist: "Adaeze Okafor", artistId: "okafor", cat: "art", sub: "Works on Paper", style: "Contemporary", period: "2023", material: "Watercolour and gouache on paper", price: 2900, img: "art-bloom.jpg", gallery: ["art-bloom.jpg"], dims: "56 × 76 cm", condition: "New", isNew: true },
  { id: "hg-1011", name: "Prism Mural Study", artist: "Kojo Osei", artistId: "osei", cat: "art", sub: "Prints & Multiples", style: "Contemporary", period: "2019", material: "Screenprint, edition of 40", price: 1900, img: "art3.jpg", gallery: ["art3.jpg"], dims: "70 × 100 cm", condition: "Excellent" },
  { id: "hg-1012", name: "Marbled Ground", artist: "Tunde Bakare", artistId: "bakare", cat: "art", sub: "Prints & Multiples", style: "Abstract", period: "2022", material: "Giclée print, edition of 25", price: 1200, was: 1500, sale: true, img: "art-marble.jpg", gallery: ["art-marble.jpg"], dims: "60 × 80 cm", condition: "New" },

  /* ---------- VINTAGE ---------- */
  { id: "hg-2001", name: "Emerald Velvet Three-Seat Sofa, 1960s", cat: "vintage", sub: "Furniture", style: "Mid-Century Modern", period: "1960-1969", material: "Velvet, walnut", price: 6850, img: "sofa.jpg", gallery: ["sofa.jpg", "room1.jpg"], dims: "W 210 × D 88 × H 78 cm", condition: "Excellent", isNew: true },
  { id: "hg-2002", name: "Tufted Bouclé Slipper Chair", cat: "vintage", sub: "Furniture", style: "Art Deco", period: "1930-1939", material: "Bouclé, lacquered wood", price: 2400, img: "chair.jpg", gallery: ["chair.jpg", "room3.jpg"], dims: "W 62 × D 66 × H 84 cm", condition: "Very good" },
  { id: "hg-2003", name: "Bentwood Shell Lounge Chair", cat: "vintage", sub: "Furniture", style: "Scandinavian", period: "1960-1969", material: "Moulded plywood, leather", price: 3900, img: "vin-shellchair.jpg", gallery: ["vin-shellchair.jpg"], dims: "W 92 × D 83 × H 74 cm", condition: "Excellent", isNew: true },
  { id: "hg-2004", name: "Round Pedestal Dining Table", cat: "vintage", sub: "Furniture", style: "Mid-Century Modern", period: "1960-1969", material: "Laminate, cast aluminium", price: 3100, img: "table.jpg", gallery: ["table.jpg"], dims: "Ø 107 × H 72 cm", condition: "Very good" },
  { id: "hg-2005", name: "Cluster of Five Brass Pendants", cat: "vintage", sub: "Lighting", style: "Mid-Century Modern", period: "1950-1959", material: "Spun brass", price: 2750, img: "vin-pendants.jpg", gallery: ["vin-pendants.jpg"], dims: "Drop 80–140 cm", condition: "Excellent, rewired", isNew: true },
  { id: "hg-2006", name: "Architect's Adjustable Floor Lamp", cat: "vintage", sub: "Lighting", style: "Scandinavian", period: "1950-1959", material: "Enamelled steel", price: 1450, img: "lamp.jpg", gallery: ["lamp.jpg"], dims: "H 165 cm", condition: "Very good" },
  { id: "hg-2007", name: "Ivory Stoneware Amphora on Marble Plinth", cat: "vintage", sub: "Décor & Objects", style: "Modern", period: "1970-1979", material: "Stoneware, rosso marble", price: 1180, img: "vase.jpg", gallery: ["vase.jpg"], dims: "Ø 28 × H 46 cm", condition: "Excellent" },
  { id: "hg-2008", name: "Hand-Knotted Silk Medallion Rug", cat: "vintage", sub: "Rugs", style: "19th Century", period: "1880-1889", material: "Silk", price: 14500, img: "rug.jpg", gallery: ["rug.jpg"], dims: "300 × 200 cm", condition: "Very good, minor restoration" },
  { id: "hg-2009", name: "Old European Cut Diamond Halo Ring", cat: "vintage", sub: "Jewelry", style: "Art Deco", period: "1920-1929", material: "Platinum, 1.2 ct diamond", price: 18600, img: "ring.jpg", gallery: ["ring.jpg"], dims: "Size 6 (resizable)", condition: "Excellent", isNew: true },
  { id: "hg-2010", name: "Sapphire and Diamond Pendant Earrings", cat: "vintage", sub: "Jewelry", style: "19th Century", period: "1890-1899", material: "Silver-topped gold, sapphire", price: 9800, img: "earrings.jpg", gallery: ["earrings.jpg"], dims: "L 4.2 cm", condition: "Excellent" },
  { id: "hg-2011", name: "Akoya Pearl Strand with Diamond Clasp", cat: "vintage", sub: "Jewelry", style: "Art Deco", period: "1930-1939", material: "Akoya pearls, white gold", price: 7400, was: 8200, sale: true, img: "jewel.jpg", gallery: ["jewel.jpg"], dims: "L 45 cm", condition: "Very good" },
  { id: "hg-2012", name: "Coral Top-Handle Leather Bag", cat: "vintage", sub: "Fashion & Handbags", style: "Modern", period: "1990-1999", material: "Calfskin, palladium hardware", price: 3300, img: "bag.jpg", gallery: ["bag.jpg"], dims: "W 28 × H 22 × D 12 cm", condition: "Pristine" },

  /* ---------- WATCHES ---------- */
  { id: "hg-3001", name: "Bronze Chronograph, 44 mm", cat: "watches", sub: "Wrist Watches", style: "Contemporary", period: "2018", material: "Bronze, sapphire crystal", price: 7200, img: "watch-bronze.jpg", gallery: ["watch-bronze.jpg"], dims: "Case 44 mm", condition: "Excellent, box & papers", isNew: true },
  { id: "hg-3003", name: "Automatic Steel Dress Watch, 38 mm", cat: "watches", sub: "Wrist Watches", style: "Modern", period: "2010-2019", material: "Stainless steel", price: 4800, img: "watch.jpg", gallery: ["watch.jpg"], dims: "Case 38 mm", condition: "Excellent, serviced" },
  { id: "hg-3005", name: "Minimalist Leather Wristwatch", cat: "watches", sub: "Wrist Watches", style: "Scandinavian", period: "2020", material: "Steel, calf leather", price: 690, was: 850, sale: true, img: "watch2.jpg", gallery: ["watch2.jpg"], dims: "Case 36 mm", condition: "New" }
];

HG.articles = [
  { title: "Building a Collection: Where to Begin With West African Contemporary Art", tag: "Collecting Guide", img: "art-portrait.jpg", read: "7 min read" },
  { title: "Inside the Salesroom: How Our Online Auctions Work", tag: "Auctions", img: "gallery-auction.jpg", read: "5 min read" },
  { title: "Patina, Provenance and Papers: Buying a Vintage Watch", tag: "Watches", img: "watch-field.jpg", read: "6 min read" }
];

HG.img = (f) => "assets/photos/" + f;
HG.byId = (id) => HG.products.find((p) => p.id === id);
HG.catName = (slug) => (HG.categories.find((c) => c.slug === slug) || {}).name || "All";
HG.byline = (p) => p.artist || `${p.sub} · ${p.period.replace("-", "–")}`;
