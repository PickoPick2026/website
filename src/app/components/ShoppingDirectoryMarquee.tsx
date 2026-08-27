"use client"

import { useEffect, useRef, useState } from "react"
import { ShoppingBag, Sparkles } from "lucide-react"
import { LoginModal } from "./LoginModal"
import { supabase } from "@/src/lib/supabase"

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
  const [activeTab, setActiveTab] = useState("directory")
  const [activeCategory, setActiveCategory] = useState<string | number>("")
  const [categories, setCategories] = useState<MarqueeCategory[]>([])
  const [products, setProducts] = useState<MarqueeProduct[]>([])
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [rowADuration, setRowADuration] = useState(45)
  const [rowBDuration, setRowBDuration] = useState(55)
  const rowARef = useRef<HTMLDivElement>(null)
  const rowBRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: catData } = await supabase.from("category").select("*")
    const { data: prodData } = await supabase.from("productTable").select("*")

    setCategories(catData || [])
    setProducts(prodData || [])
  }

  const exclusiveCategory = categories.find((c) => c.categoryName === "Exclusive")
  const regularCategories = categories.filter((c) => c.categoryName !== "Exclusive")

  const directoryProducts = products.filter(
    (p) =>
      p.categoryID !== exclusiveCategory?.categoryID &&
      (!activeCategory || p.categoryID === activeCategory)
  )

  const exclusiveProducts = products.filter(
    (p) => p.categoryID === exclusiveCategory?.categoryID
  )

  const shownProducts = activeTab === "directory" ? directoryProducts : exclusiveProducts

  // Constant px-per-second speed: compute duration from actual row width
  useEffect(() => {
    const measure = () => {
      if (rowARef.current && rowARef.current.scrollWidth > 0) {
        // One copy = half the doubled track width; keep ~35px/s so it's smooth
        const half = rowARef.current.scrollWidth / 2
        setRowADuration(Math.max(12, half / 35))
      }
      if (rowBRef.current && rowBRef.current.scrollWidth > 0) {
        const half = rowBRef.current.scrollWidth / 2
        setRowBDuration(Math.max(12, half / 30))
      }
    }

    // Wait a frame so the doubled row has been laid out with updated products
    const raf = requestAnimationFrame(measure)
    window.addEventListener("resize", measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", measure)
    }
  }, [shownProducts, activeTab, activeCategory])

  const getImageUrl = (imageField: any) => {
    try {
      if (!imageField) return ""

      const parsed =
        typeof imageField === "string"
          ? JSON.parse(imageField)
          : imageField

      let url = ""

      if (Array.isArray(parsed) && parsed.length > 0) {
        url = parsed[0]
      } else if (typeof parsed === "string") {
        url = parsed
      }

      if (url.startsWith("blob:")) return ""

      return url
    } catch {
      return ""
    }
  }

  const renderCard = (product: MarqueeProduct, key: string) => (
    <div
      key={key}
      onClick={() => setIsLoginOpen(true)}
      className="group w-44 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-[#0B56D9]/40 sm:w-56"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={getImageUrl(product.imageURL) || "/no-image.png"}
          alt={product.productName || "Product"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-3 sm:p-4">
        <p className="line-clamp-2 text-xs font-bold text-[#0A1931] sm:text-sm">
          {product.productName}
        </p>
        <p className="mt-1.5 text-[11px] font-bold text-[#0B56D9] sm:text-xs">
          {product.price ? `₹${product.price}` : "Shop Now"}
        </p>
      </div>
    </div>
  )

  // Duplicate array once so the -50% loop is seamless
  const marqueeCards = [...shownProducts, ...shownProducts]

  return (
    <section id="shop-directory" className="overflow-hidden border-b border-slate-200 bg-[#F7F9FF] py-16 sm:py-20 scroll-mt-24">
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div className="max-w-xl">
            <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
              Shop Directory
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              A rolling showcase of handpicked Indian products, ready to ship anywhere in the world.
            </p>
          </div>

          {/* Tabs */}
          <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("directory")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "directory"
                  ? "bg-[#0B56D9] text-white shadow-md shadow-[#0B56D9]/20"
                  : "text-slate-500 hover:text-[#0A1931]"
              }`}
            >
              <ShoppingBag size={14} /> Directory
            </button>
            <button
              onClick={() => setActiveTab("exclusive")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "exclusive"
                  ? "bg-[#0B56D9] text-white shadow-md shadow-[#0B56D9]/20"
                  : "text-slate-500 hover:text-[#0A1931]"
              }`}
            >
              <Sparkles size={14} /> Exclusive
            </button>
          </div>
        </div>

        {/* Category chips */}
        {activeTab === "directory" && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory("")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeCategory === ""
                  ? "bg-[#0A1931] text-white"
                  : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              All
            </button>
            {regularCategories.map((cat) => (
              <button
                key={cat.categoryID}
                onClick={() => setActiveCategory(cat.categoryID)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  activeCategory === cat.categoryID
                    ? "bg-[#0A1931] text-white"
                    : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        )}
      </div>

      {shownProducts.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <p className="text-sm font-bold text-[#0A1931]">No products in this category yet.</p>
          <p className="mt-1 text-xs text-slate-500">Check back soon for new arrivals.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Row A - moving left */}
          <div className="overflow-hidden">
            <div ref={rowARef} className="pop-marquee-a flex w-max gap-4 px-4 sm:gap-5 sm:px-8" style={{ animationDuration: `${rowADuration}s` }}>
              {marqueeCards.map((product, index) => renderCard(product, `a-${product.productID}-${index}`))}
            </div>
          </div>

          {/* Row B - moving right */}
          <div className="overflow-hidden">
            <div ref={rowBRef} className="pop-marquee-b flex w-max gap-4 px-4 sm:gap-5 sm:px-8" style={{ animationDuration: `${rowBDuration}s` }}>
              {marqueeCards.map((product, index) => renderCard(product, `b-${product.productID}-${index}`))}
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </section>
  )
}