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
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "No query provided" });

    const localProducts = await searchSupabaseProducts(query);
    const stores = ["Amazon India", "Flipkart", "Google Shopping"];
    const universalResults = stores.map((store, i) => ({
      id: `search-universal-${i}`,
      name: query,
      price: "Check Price",
      store: store,
      source: store.toLowerCase().split(' ')[0],
      image: "",
      category: "General",
      inStock: true,
      url: buildStoreUrl(store, query),
      description: `Find ${query} on ${store}`
    }));

    res.json({
      source: localProducts.length > 0 ? "mixed" : "universal",
      results: [...localProducts, ...universalResults]
    });

  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Search failed" });
  }
}

async function searchSupabaseProducts(keyword) {
  try {
    const { data, error } = await supabase
      .from("productTable")
      .select(`productID, productName, price, stock, imageURL, category:categoryID (categoryName)`)
      .or(`productName.ilike.%${keyword}%,description.ilike.%${keyword}%`)
      .limit(10);

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
