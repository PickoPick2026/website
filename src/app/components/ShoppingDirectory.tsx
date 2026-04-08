"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react"
import { LoginModal } from "./LoginModal"
import { supabase } from "@/src/lib/supabase"

export function ShoppingDirectory() {
  const [activeTab, setActiveTab] = useState("directory")
  const [activeCategory, setActiveCategory] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  useEffect(() => {
    fetchData()
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
      setActiveCategory(catData[0]) // default select
    }
  }
const exclusiveCategory = categories.find(
    (c) => c.categoryName === "Exclusive"
  );
  // ✅ Filter products by selected category
  const filteredProducts = products.filter(
    (p) =>
      p.categoryID === activeCategory?.categoryID &&
      p.categoryID !== exclusiveCategory?.categoryID
  );
  
  const exclusiveProducts = products.filter(
    (p) => p.categoryID === exclusiveCategory?.categoryID
  );

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
    
    <section  id="shop-directory"  className="py-20 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Shop Directory
            </h2>
            <p className="text-base text-slate-500">
              Browse categories and products dynamically from database.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("directory")}
              className={`px-5 py-2 rounded-lg text-sm ${
                activeTab === "directory"
                  ? "bg-white shadow"
                  : "text-slate-500"
              }`}
            >
              <ShoppingBag size={16} /> Directory
            </button>

            <button
              onClick={() => setActiveTab("exclusive")}
              className={`px-5 py-2 rounded-lg text-sm ${
                activeTab === "exclusive"
                  ? "bg-white shadow"
                  : "text-slate-500"
              }`}
            >
              <Sparkles size={16} /> Exclusive
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {activeTab === "directory" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT: Categories */}
            <div className="lg:col-span-3 flex flex-col gap-2">
              {categories
                .filter((cat) => cat.categoryName !== "Exclusive")
                .map((cat) => (
                <button
                  key={cat.categoryID}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left px-4 py-2 rounded-xl ${
                    activeCategory?.categoryID === cat.categoryID
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>

            {/* RIGHT: Products with Images */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory?.categoryID}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {filteredProducts.map((product) => (
                    <div
                      key={product.productID}
                      onClick={() => setIsLoginOpen(true)}
                      className="group border rounded-xl overflow-hidden hover:shadow-lg cursor-pointer"
                    >
                      {/* IMAGE */}
                      <img
                        src={getImageUrl(product.imageURL) || "/no-image.png"}
                        alt={product.productName}
                        className="w-full h-32 object-cover"
                      />

                      {/* CONTENT */}
                      <div className="p-3 flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {product.productName}
                        </span>

                        <ArrowRight
                          size={16}
                          className="group-hover:-rotate-45 transition"
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        ) : (
          <div>
  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
    <Sparkles /> Exclusive Products
  </h3>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {exclusiveProducts.map((product) => (
      <div
        key={product.productID}
        onClick={() => setIsLoginOpen(true)}
        className="group border rounded-xl overflow-hidden hover:shadow-lg cursor-pointer"
      >
        {/* IMAGE */}
        <img
          src={getImageUrl(product.imageURL) || "/no-image.png"}
          alt={product.productName}
          className="w-full h-32 object-cover"
        />

        {/* CONTENT */}
        <div className="p-3 flex justify-between items-center">
          <span className="text-sm font-medium">
            {product.productName}
          </span>

          <ArrowRight
            size={16}
            className="group-hover:-rotate-45 transition"
          />
        </div>
      </div>
    ))}
  </div>
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