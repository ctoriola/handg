/* Hare & Grouse — catalogue data
   Replace these sample records with your live inventory (Airtable / Supabase / CMS). */
window.HG = window.HG || {};

HG.categories = [
  { slug: "furniture", name: "Furniture", img: "sofa.jpg",
    subs: ["Seating", "Tables", "Storage & Case Pieces", "Beds", "Desks", "Mirrors"] },
  { slug: "lighting", name: "Lighting", img: "lamp2.jpg",
    subs: ["Floor Lamps", "Table Lamps", "Chandeliers & Pendants", "Sconces"] },
  { slug: "decor", name: "Décor", img: "vase.jpg",
    subs: ["Vases & Vessels", "Ceramics", "Sculptures", "Rugs & Carpets", "Decorative Objects"] },
  { slug: "art", name: "Art", img: "art.jpg",
    subs: ["Paintings", "Prints & Multiples", "Photography", "Sculpture"] },
  { slug: "jewelry", name: "Jewelry", img: "ring.jpg",
    subs: ["Rings", "Necklaces", "Earrings", "Bracelets", "Brooches"] },
  { slug: "fashion", name: "Fashion", img: "bag.jpg",
    subs: ["Handbags", "Clothing", "Accessories", "Shoes"] },
  { slug: "watches", name: "Watches", img: "watch.jpg",
    subs: ["Wrist Watches", "Pocket Watches", "Clocks"] }
];

HG.styles = ["Mid-Century Modern", "Art Deco", "Victorian", "Contemporary", "Scandinavian", "Hollywood Regency", "Georgian", "Modernist"];

HG.dealers = [
  { id: "ashby", name: "Ashby & Vale Antiques", city: "London, UK", since: 1987, img: "dealer2.jpg", rating: 4.9 },
  { id: "mercer", name: "Mercer Street Modern", city: "New York, NY", since: 2004, img: "dealer3.jpg", rating: 4.8 },
  { id: "ikoyi", name: "Ikoyi Design House", city: "Lagos, Nigeria", since: 2016, img: "dealer1.jpg", rating: 5.0 },
  { id: "rivage", name: "Galerie Rivage", city: "Paris, France", since: 1979, img: "room1.jpg", rating: 4.9 },
  { id: "halden", name: "Halden & Co. Fine Jewels", city: "Geneva, Switzerland", since: 1962, img: "jewel.jpg", rating: 5.0 },
  { id: "corsair", name: "Corsair Horology", city: "Milan, Italy", since: 1998, img: "watch2.jpg", rating: 4.7 }
];

