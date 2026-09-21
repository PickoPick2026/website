"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

interface MarqueeProduct {
  productID: string | number;
  productName?: string;
  price?: number | string;
  imageURL?: any;
  categoryID?: string | number;
}

interface MarqueeCategory {
  categoryID: string | number;
  categoryName?: string;
}

export function ShoppingDirectoryMarquee() {
  const [activeTab, setActiveTab] = useState("directory");
  const [activeCategory, setActiveCategory] = useState<string | number>("");
  const [categories, setCategories] = useState<MarqueeCategory[]>([]);
  const [products, setProducts] = useState<MarqueeProduct[]>([]);
  const [rowADuration, setRowADuration] = useState(45);
  const [rowBDuration, setRowBDuration] = useState(55);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: catData } = await supabase.from("category").select("*");
    const { data: prodData } = await supabase.from("productTable").select("*");

    setCategories(catData || []);
    setProducts(prodData || []);
  };

  const exclusiveCategory = categories.find(
    (c) => c.categoryName === "Exclusive",
  );
  const regularCategories = categories.filter(
    (c) => c.categoryName !== "Exclusive",
  );

  const directoryProducts = products.filter(
    (p) =>
      p.categoryID !== exclusiveCategory?.categoryID &&
      (!activeCategory || p.categoryID === activeCategory),
  );

  const exclusiveProducts = products.filter(
    (p) => p.categoryID === exclusiveCategory?.categoryID,
  );

  const shownProducts =
    activeTab === "directory" ? directoryProducts : exclusiveProducts;

  // Constant px-per-second speed: compute duration from actual row width
  useEffect(() => {
    const measure = () => {
      if (rowARef.current && rowARef.current.scrollWidth > 0) {
        const half = rowARef.current.scrollWidth / 2;
        setRowADuration(Math.max(12, half / 35));
      }
      if (rowBRef.current && rowBRef.current.scrollWidth > 0) {
        const half = rowBRef.current.scrollWidth / 2;
        setRowBDuration(Math.max(12, half / 30));
      }
    };

    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [shownProducts, activeTab, activeCategory]);

  const getImageUrl = (imageField: any) => {
    try {
      if (!imageField) return "";
      const parsed =
        typeof imageField === "string" ? JSON.parse(imageField) : imageField;

      let url = "";
      if (Array.isArray(parsed) && parsed.length > 0) {
        url = parsed[0];
      } else if (typeof parsed === "string") {
        url = parsed;
      }
      if (url.startsWith("blob:")) return "";
      return url;
    } catch {
      return "";
    }
  };

  const renderCard = (product: MarqueeProduct, key: string) => {
    const targetCat = categories.find(
      (c) => String(c.categoryID) === String(product.categoryID),
    );
    const catUrl = targetCat?.categoryName
      ? `/shop?category=${encodeURIComponent(targetCat.categoryName)}`
      : "/shop";

    return (
      <Link
        key={key}
        to={catUrl}
        className="group w-44 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-[#0B56D9]/50 hover:shadow-md sm:w-56 block"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          <img
            src={getImageUrl(product.imageURL) || "/no-image.png"}
            alt={product.productName || "Product"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-3 sm:p-4">
          <p className="line-clamp-2 text-xs font-bold text-[#0A1931] sm:text-sm">
            {product.productName}
          </p>
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-[11px] font-bold text-[#0B56D9] sm:text-xs">
              {product.price ? `₹${product.price}` : "View in Shop"}
            </p>
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#0B56D9] transition-colors inline-flex items-center gap-0.5">
              Shop <ArrowRight size={10} />
            </span>
          </div>
        </div>
      </Link>
    );
  };

  // Duplicate array once so the -50% loop is seamless
  const marqueeCards = [...shownProducts, ...shownProducts];

  const activeCategoryName = categories.find(
    (c) => c.categoryID === activeCategory,
  )?.categoryName;

  return (
    <section
      id="shop-directory"
      className="overflow-hidden border-b border-slate-200 bg-[#F7F9FF] py-16 sm:py-20 scroll-mt-24"
    >
      <style>{`
        @keyframes pop-marquee-a {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes pop-marquee-b {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .pop-marquee-a { animation-name: pop-marquee-a; animation-timing-function: linear; animation-iteration-count: infinite; }
        .pop-marquee-b { animation-name: pop-marquee-b; animation-timing-function: linear; animation-iteration-count: infinite; }
        .pop-marquee-a:hover, .pop-marquee-b:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .pop-marquee-a, .pop-marquee-b { animation: none; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
          <div className="max-w-xl">
            <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
              Marketplace Showcase
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              A curated selection of authentic Indian products available for
              doorstep worldwide delivery.
            </p>
          </div>

          {/* Tabs */}
          <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white p-1 shadow-xs">
            <button
              onClick={() => setActiveTab("directory")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "directory"
                  ? "bg-[#0B56D9] text-white shadow-xs"
                  : "text-slate-500 hover:text-[#0A1931]"
              }`}
            >
              <ShoppingBag size={14} /> Catalog
            </button>
            <button
              onClick={() => setActiveTab("exclusive")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "exclusive"
                  ? "bg-[#0B56D9] text-white shadow-xs"
                  : "text-slate-500 hover:text-[#0A1931]"
              }`}
            >
              <Sparkles size={14} /> Exclusive Sourcing
            </button>
          </div>
        </div>

        {/* Category chips & View All link */}
        {activeTab === "directory" && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveCategory("")}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === ""
                    ? "bg-[#0A1931] text-white shadow-xs"
                    : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                All
              </button>
              {regularCategories.map((cat) => (
                <button
                  key={cat.categoryID}
                  onClick={() => setActiveCategory(cat.categoryID)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat.categoryID
                      ? "bg-[#0B56D9] text-white shadow-xs"
                      : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>

            {/* Direct CTA button to full category view */}
            {activeCategory ? (
              <Link
                to={`/shop?category=${encodeURIComponent(activeCategoryName || "")}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B56D9] text-white text-xs font-bold hover:bg-[#0849B7] transition-all shadow-xs shrink-0"
              >
                <span>View all {activeCategoryName} in Shop</span>
                <ArrowRight size={13} />
              </Link>
            ) : (
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-blue-200 text-[#0B56D9] text-xs font-bold hover:bg-blue-50 transition-all shadow-xs shrink-0"
              >
                <span>Open Full Marketplace Catalog</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        )}
      </div>

      {shownProducts.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <p className="text-sm font-bold text-[#0A1931]">
            No products in this category yet.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Check back soon for new arrivals.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Row A - moving left */}
          <div className="overflow-hidden">
            <div
              ref={rowARef}
              className="pop-marquee-a flex w-max gap-4 px-4 sm:gap-5 sm:px-8"
              style={{ animationDuration: `${rowADuration}s` }}
            >
              {marqueeCards.map((product, index) =>
                renderCard(product, `a-${product.productID}-${index}`),
              )}
            </div>
          </div>

          {/* Row B - moving right */}
          <div className="overflow-hidden">
            <div
              ref={rowBRef}
              className="pop-marquee-b flex w-max gap-4 px-4 sm:gap-5 sm:px-8"
              style={{ animationDuration: `${rowBDuration}s` }}
            >
              {marqueeCards.map((product, index) =>
                renderCard(product, `b-${product.productID}-${index}`),
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
