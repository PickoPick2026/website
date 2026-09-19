import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Search,
  Image as ImageIcon,
  ShoppingCart,
  ExternalLink,
  RefreshCw,
  Package,
  Store,
  AlertCircle,
  Link2,
  Clipboard,
  Sparkles,
  CheckCircle2,
  ArrowRight,
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
  google: (className: string) => (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53v-5.6z"
        fill="#EA4335"
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
  image: string;
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
    color: "text-amber-700",
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
  google: {
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    logo: (c) => BrandLogos.google(c),
    label: "Google Shopping",
  },
};

const supportedStores = [
  { name: "Amazon.in", color: "hover:border-amber-400 hover:text-amber-600" },
  { name: "Flipkart", color: "hover:border-blue-400 hover:text-blue-600" },
  { name: "Myntra", color: "hover:border-pink-400 hover:text-pink-600" },
  { name: "Ajio", color: "hover:border-slate-800 hover:text-slate-900" },
  { name: "Nykaa", color: "hover:border-rose-400 hover:text-rose-600" },
  { name: "Meesho", color: "hover:border-fuchsia-400 hover:text-fuchsia-600" },
  { name: "Tata CLiQ", color: "hover:border-red-500 hover:text-red-600" },
];

export function ImageSearch() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPhase, setSearchPhase] = useState<
    "idle" | "identifying" | "searching-local" | "searching-external"
  >("idle");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [resultSource, setResultSource] = useState<
    "pickopick" | "external" | null
  >(null);
  const [identifiedProduct, setIdentifiedProduct] = useState<string>("");
  const [searchType, setSearchType] = useState<"link" | "image">("link");
  const [productLink, setProductLink] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [manualProductName, setManualProductName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const productLinkInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Switch to link and auto-scroll/focus
  const switchToLinkSearch = () => {
    setSearchType("link");
    window.setTimeout(() => {
      productLinkInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      productLinkInputRef.current?.focus();
    }, 60);
  };

  const switchToImageSearch = () => {
    setSearchType("image");
  };

  useEffect(() => {
    const handleSwitchToLink = () => {
      switchToLinkSearch();
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
      toast.error("Clipboard access blocked. Please paste manually.");
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

    if (!Number.isFinite(price) || price < 1) {
      toast.error("This product isn't available for purchase yet ❌");
      return;
    }

    try {
      const customerId = user?.customerID ?? user?.customerId ?? user?.id;
      const { error } = await supabase.from("cart").insert([
        {
          customer_id: customerId,
          product_name: product.name,
          product_price: price,
          product_image: product.image || "",
          product_url: product.url || "",
          store: product.store || "PickoPick",
          quantity: 1,
        },
      ]);

      if (error) throw error;
      toast.success("Added to cart successfully! 🎉");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err: any) {
      toast.error(err.message || "Failed to add to cart");
    }
  };

  // Process image file
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setSelectedImage(base64);
      setErrorMessage("");
      setIsQuotaExceeded(false);
      setResults([]);
      setResultSource(null);
      setIdentifiedProduct("");

      await performImageSearch(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const performImageSearch = async (base64Image: string) => {
    setIsSearching(true);
    setSearchPhase("identifying");

    try {
      const response = await fetch("/api/search-by-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error (${response.status})`);
      }

      const data: SearchResponse = await response.json();
      setIdentifiedProduct(data.identified || "");
      setResultSource(data.source);

      if (data.source === "pickopick") {
        setSearchPhase("searching-local");
      } else {
        setSearchPhase("searching-external");
      }

      await new Promise((r) => setTimeout(r, 400));
      setResults(data.results || []);
    } catch (error: any) {
      console.error("Search error:", error);
      if (
        error.message?.includes("Quota Exceeded") ||
        error.message?.includes("429")
      ) {
        setIsQuotaExceeded(true);
      } else {
        setErrorMessage(error.message || "Search failed. Please try again.");
      }
      setResults([]);
    } finally {
      setIsSearching(false);
      setSearchPhase("idle");
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleLinkSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productLink.trim()) return;

    setIsSearching(true);
    setResults([]);
    setResultSource(null);
    setIdentifiedProduct("");
    setErrorMessage("");
    setIsQuotaExceeded(false);

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
      setResultSource(data.source);

      if (data.source === "pickopick" || data.source === "mixed") {
        setSearchPhase("searching-local");
      } else {
        setSearchPhase("searching-external");
      }

      await new Promise((r) => setTimeout(r, 400));
      setResults(data.results || []);
    } catch (error: any) {
      console.error("Link Search error:", error);
      if (
        error.message?.includes("Quota Exceeded") ||
        error.message?.includes("429")
      ) {
        setIsQuotaExceeded(true);
      } else {
        setErrorMessage(error.message || "Search failed. Please try again.");
      }
      setResults([]);
    } finally {
      setIsSearching(false);
      setSearchPhase("idle");
    }
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualProductName.trim()) return;

    setIsSearching(true);
    setResults([]);
    setErrorMessage("");
    setIsQuotaExceeded(false);

    try {
      setSearchPhase("searching-local");
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: manualProductName.trim() }),
      });

      if (!response.ok) throw new Error("Search failed");
      const data: SearchResponse = await response.json();
      setIdentifiedProduct(data.identified || manualProductName);
      setResultSource(data.source);
      setResults(data.results || []);
    } catch {
      setErrorMessage("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
      setSearchPhase("idle");
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setProductLink("");
    setResults([]);
    setResultSource(null);
    setIdentifiedProduct("");
    setSearchPhase("idle");
    setErrorMessage("");
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getSourceConfig = (source: string) => {
    return SOURCE_CONFIG[source] || SOURCE_CONFIG.amazon;
  };

  return (
    <section
      id="search-by-image"
      ref={sectionRef}
      className="pt-14 pb-28 bg-[#F7F9FF] scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Header - Redesigned 'Find it . Buy it . Ship it .' */}
        <div className="text-center mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-xs font-bold uppercase tracking-widest text-[#0B56D9]"
          >
            <Sparkles size={14} className="text-[#FF6321]" />
            Universal Assisted Shopping
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A1931]"
          >
            Find it . Buy it . Ship it .
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed"
          >
            Found something you want from India? Paste the product URL or upload
            a picture. We source it directly, consolidate your packages, and
            deliver globally.
          </motion.p>
        </div>

        {/* Dual Tab Switcher: Search by Link vs Search by Image */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm gap-1">
            <button
              type="button"
              onClick={switchToLinkSearch}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                searchType === "link"
                  ? "bg-[#0B56D9] text-white shadow-md shadow-[#0B56D9]/20"
                  : "text-slate-600 hover:text-[#0A1931] hover:bg-slate-50"
              }`}
            >
              <Link2 size={16} />
              <span>Search by Product Link</span>
            </button>

            <button
              type="button"
              onClick={switchToImageSearch}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                searchType === "image"
                  ? "bg-[#0B56D9] text-white shadow-md shadow-[#0B56D9]/20"
                  : "text-slate-600 hover:text-[#0A1931] hover:bg-slate-50"
              }`}
            >
              <ImageIcon size={16} />
              <span>Search by Image</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Search Container */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Search Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm"
          >
            {searchType === "link" ? (
              <div
                id="product-link-input-card"
                className="flex flex-col justify-center"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#0B56D9]/10 text-[#0B56D9] rounded-2xl flex items-center justify-center">
                      <Link2 size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-[#0A1931]">
                        Paste Product URL
                      </h3>
                      <p className="text-xs text-slate-500">
                        From any Indian store or marketplace
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#0B56D9] hover:text-[#0B56D9] hover:bg-blue-50/50 transition-colors"
                    title="Paste from clipboard"
                  >
                    <Clipboard size={14} />
                    <span>Paste</span>
                  </button>
                </div>

                <form onSubmit={handleLinkSearch} className="space-y-4">
                  <div className="relative">
                    <input
                      ref={productLinkInputRef}
                      type="url"
                      placeholder="https://www.amazon.in/dp/... or Myntra, Flipkart, etc."
                      required
                      value={productLink}
                      onChange={(e) => setProductLink(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#0B56D9] focus:ring-4 focus:ring-blue-100 outline-none transition-all pr-12 text-sm text-[#0A1931] placeholder:text-slate-400 font-medium"
                    />
                    <Search
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSearching || !productLink.trim()}
                    className="w-full py-3.5 bg-[#0B56D9] hover:bg-[#0849B7] text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Analyzing Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Search Product</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* Supported Stores Badges */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2.5">
                    Works seamlessly with:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {supportedStores.map((store) => (
                      <span
                        key={store.name}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600"
                      >
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        {store.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Image Search UI */
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="image-upload-input"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[360px] transition-all cursor-pointer group relative overflow-hidden ${
                    isDragging
                      ? "border-[#0B56D9] bg-blue-50/80 scale-[1.01]"
                      : selectedImage
                        ? "border-blue-300 bg-blue-50/20"
                        : "border-slate-200 hover:border-[#0B56D9] hover:bg-blue-50/40"
                  }`}
                >
                  {isDragging && (
                    <div className="absolute inset-0 bg-blue-50/95 flex items-center justify-center z-10 rounded-3xl">
                      <div className="text-center">
                        <Upload
                          size={44}
                          className="text-[#0B56D9] mx-auto mb-3 animate-bounce"
                        />
                        <p className="text-[#0B56D9] font-extrabold text-base">
                          Drop your product photo here
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedImage ? (
                    <div className="relative w-full flex flex-col items-center">
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-100 border border-slate-200 shadow-lg">
                        <img
                          src={selectedImage}
                          alt="Selected product"
                          className="w-full h-full object-contain"
                        />
                        {isSearching && (
                          <motion.div
                            initial={{ top: "-10%" }}
                            animate={{ top: "110%" }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0B56D9] to-transparent shadow-[0_0_15px_rgba(11,86,217,0.8)] z-20"
                          />
                        )}
                      </div>

                      {!isSearching && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReset();
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5"
                        >
                          <RefreshCw size={14} />
                          <span>Change Photo</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0B56D9] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload size={28} />
                      </div>
                      <h3 className="text-base font-extrabold text-[#0A1931] mb-1">
                        Upload Product Photo
                      </h3>
                      <p className="text-xs text-slate-500 mb-6 max-w-xs">
                        Drag &amp; drop an image, screenshot, or click to browse
                        files
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-6 py-2.5 rounded-full bg-[#0B56D9] text-white text-xs font-extrabold uppercase tracking-wide hover:bg-[#0849B7] transition-all shadow-md shadow-blue-600/20"
                      >
                        Select Image
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column: Search Results Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 flex flex-col min-h-[420px] shadow-sm"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B56D9]/10 text-[#0B56D9]">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0A1931]">
                    Matching Products
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live Indian catalog verification
                  </p>
                </div>
              </div>
              {results.length > 0 && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    resultSource === "pickopick"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {results.length} Found
                </span>
              )}
            </div>

            {/* Identified product banner */}
            {identifiedProduct && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-4 py-2.5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center gap-2 text-xs font-semibold text-[#0B56D9]"
              >
                <Sparkles size={16} />
                <span>
                  Identified: <strong>{identifiedProduct}</strong>
                </span>
              </motion.div>
            )}

            <div className="flex-1 overflow-y-auto pr-1">
              <AnimatePresence mode="wait">
                {isSearching ? (
                  <motion.div
                    key="searching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-16"
                  >
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-[#0B56D9] rounded-full animate-spin mb-4" />
                    <p className="text-xs font-bold text-slate-600 animate-pulse text-center">
                      {searchPhase === "identifying" &&
                        "🤖 AI is analyzing the product..."}
                      {searchPhase === "searching-local" &&
                        "🛒 Searching PickoPick warehouse catalog..."}
                      {searchPhase === "searching-external" &&
                        "🌐 Sourcing live across Indian stores..."}
                      {searchPhase === "idle" && "Searching..."}
                    </p>
                  </motion.div>
                ) : errorMessage ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3 text-red-500">
                      <AlertCircle size={24} />
                    </div>
                    <p className="text-sm font-extrabold text-red-700 mb-1">
                      Search Interrupted
                    </p>
                    <p className="text-xs text-slate-500 mb-5 max-w-xs">
                      {errorMessage}
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      Reset &amp; Try Again
                    </button>
                  </motion.div>
                ) : isQuotaExceeded ? (
                  <motion.div
                    key="quota"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-6"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-3 text-amber-600">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-sm font-extrabold text-[#0A1931] mb-1">
                      Help us locate this item
                    </p>
                    <p className="text-xs text-slate-500 max-w-xs mb-4">
                      Enter the item name below and we'll check our warehouse
                      catalog immediately.
                    </p>
                    <form
                      onSubmit={handleManualSearch}
                      className="w-full space-y-3"
                    >
                      <input
                        type="text"
                        placeholder="e.g. Silk Kurta, Kitchenware, Snacks..."
                        required
                        value={manualProductName}
                        onChange={(e) => setManualProductName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0B56D9]"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#0B56D9] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                      >
                        Search Catalog
                      </button>
                    </form>
                  </motion.div>
                ) : results.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid gap-3"
                  >
                    {results.map((product) => {
                      const config = getSourceConfig(product.source);
                      return (
                        <div
                          key={product.id}
                          className={`flex gap-3 p-3.5 rounded-2xl border bg-white hover:border-[#0B56D9]/40 hover:shadow-sm transition-all ${config.border}`}
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center border border-slate-100">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="opacity-30">
                                {config.logo("w-8 h-8")}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-xs text-[#0A1931] line-clamp-2">
                                {product.name}
                              </h4>
                              <div className="mt-1 flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${config.bg} ${config.color}`}
                                >
                                  {config.label}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                              <span className="text-sm font-extrabold text-[#0B56D9]">
                                {product.price}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddToCart(product)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0B56D9] hover:bg-[#0849B7] text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                              >
                                <ShoppingCart size={13} />
                                <span>Add to Cart</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-14">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3 text-[#0B56D9]">
                      <Search size={26} />
                    </div>
                    <p className="text-xs font-extrabold text-[#0A1931]">
                      Ready for your product query
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                      Paste a URL from any Indian e-commerce store or upload a
                      picture on the left to begin.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
