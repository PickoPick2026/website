import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, SlidersHorizontal, X, ShoppingCart, Star, Percent } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
type OutletContextType = {
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
};





const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under Rs100", min: 0, max: 100 },
  { label: "Rs100 - Rs500", min: 100, max: 500 },
  { label: "Rs500 - Rs1000", min: 500, max: 1000 },
  { label: "Rs1000+", min: 1000, max: Infinity },
];

export default function Products() {
 
  const context = useOutletContext<OutletContextType | null>();
const setCartCount = context?.setCartCount || (() => {});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [categories, setCategories] = useState<string[]>(["All"]);



useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    // 🔥 FETCH PRODUCTS
    const { data, error } = await supabase
      .from("productTable")
      .select(`
        productID,
        productName,
        price,
        stock,
        imageURL,
        category:categoryID (
          categoryName
        )
      `);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

  const formatted = (data || []).map((item: any) => {
   let imageUrl = "";

try {
  const parsed =
    typeof item.imageURL === "string"
      ? JSON.parse(item.imageURL)
      : item.imageURL;

  if (Array.isArray(parsed)) {
    imageUrl = parsed[0]; // ✅ EXACT SAME AS ADMIN
  } else if (typeof parsed === "string") {
    imageUrl = parsed;
  }
} catch {
  imageUrl = "";
}

//  REMOVE ONLY BLOB
if (imageUrl.startsWith("blob:")) {
  imageUrl = "";
}
  return {
    id: item.productID,
    name: item.productName,
    price: Number(item.price),
    image: imageUrl, 
    category: item.category?.categoryName || "Other",
    inStock: Number(item.stock) > 0,
    rating: 4.5,
    reviews: 100,
  };

  
});


    setProducts(formatted);

    //  FETCH CATEGORIES
    const { data: catData } = await supabase
      .from("category")
      .select("categoryName")
      .eq("categoryStatus", true);

    if (catData) {
      setCategories(["All", ...catData.map(c => c.categoryName)]);
    }

    setLoading(false);
  };

  fetchData();
  
}, []);
  
const handleAddToCart = async (product: any) => {
  const price = Number(product.price ?? product.price_value ?? 0);

  // ❌ Never allow zero / invalid priced products into the cart
  if (!Number.isFinite(price) || price < 1) {
    toast.error("This product isn't available for purchase yet ❌");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { error } = await supabase.from("cart").insert([
    {
      customer_id: user.customerID,
      product_id: product.id,


      name: product.name || product.title,
      price,
      image: product.image || product.image_url || "",

      quantity: 1,
    },
  ]);

  if (error) {
    console.error(error);
     toast.error("Failed to add to cart ❌");
    return;
  }

  toast.success(`${product.name} added to cart 🛒`);
  window.dispatchEvent(new Event("cart-updated"));

};
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

    if (loading) {
  return (
    <div className="min-h-full bg-[#F7F9FF]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="h-56 w-full animate-pulse bg-slate-100" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                <div className="h-6 w-1/4 animate-pulse rounded bg-slate-100" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-full bg-[#F7F9FF]">
      {/* Discount Banner */}
      {/* <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Percent className="size-8 md:size-10" />
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Spring Sale - Up to 25% Off!</h2>
                <p className="text-purple-100 text-sm md:text-base">Limited time offer on selected electronics</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors whitespace-nowrap">
              Shop Now
            </button>
          </div>
        </div>
      </div> */}

      

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Marketplace hero */}
        <section className="relative pt-10 sm:pt-14 lg:pt-20">
          <div
            className="relative min-h-[470px] overflow-hidden rounded-[28px] border border-blue-700 bg-cover bg-center px-6 py-8 sm:px-10 sm:py-10 lg:min-h-[285px] lg:px-14 lg:py-12"
            style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.webp')" }}
          >
            <div className="relative z-10 max-w-xl lg:max-w-[48%]">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.22em] text-[#FFC13D]">Shop from India</p>
              <h1 className="max-w-lg text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
                Shop India. <span className="text-[#FFC13D]">Send it your way.</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-6 text-blue-100 sm:text-base">
                Indian essentials, festive favourites and thoughtful finds — sourced, packed and delivered to your doorstep.
              </p>
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 top-10 z-20 sm:top-14 lg:top-20"
            style={{ clipPath: "inset(-10rem 0 0 0)" }}
          >
            <img
              src="/images/marketplace-concierge-v1.png"
              alt="Pick O Pick concierge with Indian products ready to ship"
              className="absolute bottom-0 right-[-1.5rem] h-[355px] w-auto max-w-[105%] object-contain sm:right-[-2.5rem] sm:h-[425px] lg:right-[-3rem] lg:h-[420px]"
            />
          </div>
        </section>
        {/* Search and Filters */}
        <div className="mb-6 mt-5 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-[#0A1931] outline-none focus:border-[#0B56D9] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#0A1931] transition-colors hover:bg-slate-50 md:hidden"
            >
              <SlidersHorizontal className="size-5" />
              Filters
            </button>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0A1931] outline-none focus:border-[#0B56D9] focus:ring-2 focus:ring-blue-100"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold tracking-tight text-[#0A1931]">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="size-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-[#0B56D9] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange.label === range.label}
                        onChange={() => setSelectedPriceRange(range)}
                        className="size-4 text-blue-600"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-5 lg:gap-7">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden w-64 shrink-0 md:block">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="mb-4 text-base font-extrabold text-[#0A1931]">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange.label === range.label}
                        onChange={() => setSelectedPriceRange(range)}
                        className="size-4 text-blue-600"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm font-medium text-slate-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-[#0B56D9]"
                >
                  <div className="relative">
                    <img
                      src={product.image || "/no-image.png"}
                      alt={product.name}
                      className="h-56 w-full object-cover"
                    />
                    {product.discount && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                        -{product.discount}%
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-1 text-xs font-medium text-slate-500">{product.category}</div>
                    <h3 className="mb-2 line-clamp-2 min-h-10 font-extrabold text-[#0A1931]">{product.name}</h3>
             
                 {/*
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                         
                        <span className="text-sm font-medium">{product.rating}</span> 
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>

                    */}

                    <div className="mb-4 flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-[#0B56D9]">
                        Rs{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          Rs{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock || Number(product.price) < 1}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B56D9] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0849B7] disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <ShoppingCart className="size-5" />
                      {Number(product.price) < 1 ? "Unavailable" : "Add to Cart"}
                    </button>
                    
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No products found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
