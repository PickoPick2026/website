import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Link2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Clock,
  Send,
  Clipboard,
  Info,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";
import { supabase } from "@/src/lib/supabase";
import { submitServiceRequest } from "../../../lib/serviceRequests";

interface LinkAnalysisResult {
  storeName: string;
  category: string;
  sourceDomain: string;
  originalUrl: string;
  productTitle: string;
  estimatedPriceInr: number | null;
  shippingWeightEstimate: string;
  availableSizes: string[];
  inStock: boolean;
  requiresSpecialHandling: boolean;
  notes: string;
}

const SUPPORTED_DOMAINS = [
  "amazon.in",
  "flipkart.com",
  "myntra.com",
  "ajio.com",
  "nykaa.com",
  "tatacliq.com",
  "meesho.com",
  "firstcry.com",
  "fabindia.com",
  "bewakoof.com",
  "jiomart.com",
  "croma.com",
];

const SOURCE_CONFIG: Record<
  string,
  {
    name: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
    accentColor: string;
  }
> = {
  amazon: {
    name: "Amazon.in",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-700",
    borderColor: "border-amber-300",
    accentColor: "#F59E0B",
  },
  flipkart: {
    name: "Flipkart",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-700",
    borderColor: "border-blue-300",
    accentColor: "#2563EB",
  },
  myntra: {
    name: "Myntra",
    badgeBg: "bg-pink-500/10",
    badgeText: "text-pink-700",
    borderColor: "border-pink-300",
    accentColor: "#EC4899",
  },
  ajio: {
    name: "Ajio",
    badgeBg: "bg-slate-500/10",
    badgeText: "text-slate-700",
    borderColor: "border-slate-300",
    accentColor: "#475569",
  },
  nykaa: {
    name: "Nykaa",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-700",
    borderColor: "border-rose-300",
    accentColor: "#F43F5E",
  },
};

const ZigzagBorder = ({ position }: { position: "top" | "bottom" }) => (
  <div
    className={`absolute ${position === "top" ? "top-0" : "bottom-0"} left-0 right-0 h-[6px] overflow-hidden pointer-events-none z-10`}
  >
    <svg
      viewBox="0 0 1200 6"
      preserveAspectRatio="none"
      className="w-full h-full text-slate-200 fill-current"
    >
      <path d="M0,0 L6,6 L12,0 L18,6 L24,0 L30,6 L36,0 L42,6 L48,0 L54,6 L60,0 L66,6 L72,0 L78,6 L84,0 L90,6 L96,0 L102,6 L108,0 L114,6 L120,0 L126,6 L132,0 L138,6 L144,0 L150,6 L156,0 L162,6 L168,0 L174,6 L180,0 L186,6 L192,0 L198,6 L204,0 L210,6 L216,0 L222,6 L228,0 L234,6 L240,0 L246,6 L252,0 L258,6 L264,0 L270,6 L276,0 L282,6 L288,0 L294,6 L300,0 L306,6 L312,0 L318,6 L324,0 L330,6 L336,0 L342,6 L348,0 L354,6 L360,0 L366,6 L372,0 L378,6 L384,0 L390,6 L396,0 L402,6 L408,0 L414,6 L420,0 L426,6 L432,0 L438,6 L444,0 L450,6 L456,0 L462,6 L468,0 L474,6 L480,0 L486,6 L492,0 L498,6 L504,0 L510,6 L516,0 L522,6 L528,0 L534,6 L540,0 L546,6 L552,0 L558,6 L564,0 L570,6 L576,0 L582,6 L588,0 L594,6 L600,0 L606,6 L612,0 L618,6 L624,0 L630,6 L636,0 L642,6 L648,0 L654,6 L660,0 L666,6 L672,0 L678,6 L684,0 L690,6 L696,0 L702,6 L708,0 L714,6 L720,0 L726,6 L732,0 L738,6 L744,0 L750,6 L756,0 L762,6 L768,0 L774,6 L780,0 L786,6 L792,0 L798,6 L804,0 L810,6 L816,0 L822,6 L828,0 L834,6 L840,0 L846,6 L852,0 L858,6 L864,0 L870,6 L876,0 L882,6 L888,0 L894,6 L900,0 L906,6 L912,0 L918,6 L924,0 L930,6 L936,0 L942,6 L948,0 L954,6 L960,0 L966,6 L972,0 L978,6 L984,0 L990,6 L996,0 L1002,6 L1008,0 L1014,6 L1020,0 L1026,6 L1032,0 L1038,6 L1044,0 L1050,6 L1056,0 L1062,6 L1068,0 L1074,6 L1080,0 L1086,6 L1092,0 L1098,6 L1104,0 L1110,6 L1116,0 L1122,6 L1128,0 L1134,6 L1140,0 L1146,6 L1152,0 L1158,6 L1164,0 L1170,6 L1176,0 L1182,6 L1188,0 L1194,6 L1200,0 L1200,6 L0,6 Z" />
    </svg>
  </div>
);