HG.products = [
  { id: "hg-1001", name: "Emerald Velvet Three-Seat Sofa, 1960s", cat: "furniture", sub: "Seating", style: "Mid-Century Modern", period: "1960-1969", material: "Velvet, Walnut", price: 6850, dealer: "mercer", img: "sofa.jpg", gallery: ["sofa.jpg", "room1.jpg", "dealer2.jpg"], dims: "W 210 cm × D 88 cm × H 78 cm", condition: "Excellent", isNew: true },
  { id: "hg-1002", name: "Tufted Bouclé Slipper Chair", cat: "furniture", sub: "Seating", style: "Hollywood Regency", period: "1950-1959", material: "Bouclé, Lacquered Wood", price: 2400, dealer: "rivage", img: "chair.jpg", gallery: ["chair.jpg", "room3.jpg"], dims: "W 62 cm × D 66 cm × H 84 cm", condition: "Very Good", isNew: true },
  { id: "hg-1003", name: "Danish Shell Side Chair", cat: "furniture", sub: "Seating", style: "Scandinavian", period: "1970-1979", material: "Moulded Polymer, Beech", price: 780, was: 980, dealer: "ashby", img: "chair2.jpg", gallery: ["chair2.jpg", "study.jpg"], dims: "W 49 cm × D 54 cm × H 82 cm", condition: "Good", sale: true },
  { id: "hg-1004", name: "Pair of Rustic Ladder-Back Chairs", cat: "furniture", sub: "Seating", style: "Georgian", period: "1800-1849", material: "Elm, Rush", price: 1650, dealer: "ashby", img: "chair3.jpg", gallery: ["chair3.jpg"], dims: "W 44 cm × D 42 cm × H 96 cm", condition: "Fair, age-appropriate wear" },
  { id: "hg-1005", name: "Camel Leather Lounge Sofa", cat: "furniture", sub: "Seating", style: "Contemporary", period: "2020-Present", material: "Aniline Leather, Oak", price: 9200, dealer: "ikoyi", img: "sofa2.jpg", gallery: ["sofa2.jpg", "room1.jpg"], dims: "W 230 cm × D 95 cm × H 74 cm", condition: "New", isNew: true },
  { id: "hg-1006", name: "Modular Sectional in Charcoal Wool", cat: "furniture", sub: "Seating", style: "Scandinavian", period: "2010-2019", material: "Wool, Steel", price: 5400, dealer: "mercer", img: "sofa3.jpg", gallery: ["sofa3.jpg"], dims: "W 280 cm × D 160 cm × H 70 cm", condition: "Excellent" },
  { id: "hg-1007", name: "Round Pedestal Dining Table", cat: "furniture", sub: "Tables", style: "Mid-Century Modern", period: "1960-1969", material: "Laminate, Cast Aluminium", price: 3100, dealer: "mercer", img: "table.jpg", gallery: ["table.jpg", "study.jpg"], dims: "Ø 107 cm × H 72 cm", condition: "Very Good", isNew: true },
  { id: "hg-1008", name: "Floating Oak Wall Cabinet", cat: "furniture", sub: "Storage & Case Pieces", style: "Contemporary", period: "2020-Present", material: "Limed Oak", price: 2950, dealer: "ikoyi", img: "cabinet.jpg", gallery: ["cabinet.jpg"], dims: "W 60 cm × D 30 cm × H 180 cm", condition: "New" },
  { id: "hg-1009", name: "Lacquered Credenza with Gallery Wall", cat: "furniture", sub: "Storage & Case Pieces", style: "Modernist", period: "1970-1979", material: "Lacquer, Brass", price: 4700, was: 5600, dealer: "rivage", img: "mirror.jpg", gallery: ["mirror.jpg"], dims: "W 180 cm × D 45 cm × H 70 cm", condition: "Excellent", sale: true },
  { id: "hg-2001", name: "Architect's Adjustable Floor Lamp", cat: "lighting", sub: "Floor Lamps", style: "Modernist", period: "1950-1959", material: "Enamelled Steel", price: 1450, dealer: "ashby", img: "lamp.jpg", gallery: ["lamp.jpg", "room3.jpg"], dims: "H 165 cm", condition: "Very Good", isNew: true },
  { id: "hg-2002", name: "Industrial Dome Pendant", cat: "lighting", sub: "Chandeliers & Pendants", style: "Mid-Century Modern", period: "1960-1969", material: "Spun Aluminium", price: 620, dealer: "mercer", img: "lamp2.jpg", gallery: ["lamp2.jpg"], dims: "Ø 40 cm × H 28 cm", condition: "Excellent" },
  { id: "hg-3001", name: "Ivory Stoneware Amphora on Marble Plinth", cat: "decor", sub: "Vases & Vessels", style: "Contemporary", period: "2020-Present", material: "Stoneware, Rosso Marble", price: 1180, dealer: "ikoyi", img: "vase.jpg", gallery: ["vase.jpg"], dims: "Ø 28 cm × H 46 cm", condition: "New", isNew: true },
  { id: "hg-3002", name: "Porcelain Bud Vase", cat: "decor", sub: "Vases & Vessels", style: "Scandinavian", period: "1980-1989", material: "Porcelain", price: 240, dealer: "ashby", img: "vase2.jpg", gallery: ["vase2.jpg"], dims: "H 18 cm", condition: "Excellent" },
  { id: "hg-3003", name: "Set of Five Hand-Thrown Tumblers", cat: "decor", sub: "Ceramics", style: "Contemporary", period: "2020-Present", material: "Speckled Stoneware", price: 360, dealer: "ikoyi", img: "ceramics.jpg", gallery: ["ceramics.jpg"], dims: "H 9–12 cm", condition: "New" },
  { id: "hg-3004", name: "Hand-Knotted Silk Medallion Rug", cat: "decor", sub: "Rugs & Carpets", style: "Victorian", period: "1880-1889", material: "Silk", price: 14500, dealer: "rivage", img: "rug.jpg", gallery: ["rug.jpg"], dims: "300 cm × 200 cm", condition: "Very Good, minor restoration" },
  { id: "hg-4001", name: "Still Life with Peonies, Dutch School", cat: "art", sub: "Paintings", style: "Georgian", period: "1700-1749", material: "Oil on Canvas", price: 38000, dealer: "rivage", img: "art.jpg", gallery: ["art.jpg"], dims: "61 cm × 91 cm (unframed)", condition: "Good, relined", isNew: true },
  { id: "hg-4002", name: "Sunfire, Abstract Composition", cat: "art", sub: "Paintings", style: "Contemporary", period: "2020-Present", material: "Acrylic on Canvas", price: 5200, dealer: "ikoyi", img: "art2.jpg", gallery: ["art2.jpg"], dims: "120 cm × 150 cm", condition: "New" },
  { id: "hg-4003", name: "Lakeside Pastoral Landscape", cat: "art", sub: "Paintings", style: "Victorian", period: "1850-1859", material: "Oil on Board", price: 12800, was: 15000, dealer: "ashby", img: "painting.jpg", gallery: ["painting.jpg"], dims: "45 cm × 70 cm", condition: "Very Good", sale: true },
  { id: "hg-4004", name: "Prism Mural Study", cat: "art", sub: "Prints & Multiples", style: "Contemporary", period: "2010-2019", material: "Screenprint, Edition of 40", price: 1900, dealer: "mercer", img: "art3.jpg", gallery: ["art3.jpg"], dims: "70 cm × 100 cm", condition: "Excellent" },
  { id: "hg-5001", name: "Old European Cut Diamond Halo Ring", cat: "jewelry", sub: "Rings", style: "Art Deco", period: "1920-1929", material: "Platinum, 1.2 ct Diamond", price: 18600, dealer: "halden", img: "ring.jpg", gallery: ["ring.jpg"], dims: "Size 6 (resizable)", condition: "Excellent", isNew: true },
  { id: "hg-5002", name: "Akoya Pearl Strand with Diamond Clasp", cat: "jewelry", sub: "Necklaces", style: "Art Deco", period: "1930-1939", material: "Akoya Pearls, White Gold", price: 7400, dealer: "halden", img: "jewel.jpg", gallery: ["jewel.jpg"], dims: "L 45 cm", condition: "Very Good" },
  { id: "hg-5003", name: "Sapphire and Diamond Pendant Earrings", cat: "jewelry", sub: "Earrings", style: "Victorian", period: "1890-1899", material: "Silver-topped Gold, Sapphire", price: 9800, dealer: "halden", img: "earrings.jpg", gallery: ["earrings.jpg"], dims: "L 4.2 cm", condition: "Excellent" },
  { id: "hg-5004", name: "Crescent Moon & Topaz Layered Necklace", cat: "jewelry", sub: "Necklaces", style: "Contemporary", period: "2020-Present", material: "18k Gold, London Blue Topaz", price: 2650, dealer: "ikoyi", img: "necklace.jpg", gallery: ["necklace.jpg"], dims: "L 40 / 50 cm", condition: "New", isNew: true },
  { id: "hg-6001", name: "Coral Top-Handle Leather Bag", cat: "fashion", sub: "Handbags", style: "Contemporary", period: "2020-Present", material: "Calfskin, Palladium Hardware", price: 3300, dealer: "rivage", img: "bag.jpg", gallery: ["bag.jpg"], dims: "W 28 cm × H 22 cm × D 12 cm", condition: "Pristine", isNew: true },
  { id: "hg-7001", name: "Automatic Steel Dress Watch, 38 mm", cat: "watches", sub: "Wrist Watches", style: "Modernist", period: "2010-2019", material: "Stainless Steel", price: 4800, dealer: "corsair", img: "watch.jpg", gallery: ["watch.jpg"], dims: "Case 38 mm", condition: "Excellent, box & papers" },
  { id: "hg-7002", name: "Minimalist Field Watch on Leather", cat: "watches", sub: "Wrist Watches", style: "Scandinavian", period: "2020-Present", material: "Steel, Calf Leather", price: 690, was: 850, dealer: "corsair", img: "watch2.jpg", gallery: ["watch2.jpg"], dims: "Case 36 mm", condition: "New", sale: true }
];

HG.articles = [
  { title: "How to Spot Authentic Art Deco Jewelry", tag: "Collecting Guide", img: "earrings.jpg", read: "6 min read" },
  { title: "Inside a Lagos Collector's Modernist Home", tag: "Interiors", img: "room1.jpg", read: "8 min read" },
  { title: "The Return of Bouclé: Why Texture Is Everything", tag: "Trends", img: "chair.jpg", read: "4 min read" }
];

HG.img = (f) => "assets/photos/" + f;
HG.byId = (id) => HG.products.find((p) => p.id === id);
HG.dealer = (id) => HG.dealers.find((d) => d.id === id);
HG.catName = (slug) => (HG.categories.find((c) => c.slug === slug) || {}).name || "All";
