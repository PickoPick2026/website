import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder"
);

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

const PRODUCT_URL_DOMAINS = [
  "amazon.in", "amazon.com", "flipkart.com", "myntra.com", "ajio.com",
  "nykaa.com", "tatacliq.com", "meesho.com", "firstcry.com", "fabindia.com",
  "bewakoof.com", "jiomart.com", "croma.com",
];

export default async function handler(req, res) {
  const query = req.query || {};
  const body = req.body || {};
  const requestPath = String(req.url || "").split("?")[0];
  const isLinkRequest = query.type === "link" || requestPath.endsWith("/analyze-link") || query.url || query.link || body.url || body.link;

  if (isLinkRequest) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    return handleAnalyzeLink(req, res);
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  return handleAnalyzeImage(req, res);
}

async function handleAnalyzeLink(req, res) {
  try {
    const link = req.method === "GET"
      ? (req.query?.url || req.query?.link)
      : (req.body?.url || req.body?.link);
    const parsedUrl = validateProductUrl(link);

    const productName = extractProductFromUrl(parsedUrl.toString());

    // Extract real product image from page
    let productImage = "";
    try {
      const pageRes = await fetchProductPage(parsedUrl);
      if (pageRes.ok) {
        const html = await pageRes.text();
        const match = html.match(/<meta[^>]+property=["'](?:og:image|og:image:secure_url)["'](?:[^>]+content=["']([^"']+)["'])?/i)
          || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["'](?:og:image|og:image:secure_url)["']/i)
          || html.match(/<meta[^>]+name=["'](?:twitter:image|twitter:image:src)["'][^>]+content=["']([^"']+)["']/i)
          || html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i)
          || html.match(/id=["']landingImage["'][^>]*src=["']([^"']+)["']/i)
          || html.match(/data-old-hires=["']([^"']+)["']/i);
        if (match && match[1]) {
          productImage = match[1].replace(/&amp;/g, "&");
        }
      }
    } catch (e) {
      console.warn("Could not fetch page og:image:", e);
    }

    const localProducts = await searchSupabaseProducts(productName);
    const stores = ["Amazon India", "Flipkart", "Google Shopping"];
    const universalResults = stores.map((store, i) => ({
      id: `link-universal-${i}`,
      name: productName,
      price: "Check Store",
      store: store,
      source: store.toLowerCase().split(" ")[0],
      image: productImage || (localProducts[0]?.image || ""),
      category: "E-commerce",
      inStock: true,
      url: buildStoreUrl(store, productName),
      description: `View ${productName} details on ${store}`
    }));

    return res.json({
      source: localProducts.length > 0 ? "mixed" : "universal",
      identified: productName,
      image: productImage || (localProducts[0]?.image || ""),
      results: [...localProducts, ...universalResults],
    });
  } catch (error) {
    if (error instanceof TypeError && error.message.startsWith("Invalid product URL:")) {
      return res.status(400).json({ error: error.message.replace("Invalid product URL: ", "") });
    }
    console.error("Analyze Link Error:", error);
    return res.status(500).json({ error: "Failed to analyze link" });
  }
}

function validateProductUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError("Invalid product URL: Provide a product URL in the `url` query parameter.");
  }
  if (value.length > 4096) {
    throw new TypeError("Invalid product URL: The URL is too long.");
  }

  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new TypeError("Invalid product URL: Use a complete HTTPS product URL.");
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  const isSupportedDomain = PRODUCT_URL_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
  if (url.protocol !== "https:" || !isSupportedDomain || url.username || url.password) {
    throw new TypeError("Invalid product URL: Use an HTTPS link from a supported Indian store.");
  }

  return url;
}

async function fetchProductPage(initialUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  let currentUrl = initialUrl;

  try {
    for (let redirects = 0; redirects <= 3; redirects += 1) {
      const response = await fetch(currentUrl, {
        redirect: "manual",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: controller.signal,
      });

      if (response.status < 300 || response.status >= 400) return response;
      const location = response.headers.get("location");
      if (!location || redirects === 3) return response;
      currentUrl = validateProductUrl(new URL(location, currentUrl).toString());
    }
  } finally {
    clearTimeout(timeout);
  }
}

function extractProductFromUrl(link) {
  try {
    const url = new URL(link);
    const host = url.hostname.toLowerCase();
    if (host.includes("amazon")) {
      const parts = url.pathname.split("/");
      const namePart = parts.find(p =>
        p.length > 5 &&
        !p.includes(".") &&
        !["dp", "gp", "product-reviews"].includes(p) &&
        !/^B[A-Z0-9]{9}$/i.test(p) &&
        !/^\d{9,}$/.test(p)
      );
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