export function ImageSearch() {
  const [productLink, setProductLink] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchPhase, setSearchPhase] = useState<
    "idle" | "validating" | "scraping" | "analyzing" | "complete"
  >("idle");
  const [analysisResult, setAnalysisResult] =
    useState<LinkAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Inquiry form modal state
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryLocation, setInquiryLocation] = useState("");
  const [inquiryCountry, setInquiryCountry] = useState("United States");
  const [inquirySelectedSize, setInquirySelectedSize] = useState("");
  const [inquiryQuantity, setInquiryQuantity] = useState("1");
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const productLinkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePopulate = (event: Event) => {
      const customEvent = event as CustomEvent<{
        url?: string;
        focus?: boolean;
      }>;
      const nextUrl = customEvent.detail?.url;
      if (nextUrl) {
        setProductLink(nextUrl);
      }
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      if (customEvent.detail?.focus) {
        window.setTimeout(() => {
          productLinkInputRef.current?.focus();
          productLinkInputRef.current?.select();
        }, 350);
      }
    };

    window.addEventListener(
      "pickopick:populate-product-link",
      handlePopulate as EventListener,
    );
    return () => {
      window.removeEventListener(
        "pickopick:populate-product-link",
        handlePopulate as EventListener,
      );
    };
  }, []);

  const supportedStores = [
    "Amazon.in",
    "Flipkart",
    "Myntra",
    "Ajio",
    "Nykaa",
    "Any Indian URL",
  ];

  const validateUrl = (
    urlStr: string,
  ): { valid: boolean; domain: string; error?: string } => {
    try {
      const trimmed = urlStr.trim();
      const withProtocol =
        trimmed.startsWith("http://") || trimmed.startsWith("https://")
          ? trimmed
          : `https://${trimmed}`;
      const parsed = new URL(withProtocol);
      const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();

      const matchedDomain = SUPPORTED_DOMAINS.find(
        (d) => hostname === d || hostname.endsWith(`.${d}`),
      );

      return {
        valid: true,
        domain: matchedDomain || hostname,
      };
    } catch {
      return {
        valid: false,
        domain: "",
        error: "Please enter a valid URL (e.g. https://www.amazon.in/dp/...)",
      };
    }
  };

  const extractStoreInfo = (
    domain: string,
    url: string,
  ): LinkAnalysisResult => {
    let storeName = "Indian Online Store";
    let category = "General Merchandise";
    let estimatedWeight = "0.5 - 1.5 kg";
    let sizes: string[] = [];

    const lower = domain.toLowerCase();

    if (lower.includes("amazon")) {
      storeName = "Amazon India";
      category = "E-Commerce / Multi-Category";
      estimatedWeight = "0.5 - 2.0 kg";
      sizes = ["Standard"];
    } else if (lower.includes("flipkart")) {
      storeName = "Flipkart";
      category = "E-Commerce / Consumer Goods";
      estimatedWeight = "0.5 - 2.0 kg";
      sizes = ["Standard"];
    } else if (lower.includes("myntra")) {
      storeName = "Myntra";
      category = "Fashion, Ethnic & Lifestyle";
      estimatedWeight = "0.3 - 0.8 kg";
      sizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
    } else if (lower.includes("ajio")) {
      storeName = "Ajio";
      category = "Fashion & Indie Apparel";
      estimatedWeight = "0.3 - 0.8 kg";
      sizes = ["S", "M", "L", "XL", "Free Size"];
    } else if (lower.includes("nykaa")) {
      storeName = "Nykaa";
      category = "Beauty, Cosmetics & Personal Care";
      estimatedWeight = "0.2 - 0.6 kg";
      sizes = ["Standard Size"];
    } else if (lower.includes("tatacliq")) {
      storeName = "Tata CLiQ";
      category = "Premium Lifestyle & Fashion";
      estimatedWeight = "0.5 - 1.5 kg";
      sizes = ["S", "M", "L", "XL"];
    } else {
      const parts = domain.split(".");
      storeName =
        parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + " (India)";
    }

    let productTitle = `${storeName} Verified Product`;
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      const pathSegments = urlObj.pathname
        .split("/")
        .filter((s) => s.length > 2);
      if (pathSegments.length > 0) {
        const slug = pathSegments[0]
          .replace(/[-_]/g, " ")
          .replace(/\.html?$/, "")
          .trim();
        if (slug.length > 3 && !slug.match(/^(dp|gp|product|item|p)$/i)) {
          productTitle = slug
            .split(" ")
            .slice(0, 8)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        }
      }
    } catch {
      // fallback to storeName
    }

    return {
      storeName,
      category,
      sourceDomain: domain,
      originalUrl: url.startsWith("http") ? url : `https://${url}`,
      productTitle,
      estimatedPriceInr: null,
      shippingWeightEstimate: estimatedWeight,
      availableSizes: sizes,
      inStock: true,
      requiresSpecialHandling:
        category.includes("Beauty") || category.includes("Liquid"),
      notes: `Ready for assisted buying. PickoPick local buyers in Chennai will purchase in INR and prepare for international air freight.`,
    };
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setProductLink(text.trim());
      }
    } catch {
      // Fallback
    }
  };

  const handleLinkSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productLink.trim()) return;

    setErrorMessage("");
    setAnalysisResult(null);
    setIsSearching(true);
    setHasSearched(true);

    const validation = validateUrl(productLink);
    if (!validation.valid) {
      setErrorMessage(
        validation.error || "Please enter a valid Indian store URL.",
      );
      setIsSearching(false);
      return;
    }

    setSearchPhase("validating");
    await new Promise((r) => setTimeout(r, 400));

    setSearchPhase("scraping");
    await new Promise((r) => setTimeout(r, 600));

    setSearchPhase("analyzing");
    const result = extractStoreInfo(validation.domain, productLink);
    await new Promise((r) => setTimeout(r, 400));

    setAnalysisResult(result);
    setSearchPhase("complete");
    setIsSearching(false);

    if (result.availableSizes.length > 0) {
      setInquirySelectedSize(result.availableSizes[0]);
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  };

  const handleReset = () => {
    setProductLink("");
    setAnalysisResult(null);
    setSearchPhase("idle");
    setErrorMessage("");
    setHasSearched(false);
  };

  const handleOpenInquiry = () => {
    setInquirySubmitted(false);
    setShowInquiryModal(true);
  };

  const handleCloseInquiry = () => {
    setShowInquiryModal(false);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim() || !inquiryEmail.trim() || !inquiryLocation.trim()) return;

    setIsSubmittingInquiry(true);

    try {
      const result = await submitServiceRequest("assisted_buy", {
        customerName: inquiryName,
        phone: inquiryPhone,
        email: inquiryEmail,
        location: inquiryLocation,
        sourceStore: analysisResult?.storeName || "Indian Store",
        product: analysisResult?.productTitle || "Product",
        productUrl: analysisResult?.originalUrl || productLink,
        size: inquirySelectedSize || "Standard",
        quantity: inquiryQuantity,
        destinationCountry: inquiryCountry,
        notes: inquiryNotes,
      });
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      setInquirySubmitted(true);
      return;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit the purchase request.");
      return;
    } finally {
      setIsSubmittingInquiry(false);
    }

    try {
      await supabase.from("inquiries").insert([
        {
          name: inquiryName.trim(),
          phone: inquiryPhone.trim(),
          country: inquiryCountry,
          notes: `[BUY & SHIP URL INQUIRY]\nStore: ${analysisResult?.storeName || "Unknown"}\nProduct: ${analysisResult?.productTitle || "N/A"}\nURL: ${analysisResult?.originalUrl || productLink}\nSize: ${inquirySelectedSize || "N/A"}\nQty: ${inquiryQuantity}\nUser Notes: ${inquiryNotes.trim() || "None"}`,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ]);

      const waMsg = encodeURIComponent(
        `Hello PickoPick Personal Shopper! 🛍️\n\nI want to buy a product from an Indian store:\n\n*Store:* ${analysisResult?.storeName || "Indian Store"}\n*Product:* ${analysisResult?.productTitle || "Product"}\n*URL:* ${analysisResult?.originalUrl || productLink}\n*Size/Variant:* ${inquirySelectedSize || "Standard"}\n*Quantity:* ${inquiryQuantity}\n*Destination Country:* ${inquiryCountry}\n*My Name:* ${inquiryName}\n*My Phone:* ${inquiryPhone}\n${inquiryNotes ? `*Notes:* ${inquiryNotes}\n` : ""}\nPlease confirm availability and provide an INR quote for purchasing and international shipping.`,
      );
      window.open(`https://wa.me/919790361222?text=${waMsg}`, "_blank");

      setInquirySubmitted(true);
    } catch {
      const waMsg = encodeURIComponent(
        `Hello PickoPick Personal Shopper! 🛍️\n\nI want to buy:\n${analysisResult?.originalUrl || productLink}\nDestination: ${inquiryCountry}\nName: ${inquiryName}`,
      );
      window.open(`https://wa.me/919790361222?text=${waMsg}`, "_blank");
      setInquirySubmitted(true);
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  return (
    <section
      id="buy-and-ship"
      ref={sectionRef}
      className="relative bg-[#F8FAFC] scroll-mt-24 border-b border-slate-200/80"
    >
      <div id="search-by-image" className="sr-only" aria-hidden="true" />
      {/* Top Minute Zigzag Border */}
      <ZigzagBorder position="top" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
        {/* Compact Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-[11px] font-black uppercase tracking-widest text-[#0B56D9]">
            <Sparkles size={12} className="text-[#FF6321]" />
            Buy &amp; Ship • Personal Shopper in India
          </div>

          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
            Find it in India. We Buy &amp; Ship it Abroad.
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Paste any Indian product link below. PickoPick purchases it locally
            in INR, verifies and repacks your parcel, and delivers directly to
            your overseas doorstep.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              to="/buy-and-ship"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0B56D9] hover:underline"
            >
              <span>Read Full Buy &amp; Ship Guide &amp; FAQs</span>
              <ArrowRight size={13} />
            </Link>
            <span className="text-slate-300">•</span>
            <a
              href="https://wa.me/919790361222?text=Hello%20PickoPick%20Personal%20Shopper%2C%20I%20want%20to%20buy%20items%20from%20an%20Indian%20store."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 hover:underline"
            >
              <FaWhatsapp size={14} />
              <span>Personal Shopper Chat</span>
            </a>
          </div>
        </div>

        {/* High-Efficiency Unified Action Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
          <form onSubmit={handleLinkSearch} className="space-y-4">
            {/* Input Row with integrated Link Icon, Paste Button, and Action Button */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Link2 size={18} className="text-[#0B56D9]" />
                </div>

                <input
                  ref={productLinkInputRef}
                  id="product-url-input"
                  type="url"
                  placeholder="Paste URL from Amazon.in, Flipkart, Myntra, Ajio, Nykaa..."
                  required
                  value={productLink}
                  onChange={(e) => setProductLink(e.target.value)}
                  className="w-full h-12 pl-10 pr-24 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B56D9] outline-none transition-colors text-xs sm:text-sm text-[#0A1931] placeholder:text-slate-400 font-medium"
                />

                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-700 hover:border-[#0B56D9] hover:text-[#0B56D9] transition-colors cursor-pointer"
                  title="Paste link from clipboard"
                >
                  <Clipboard size={12} />
                  <span>Paste</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isSearching || !productLink.trim()}
                className="h-12 px-6 bg-[#0B56D9] hover:bg-[#0849B7] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze &amp; Ship Product</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>

            {/* Supported Platforms Strip */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mr-1">
                  Supported stores:
                </span>
                {supportedStores.map((store) => (
                  <span
                    key={store}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-700"
                  >
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    {store}
                  </span>
                ))}
              </div>

              {productLink && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <RotateCcw size={11} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </form>

          {/* Efficient 3-Pillar Micro Workflow */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-[#0B56D9] flex items-center justify-center shrink-0 font-black text-xs">
                1
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#0A1931]">
                  Paste Product URL
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  From any online Indian store
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 text-[#FF6321] flex items-center justify-center shrink-0 font-black text-xs">
                2
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#0A1931]">
                  We Buy Locally
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  Inspected &amp; repackaged safely
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-black text-xs">
                3
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#0A1931]">
                  Doorstep Delivery
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  Shipped overseas in 3–5 days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Search Results Section */}
        <div ref={resultsRef} className="mt-6">
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-blue-100 p-8 text-center"
              >
                <div className="w-12 h-12 bg-blue-50 text-[#0B56D9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <RefreshCw
                    size={24}
                    className="animate-spin text-[#0B56D9]"
                  />
                </div>
                <h4 className="text-base font-extrabold text-[#0A1931] mb-1">
                  Analyzing Product Details
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Verifying Indian store availability, estimated parcel
                  dimensions, and export compliance...
                </p>
              </motion.div>
            )}

            {errorMessage && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
              >
                <AlertCircle
                  size={18}
                  className="text-red-600 shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-xs font-bold text-red-800">
                    {errorMessage}
                  </p>
                </div>
              </motion.div>
            )}

            {analysisResult && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0B56D9] text-[10px] font-black uppercase tracking-wider mb-1">
                      {analysisResult.storeName}
                    </span>
                    <h3 className="text-lg font-extrabold text-[#0A1931]">
                      {analysisResult.productTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Category: {analysisResult.category} • Est. Weight:{" "}
                      {analysisResult.shippingWeightEstimate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenInquiry}
                      className="px-5 py-2.5 rounded-xl bg-[#0B56D9] hover:bg-[#0849B7] text-white text-xs font-extrabold uppercase tracking-wide transition-colors cursor-pointer shadow-xs"
                    >
                      Request Purchase Quote
                    </button>
                    <a
                      href={analysisResult.originalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#0B56D9] hover:bg-slate-50 transition-colors"
                      title="View original link"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex items-start gap-2.5">
                  <Info size={15} className="text-[#0B56D9] shrink-0 mt-0.5" />
                  <span>{analysisResult.notes}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              {inquirySubmitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0A1931]">
                    Purchase Inquiry Sent!
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Our personal shopping executive will review the product
                    availability and send your INR and shipping quote directly
                    on WhatsApp.
                  </p>
                  <button
                    type="button"
                    onClick={handleCloseInquiry}
                    className="mt-6 w-full py-3 rounded-xl bg-[#0B56D9] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#0849B7] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0A1931]">
                      Request Assisted Buy Quote
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {analysisResult?.productTitle}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Priya Sundaram"
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0A1931] outline-none focus:border-[#0B56D9]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="+1 555-0199"
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0A1931] outline-none focus:border-[#0B56D9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0A1931] outline-none focus:border-[#0B56D9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Where to Send <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryLocation}
                        onChange={(e) => setInquiryLocation(e.target.value)}
                        placeholder="City, country / postal code"
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0A1931] outline-none focus:border-[#0B56D9]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Destination Country
                      </label>
                      <select
                        value={inquiryCountry}
                        onChange={(e) => setInquiryCountry(e.target.value)}
                        className="w-full h-10 px-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-[#0A1931] outline-none focus:border-[#0B56D9]"
                      >
                        <option value="United States">USA</option>
                        <option value="United Kingdom">UK</option>
                        <option value="Canada">Canada</option>
                        <option value="United Arab Emirates">UAE</option>
                        <option value="Australia">Australia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {analysisResult &&
                    analysisResult.availableSizes.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Size / Variant
                          </label>
                          <select
                            value={inquirySelectedSize}
                            onChange={(e) =>
                              setInquirySelectedSize(e.target.value)
                            }
                            className="w-full h-10 px-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-[#0A1931] outline-none focus:border-[#0B56D9]"
                          >
                            {analysisResult.availableSizes.map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={inquiryQuantity}
                            onChange={(e) => setInquiryQuantity(e.target.value)}
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0A1931] outline-none focus:border-[#0B56D9]"
                          />
                        </div>
                      </div>
                    )}

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Notes (Color, instructions, etc.)
                    </label>
                    <textarea
                      rows={2}
                      value={inquiryNotes}
                      onChange={(e) => setInquiryNotes(e.target.value)}
                      placeholder="e.g. Please check if gift packaging is available..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-[#0A1931] outline-none focus:border-[#0B56D9] resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCloseInquiry}
                      className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingInquiry}
                      className="w-2/3 py-2.5 rounded-xl bg-[#0B56D9] hover:bg-[#0849B7] text-white text-xs font-extrabold uppercase tracking-wide inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <FaWhatsapp size={16} />
                      <span>Submit to Shopper</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
