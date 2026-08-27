"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, ShoppingBag, Sparkles, ChevronDown } from "lucide-react"
import { LoginModal } from "./LoginModal"
import { supabase } from "@/src/lib/supabase"

interface ShoppingDirectoryProps {
  searchQuery?: string;
}

export function ShoppingDirectory({ searchQuery = '' }: ShoppingDirectoryProps) {
  const [activeTab, setActiveTab] = useState("directory")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const syncTabFromHash = () => setActiveTab(window.location.hash === '#exclusive' ? 'exclusive' : 'directory');
    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, [])

  const fetchData = async () => {
    // ✅ Fetch categories
    const { data: catData } = await supabase
      .from("category")
      .select("*")
      // .eq("categoryStatus", "active")

    // ✅ Fetch products
    const { data: prodData } = await supabase
      .from("productTable")
      .select("*")

    setCategories(catData || [])
    setProducts(prodData || [])

    if (catData && catData.length > 0) {
      setSelectedCategory("") // default: all
    }
  }

  const exclusiveCategory = categories.find((c) => c.categoryName === "Exclusive")

  const regularCategories = categories.filter((cat) => cat.categoryName !== "Exclusive")

  const matchesSearch = (name: string | undefined) =>
    !searchQuery || (name || "").toLowerCase().includes(searchQuery.toLowerCase())

  // ✅ All products (excluding Exclusive) optional-filtered by dropdown + search
  const directoryProducts = products.filter(
    (p) =>
      p.categoryID !== exclusiveCategory?.categoryID &&
      (!selectedCategory || p.categoryID === selectedCategory) &&
      matchesSearch(p.productName)
  )

  const exclusiveProducts = products.filter(
    (p) => p.categoryID === exclusiveCategory?.categoryID && matchesSearch(p.productName)
  )

  const shownProducts = activeTab === "directory" ? directoryProducts : exclusiveProducts

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

    // ❌ remove blob
    if (url.startsWith("blob:")) return ""

    return url
  } catch {
    return ""
  }
}

  return (
    <section id="shop-directory" className="bg-[#F7F9FF] py-14 sm:py-16 border-b border-slate-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Tabs + Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Tabs */}
          <div className="inline-flex p-1 rounded-full bg-white border border-slate-200 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab("directory")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "directory"
                  ? "bg-[#0B56D9] text-white shadow-md shadow-[#0B56D9]/20"
                  : "text-slate-500 hover:text-[#0A1931]"
              }`}
            >
              <ShoppingBag size={14} /> Directory
            </button>

            <button
              onClick={() => setActiveTab("exclusive")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "exclusive"
                  ? "bg-[#0B56D9] text-white shadow-md shadow-[#0B56D9]/20"
                  : "text-slate-500 hover:text-[#0A1931]"
              }`}
            >
              <Sparkles size={14} /> Exclusive
            </button>
          </div>

          {/* Category dropdown + count */}
          <div className="flex items-center gap-3">
            {activeTab === "directory" && (
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none w-full sm:w-auto rounded-full border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-xs font-bold text-[#0A1931] focus:outline-none focus:ring-2 focus:ring-[#0B56D9] cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {regularCategories.map((cat) => (
                    <option key={cat.categoryID} value={cat.categoryID}>{cat.categoryName}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              </div>
            )}
            <span className="rounded-full bg-slate-200 border border-slate-300 px-3.5 py-2 text-[11px] font-bold text-[#0A1931] whitespace-nowrap">
              {shownProducts.length} items
            </span>
          </div>
        </div>

        {/* Active filter hint */}
        {searchQuery && (
          <p className="mb-5 text-xs font-semibold text-slate-600">
            Showing results for <span className="text-[#0B56D9]">“{searchQuery}”</span>
          </p>
        )}

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectedCategory}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {shownProducts.map((product) => (
              <div
                key={product.productID}
                onClick={() => setIsLoginOpen(true)}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-[#0B56D9]/40 transition-colors cursor-pointer"
              >
                {/* IMAGE - square, full image shown */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  <img
                    src={getImageUrl(product.imageURL) || "/no-image.png"}
                    alt={product.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <p className="text-sm font-bold text-[#0A1931] line-clamp-2 min-h-[2.5rem] leading-snug">
                    {product.productName}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B56D9]">
                      {product.price ? `₹${product.price}` : "Shop Now"}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all group-hover:bg-[#0B56D9] group-hover:text-white">
                      <ArrowRight size={14} className="group-hover:-rotate-45 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {shownProducts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-[#0A1931]">No products found</p>
            <p className="mt-1 text-xs text-slate-500">Try selecting a different category or search term.</p>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </section>
  )
}