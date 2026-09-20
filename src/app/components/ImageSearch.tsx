import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ShoppingCart,
  ExternalLink,
  RefreshCw,
  Package,
  AlertCircle,
  Clipboard,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
  Image as ImageIcon,
  Copy,
  Calculator,
  Plane,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

// Inline Brand Logotypes
const BrandLogos = {
  pickopick: (className: string) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 6H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  amazon: (className: string) => (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.02 59.412c-2.454-3.14-5.46-5.836-8.756-7.86a.417.417 0 0 1 .412-.583c2.25 1.05 4.975 1.68 7.796 1.68a18.9 18.9 0 0 0 5.922-1.072.583.583 0 0 1 .325.79c-1.47 1.144-3.511 1.761-5.594 1.761a12.83 12.83 0 0 1-.105-2.716zm9.215-1.492c-.144-.196-.046-.408.172-.455 1.012-.204 2.373.157 3.19.859.184.16.14.432-.086.483-1.026.222-2.729-.387-3.276-.887z"
        fill="#000"
      />
      <path
        d="M12.33 34.2C8.6 34.2 5.1 36.17 5.1 40.75c0 1.34.21 2.53.53 3.52.12.38.35.34.45.02.1-.31.33-1.09.43-1.39.04-.15.02-.28-.09-.41-.26-.33-.61-1.03-.61-2.07 0-3.32 2.37-5.11 5.43-5.11 2.37 0 3.73.97 3.73 2.6 0 1.25-.66 2.31-2.04 2.31-.69 0-1.14-.37-1.14-.94 0-.32.07-.63.22-.96.22-.49.22-.49.22-.72 0-.25-.19-.48-.56-.48-.48 0-.96.48-.96 1.3 0 1.67 1.24 2.6 2.62 2.6 2.05 0 3.55-1.92 3.55-4.4 0-2.48-1.83-4.46-4.3-4.46z"
        fill="#000"
      />
    </svg>
  ),
  flipkart: (className: string) => (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M84.4 34.2v45.8c0 3-2.4 5.4-5.4 5.4H21c-3 0-5.4-2.4-5.4-5.4V34.2c0-1.2.7-2.3 1.9-2.8l32.5-13c.6-.2 1.3-.2 1.9 0l32.5 13c.1.5.8 1.6.8 2.8z"
        fill="#2874F0"
      />
      <path
        d="M50 45.4c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"
        fill="#FFD200"
      />
      <path
        d="M60.4 67.2c-.3 1.2-.8 2.3-1.5 3.3l-8.9-3.9-8.9 3.9c-.7-1-1.2-2.1-1.5-3.3-.3-1.2-.4-2.4-.4-3.6 0-1.2.1-2.4.4-3.6.3-1.2.8-2.3 1.5-3.3l8.9 3.9 8.9-3.9c.7 1 1.2 2.1 1.5 3.3.3 1.2.4 2.4.4 3.6.1 1.3 0 2.5-.4 3.6z"
        fill="#FFF"
      />
    </svg>
  ),
};

interface ProductResult {
  id: number | string;
  name: string;
  price: string;
  store: string;
  source: "pickopick" | "amazon" | "flipkart" | string;
  image?: string;
  imageURL?: string;
  imageUrl?: string;
  thumbnail?: string;
  url: string;
  description?: string;
  category?: string;
  inStock?: boolean;
}

interface SearchResponse {
  source: "pickopick" | "external" | "mixed" | "universal";
  identified: string;
  results: ProductResult[];
  aiFailed?: boolean;
}

const SOURCE_CONFIG: Record<
  string,
  {
    color: string;
    bg: string;
    border: string;
    logo: (c: string) => React.ReactNode;
    label: string;
  }
> = {
  pickopick: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    logo: (c) => BrandLogos.pickopick(c),
    label: "PickoPick Catalog",
  },
  amazon: {
    color: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    logo: (c) => BrandLogos.amazon(c),
    label: "Amazon India",
  },
  flipkart: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    logo: (c) => BrandLogos.flipkart(c),
    label: "Flipkart",
  },
};

const supportedStores = [
  "Amazon.in",
  "Flipkart",
  "Myntra",
  "Ajio",
  "Nykaa",
  "Meesho",
  "Tata CLiQ",
];

