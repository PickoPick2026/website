import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { link } = req.body;
    if (!link) return res.status(400).json({ error: "No link provided" });

    // 🎯 Extract product name from URL
    const productName = extractProductFromUrl(link);
    console.log("🛠️ Link Analysis:", productName);

    const localProducts = await searchSupabaseProducts(productName);
    const stores = ["Amazon India", "Flipkart", "Google Shopping"];
    const universalResults = stores.map((store, i) => ({
      id: `link-universal-${i}`,
      name: productName,
      price: "Check Store",
      store: store,
      source: store.toLowerCase().split(' ')[0],
      image: "",
      category: "E-commerce",
      inStock: true,
      url: buildStoreUrl(store, productName),
      description: `View ${productName} details on ${store}`
    }));

    res.json({
      source: localProducts.length > 0 ? "mixed" : "universal",
      identified: productName,
      results: [...localProducts, ...universalResults]
    });

  } catch (error) {
    console.error("Analyze Link Error:", error);
    res.status(500).json({ error: "Failed to analyze link" });
  }
}

function extractProductFromUrl(link) {
  try {
    const url = new URL(link);
    const host = url.hostname.toLowerCase();
    
    if (host.includes('amazon')) {
      const pathParts = url.pathname.split('/');
      const namePart = pathParts.find(p => p.length > 5 && !p.includes('.') && p !== 'dp' && p !== 'gp');
      if (namePart) return decodeURIComponent(namePart.replace(/-/g, ' '));
    }
    
    if (host.includes('flipkart')) {
      const pathParts = url.pathname.split('/');
      if (pathParts[1]) return decodeURIComponent(pathParts[1].replace(/-/g, ' '));
    }

    if (host.includes('myntra')) {
      const pathParts = url.pathname.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      return decodeURIComponent(lastPart.replace(/-/g, ' ').replace(/\.html$/, '').replace(/\d+$/, ''));
    }

    const parts = url.pathname.split('/').filter(p => p.length > 3);
    if (parts.length > 0) return decodeURIComponent(parts.sort((a, b) => b.length - a.length)[0].replace(/[-_]/g, ' '));
  } catch (e) {}
  return "Product";
}

async function searchSupabaseProducts(keyword) {
  if (!keyword || keyword === "Product") return [];
  try {
    const { data, error } = await supabase
      .from("productTable")
      .select(`productID, productName, price, stock, imageURL, category:categoryID (categoryName)`)
      .or(`productName.ilike.%${keyword}%,description.ilike.%${keyword}%`)
      .limit(5);

    if (error) throw error;
    return (data || []).map((item) => {
      let imageUrl = "";
      try {
        const parsed = typeof item.imageURL === "string" ? JSON.parse(item.imageURL) : item.imageURL;
        if (Array.isArray(parsed)) imageUrl = parsed[0];
        else if (typeof parsed === "string") imageUrl = parsed;
      } catch { imageUrl = ""; }
      return {
        id: item.productID,
        name: item.productName,
        price: `₹${Number(item.price).toLocaleString("en-IN")}`,
        store: "PickoPick",
        source: "pickopick",
        image: imageUrl,
        category: item.category?.categoryName || "Other",
        inStock: Number(item.stock) > 0,
        url: "/products"
      };
    });
  } catch (error) { return []; }
}

function buildStoreUrl(store, productName) {
  const query = encodeURIComponent(productName);
  const storeLower = store.toLowerCase();
  if (storeLower.includes("amazon")) return `https://www.amazon.in/s?k=${query}`;
  if (storeLower.includes("flipkart")) return `https://www.flipkart.com/search?q=${query}`;
  return `https://www.google.com/search?q=${query}+buy+online+india`;
}
