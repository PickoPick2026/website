import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder"
);

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const type = req.query.type || (req.body?.link ? "link" : "image");

  if (type === "link" || req.body?.link) {
    return handleAnalyzeLink(req, res);
  } else {
    return handleAnalyzeImage(req, res);
  }
}

async function handleAnalyzeLink(req, res) {
  try {
    const { link } = req.body || {};
    if (!link) return res.status(400).json({ error: "No link provided" });

    const productName = extractProductFromUrl(link);
    const localProducts = await searchSupabaseProducts(productName);
    const stores = ["Amazon India", "Flipkart", "Google Shopping"];
    const universalResults = stores.map((store, i) => ({
      id: `link-universal-${i}`,
      name: productName,
      price: "Check Store",
      store: store,
      source: store.toLowerCase().split(" ")[0],
      image: "",
      category: "E-commerce",
      inStock: true,
      url: buildStoreUrl(store, productName),
      description: `View ${productName} details on ${store}`
    }));

    return res.json({
      source: localProducts.length > 0 ? "mixed" : "universal",
      identified: productName,
      results: [...localProducts, ...universalResults],
    });
  } catch (error) {
    console.error("Analyze Link Error:", error);
    return res.status(500).json({ error: "Failed to analyze link" });
  }
}

function extractProductFromUrl(link) {
  try {
    const url = new URL(link);
    const host = url.hostname.toLowerCase();
    if (host.includes("amazon")) {
      const parts = url.pathname.split("/");
      const namePart = parts.find(p => p.length > 5 && !p.includes(".") && p !== "dp" && p !== "gp");
      if (namePart) return decodeURIComponent(namePart.replace(/-/g, " "));
    }
    if (host.includes("flipkart")) {
      const parts = url.pathname.split("/");
      if (parts[1]) return decodeURIComponent(parts[1].replace(/-/g, " "));
    }
    if (host.includes("myntra")) {
      const parts = url.pathname.split("/");
      const lastPart = parts[parts.length - 1];
      return decodeURIComponent(lastPart.replace(/-/g, " ").replace(/\.html$/, "").replace(/\d+$/, ""));
    }
    const parts = url.pathname.split("/").filter(p => p.length > 3);
    if (parts.length > 0) return decodeURIComponent(parts.sort((a, b) => b.length - a.length)[0].replace(/[-_]/g, " "));
  } catch (e) {}
  return "Product";
}

async function handleAnalyzeImage(req, res) {
  try {
    const { image } = req.body || {};
    if (!image) return res.status(400).json({ error: "No image provided" });

    let identified = { productName: "Product", category: "General", estimatedPriceINR: "Check Store" };
    let geminiWorking = !!genAI;

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const identifyResponse = await model.generateContent({
          contents: [{
            parts: [
              { text: 'Identify this product specifically including brand and model. Return JSON ONLY: { "productName": "...", "category": "...", "estimatedPriceINR": "..." }' },
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
    const localProducts = await searchSupabaseProducts(productName);
    const stores = ["Amazon India", "Flipkart", "Google Shopping"];
    const universalResults = stores.map((store, i) => ({
      id: `universal-${i}`,
      name: productName,
      price: identified.estimatedPriceINR || "Check Price",
      store: store,
      source: store.toLowerCase().split(" ")[0],
      image: "",
      category: identified.category || "General",
      inStock: true,
      url: buildStoreUrl(store, productName),
      description: `Find ${productName} on ${store}`
    }));

    return res.json({
      source: localProducts.length > 0 ? "mixed" : "universal",
      identified: productName === "Product" ? "" : productName,
      results: [...localProducts, ...universalResults],
      aiFailed: !geminiWorking,
    });
  } catch (error) {
    console.error("Analyze Image Error:", error);
    return res.json({ source: "universal", identified: "", results: [], error: "Search ready" });
  }
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
        url: "/products",
      };
    });
  } catch (error) {
    console.error("Supabase search error:", error);
    return [];
  }
}

function buildStoreUrl(store, productName) {
  const query = encodeURIComponent(productName);
  const storeLower = store.toLowerCase();
  if (storeLower.includes("amazon")) return `https://www.amazon.in/s?k=${query}`;
  if (storeLower.includes("flipkart")) return `https://www.flipkart.com/search?q=${query}`;
  if (storeLower.includes("myntra")) return `https://www.myntra.com/${query.replace(/%20/g, "-")}`;
  return `https://www.google.com/search?q=${query}+buy+online+india`;
}