// Product Image Renderer: shows response image if available, otherwise shows clean "No image" placeholder
function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  const cleanSrc = (src || "").trim();
  const isValidSrc =
    cleanSrc.length > 5 && !cleanSrc.startsWith("blob:") && !hasError;

  if (!isValidSrc) {
    return (
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl shrink-0 border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 p-2 select-none">
        <ImageIcon size={22} className="text-slate-300" />
        <span className="text-[10px] font-semibold text-slate-400 mt-1 text-center">
          No image
        </span>
      </div>
    );
  }

  return (
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white p-1 flex items-center justify-center">
      <img
        src={cleanSrc}
        alt={alt}
        className="w-full h-full object-contain rounded-lg"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

// Minute Blue & White Zigzag Border
function ZigzagBorder({ position = "top" }: { position?: "top" | "bottom" }) {
  const isTop = position === "top";
  return (
    <div className="w-full overflow-hidden leading-none select-none bg-white">
      <svg
        className="w-full h-1.5 sm:h-2 block"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={`zigzag-pattern-${position}`}
            width="8"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            {isTop ? (
              <>
                <polygon points="0,0 4,5 8,0" fill="#0B56D9" />
                <polygon points="4,5 8,0 8,5 0,5" fill="#FFFFFF" />
              </>
            ) : (
              <>
                <polygon points="0,5 4,0 8,5" fill="#0B56D9" />
                <polygon points="4,0 8,5 8,0 0,0" fill="#FFFFFF" />
              </>
            )}
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#zigzag-pattern-${position})`}
        />
      </svg>
    </div>
  );
}

export function ImageSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchPhase, setSearchPhase] = useState<
    "idle" | "identifying" | "searching-local" | "searching-external"
  >("idle");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [identifiedProduct, setIdentifiedProduct] = useState<string>("");
  const [productLink, setProductLink] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);

  const productLinkInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus into input
  const focusInput = () => {
    window.setTimeout(() => {
      productLinkInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      productLinkInputRef.current?.focus();
    }, 60);
  };

  useEffect(() => {
    const handleSwitchToLink = () => {
      focusInput();
    };
    window.addEventListener("pickopick:switch-to-link", handleSwitchToLink);
    return () =>
      window.removeEventListener(
        "pickopick:switch-to-link",
        handleSwitchToLink,
      );
  }, []);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setProductLink(text.trim());
        toast.success("Link pasted from clipboard!");
        productLinkInputRef.current?.focus();
      }
    } catch {
      toast.error("Please paste manually using Ctrl+V or right click.");
    }
  };

  const handleAddToCart = async (product: ProductResult) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("Please login to add items to cart");
      window.dispatchEvent(new Event("pickopick:open-login"));
      return;
    }
    const user = JSON.parse(userStr);
    const price = parseFloat(String(product.price).replace(/[₹,]/g, "")) || 0;

    const customerId = user?.customerID ?? user?.customerId ?? user?.id;
    if (!customerId) {
      toast.error("Please login to add items to cart");
      window.dispatchEvent(new Event("pickopick:open-login"));
      return;
    }

    const rawImage =
      product.image ||
      product.imageURL ||
      product.imageUrl ||
      product.thumbnail ||
      "";

    try {
      // 1. Prepare valid payload matching the cart table schema (customer_id, name, price, quantity)
      const primaryPayload: Record<string, any> = {
        customer_id: customerId,
        name: product.name,
        price: price > 0 ? price : 0,
        quantity: 1,
      };

      // Standard 'image' column in cart table (if provided)
      if (rawImage) {
        primaryPayload.image = rawImage;
      }

      let { error } = await supabase.from("cart").insert([primaryPayload]);

      // 2. Fallback: if 'image' is rejected by schema cache, retry with minimal fields
      if (
        error &&
        error.message &&
        error.message.toLowerCase().includes("schema cache")
      ) {
        const minimalPayload = {
          customer_id: customerId,
          name: product.name,
          price: price > 0 ? price : 0,
          quantity: 1,
        };
        const retry = await supabase.from("cart").insert([minimalPayload]);
        error = retry.error;
      }

      if (error) throw error;
      toast.success(`${product.name.slice(0, 35)}... added to cart! 🛒`);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart");
    }
  };

  const handleLinkSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productLink.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setResults([]);
    setIdentifiedProduct("");
    setErrorMessage("");

    try {
      setSearchPhase("identifying");

      const response = await fetch("/api/analyze-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: productLink.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const data: SearchResponse = await response.json();
      setIdentifiedProduct(data.identified || "");
      setResults(data.results || []);

      window.setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error: any) {
      setErrorMessage(
        error.message ||
          "Could not fetch details for this link. Please check the URL or try searching again.",
      );
      setResults([]);
    } finally {
      setIsSearching(false);
      setSearchPhase("idle");
    }
  };

  const handleReset = () => {
    setProductLink("");
    setResults([]);
    setIdentifiedProduct("");
    setSearchPhase("idle");
    setErrorMessage("");
    setHasSearched(false);
  };

  const getSourceConfig = (source: string) => {
    return SOURCE_CONFIG[source] || SOURCE_CONFIG.amazon;
  };

  return (
    <section
      id="search-by-image"
      ref={sectionRef}
      className="relative bg-[#F9FBFE] scroll-mt-24"
    >
      {/* Top Minute Zigzag Border (Blue & White) */}
      <ZigzagBorder position="top" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-18">
        {/* Main 2-Column Efficient Layout: Search Concierge + Visual Guide */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
          {/* Left Column: Headline, Input Bar, 3-Step Guide (7 cols) */}
          <div className="lg:col-span-7">
            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-[11px] font-extrabold uppercase tracking-widest text-[#0B56D9]">
              <Sparkles size={13} className="text-[#FF6321]" />
              Universal Buy &amp; Ship Service
            </div>

            {/* Headline */}
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A1931]">
              Find it . Buy it . Ship it .
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Paste any Indian product link. PickoPick will buy it for you and
              ship it worldwide.
            </p>

            {/* Direct Search Input Card - Minimal 1px Border, Zero Shadows */}
            <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6">
              <form onSubmit={handleLinkSearch} className="space-y-4">
                <label
                  htmlFor="product-url-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Paste Indian Product URL:
                </label>

                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="relative flex-1">
                    <input
                      ref={productLinkInputRef}
                      id="product-url-input"
                      type="url"
                      placeholder="https://www.amazon.in/... or Flipkart, Myntra, Ajio"
                      required
                      value={productLink}
                      onChange={(e) => setProductLink(e.target.value)}
                      className="w-full h-12 px-4 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B56D9] outline-none transition-colors pr-24 text-sm text-[#0A1931] placeholder:text-slate-400 font-medium"
                    />

                    {/* Paste button inside the field */}
                    <button
                      type="button"
                      onClick={handlePasteClipboard}
                      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-[#0B56D9] hover:text-[#0B56D9] transition-colors cursor-pointer"
                      title="Paste link from clipboard"
                    >
                      <Clipboard size={13} />
                      <span>Paste</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSearching || !productLink.trim()}
                    className="h-12 px-7 bg-[#0B56D9] hover:bg-[#0849B7] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>Find Product</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>

                {/* Supported Stores Row */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-bold mr-1">
                    Supported stores:
                  </span>
                  {supportedStores.map((store) => (
                    <span
                      key={store}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200/80 bg-slate-50/70 text-[11px] font-semibold text-slate-700"
                    >
                      <CheckCircle2 size={11} className="text-emerald-600" />
                      {store}
                    </span>
                  ))}
                </div>
              </form>
            </div>

            {/* 3 Efficient Quick Steps */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-center">
                <div className="text-[10px] font-black uppercase text-[#0B56D9] tracking-wider">
                  Step 1
                </div>
                <p className="text-xs font-bold text-[#0A1931] mt-0.5">
                  Copy Store URL
                </p>
                <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
                  From any Indian website
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-center">
                <div className="text-[10px] font-black uppercase text-[#0B56D9] tracking-wider">
                  Step 2
                </div>
                <p className="text-xs font-bold text-[#0A1931] mt-0.5">
                  Instant Details
                </p>
                <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
                  Live price &amp; product match
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-center">
                <div className="text-[10px] font-black uppercase text-[#0B56D9] tracking-wider">
                  Step 3
                </div>
                <p className="text-xs font-bold text-[#0A1931] mt-0.5">
                  Global Shipping
                </p>
                <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
                  To your doorstep overseas
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Visual Illustration matching PickoPick 3D style (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 flex flex-col items-center">
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-slate-50/50 flex items-center justify-center">
                <img
                  src="/images/link-search-concierge.jpg"
                  alt="Paste Indian product URL to shop and ship worldwide"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 w-full text-center">
                <p className="text-xs font-extrabold text-[#0A1931]">
                  Paste URL ➔ We Buy ➔ We Deliver Worldwide
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Consolidated &amp; shipped across 220+ countries with DHL
                  &amp; FedEx
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area: ONLY Shown After User Searches */}
        <div ref={resultsRef} className="max-w-4xl mx-auto">
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-6 rounded-2xl border border-blue-100 bg-white text-center"
              >
                <div className="w-9 h-9 border-3 border-blue-100 border-t-[#0B56D9] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-bold text-[#0A1931]">
                  {searchPhase === "identifying" &&
                    "Analyzing link and fetching product details..."}
                  {searchPhase === "searching-local" &&
                    "Checking warehouse availability..."}
                  {searchPhase === "searching-external" &&
                    "Fetching live prices from Indian stores..."}
                  {searchPhase === "idle" && "Finding product..."}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Connecting to Indian e-commerce verification servers
                </p>
              </motion.div>
            )}

            {errorMessage && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-6 rounded-2xl border border-red-100 bg-red-50/40 text-center"
              >
                <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
                  <AlertCircle size={20} />
                </div>
                <h4 className="text-sm font-bold text-red-900">
                  Could Not Load Product
                </h4>
                <p className="text-xs text-red-700 mt-1 max-w-md mx-auto">
                  {errorMessage}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-white border border-red-200 text-xs font-bold text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  Clear &amp; Try Another Link
                </button>
              </motion.div>
            )}

            {results.length > 0 && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-7 space-y-3.5"
              >
                {/* Result Summary Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-white">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100">
                      <Package size={15} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#0A1931]">
                        {identifiedProduct
                          ? `Identified: ${identifiedProduct}`
                          : "Product Match Found"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Choose your preferred source below to proceed with
                        PickoPick shipping
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-red-600 cursor-pointer"
                  >
                    <X size={13} />
                    <span>New Search</span>
                  </button>
                </div>

                {/* Product List */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {results.map((product) => {
                    const config = getSourceConfig(product.source);
                    const rawImage =
                      product.image ||
                      product.imageURL ||
                      product.imageUrl ||
                      product.thumbnail ||
                      "";
                    return (
                      <div
                        key={product.id}
                        className={`flex flex-col justify-between rounded-2xl border bg-white p-4 transition-colors ${config.border}`}
                      >
                        <div className="flex gap-3.5">
                          {/* Real Product Image from response or clean 'No image' state */}
                          <ProductImage src={rawImage} alt={product.name} />

                          <div className="flex-1 min-w-0">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${config.bg} ${config.color} mb-1`}
                            >
                              {config.label}
                            </span>
                            <h4 className="text-xs font-bold text-[#0A1931] line-clamp-2 leading-snug">
                              {product.name}
                            </h4>
                            <p className="text-base font-extrabold text-[#0B56D9] mt-1.5">
                              {product.price}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Store: {product.store}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          {product.url ? (
                            <a
                              href={product.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-slate-600 hover:text-[#0B56D9] inline-flex items-center gap-1"
                            >
                              <span>View Product</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <div />
                          )}

                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B56D9] hover:bg-[#0849B7] text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            <ShoppingCart size={13} />
                            <span>Choose Product</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {hasSearched &&
              results.length === 0 &&
              !isSearching &&
              !errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-6 rounded-2xl border border-slate-200 bg-white text-center"
                >
                  <p className="text-sm font-bold text-[#0A1931]">
                    No exact match found
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try checking the link or pasting another product link from
                    Amazon India, Flipkart, or Myntra.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-3 px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Minute Zigzag Border (Blue & White) */}
      <ZigzagBorder position="bottom" />
    </section>
  );
}
