import { GoogleGenerativeAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    let identified = { productName: "Product", category: "General", estimatedPriceINR: "Check Store" };
    let geminiWorking = !!genAI;

    // 🤖 Identify Product using Gemini AI
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const identifyResponse = await model.generateContent({
          contents: [{
            parts: [
              { text: "Identify this product specifically including brand and model. Return JSON ONLY: { \"productName\": \"...\", \"category\": \"...\", \"estimatedPriceINR\": \"...\" }" },
              { inlineData: { mimeType: "image/jpeg", data: image.split(",")[1] } }
            ]
          }],
          generationConfig: { responseMimeType: "application/json" }
        });
        const text = identifyResponse.response.text();
        identified = JSON.parse(text || "{}");
      } catch (e) {
        console.warn("AI ID failed, continuing to manual fallback silently:", e);
        geminiWorking = false;
      }
    }

    const productName = identified.productName || "Product";
    
    // 🔍 Search Local Supabase Warehouse
    const localProducts = await searchSupabaseProducts(productName);
    
    // 🌍 Build External Store Results
    const stores = ["Amazon India", "Flipkart", "Google Shopping"];
    const universalResults = stores.map((store, i) => ({
      id: `universal-${i}`,
      name: productName,
      price: identified.estimatedPriceINR || "Check Price",
      store: store,
      source: store.toLowerCase().split(' ')[0],
      image: "",
      category: identified.category || "General",
      inStock: true,
      url: buildStoreUrl(store, productName),
      description: `Find ${productName} on ${store}`
    }));

    res.json({
      source: localProducts.length > 0 ? "mixed" : "universal",
      identified: productName === "Product" ? "" : productName,
      results: [...localProducts, ...universalResults],
      aiFailed: !geminiWorking
    });

  } catch (error) {
    console.error("Analyze Image Error:", error);
    res.json({ source: "universal", identified: "", results: [], error: "Search ready" });
  }
}

// 🔍 Helper: Search Supabase
async function searchSupabaseProducts(keyword) {
  if (!keyword || keyword === "Product") return [];
  
  try {
    const { data, error } = await supabase
      .from("productTable")
      .select(`
        productID,
        productName,
        price,
        stock,
        imageURL,
        category:categoryID (categoryName)
      `)
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
      
      if (imageUrl.startsWith("blob:")) imageUrl = "";
      
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
  } catch (error) {
    console.error("Supabase search error:", error);
    return [];
  }
}

// 🔗 Helper: Build External URLs
function buildStoreUrl(store, productName) {
  const query = encodeURIComponent(productName);
  const storeLower = store.toLowerCase();
  if (storeLower.includes("amazon")) return `https://www.amazon.in/s?k=${query}`;
  if (storeLower.includes("flipkart")) return `https://www.flipkart.com/search?q=${query}`;
  if (storeLower.includes("myntra")) return `https://www.myntra.com/${query.replace(/%20/g, '-')}`;
  return `https://www.google.com/search?q=${query}+buy+online+india`;
}
