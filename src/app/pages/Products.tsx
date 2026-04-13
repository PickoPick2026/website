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
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log("PRODUCT:", product);

  const { error } = await supabase.from("cart").insert([
    {
      customer_id: user.customerID,
      product_id: product.id,

     
      name: product.name || product.title,
      price: product.price || product.price_value || 0,
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
  return <div className="p-10 text-center">Loading products...</div>;
}

  return (
    <div className="bg-gray-50">
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

      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Section */}
        <div className="w-full">
          <img
            src="/Artboard.jpeg"
            alt="Sale Banner"
            className="w-full h-auto object-cover"
          />
        </div>
        <br />
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="size-5" />
              Filters
            </button>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="md:hidden mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="size-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
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

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
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
                <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
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
            <div className="mb-4 text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.image || "/no-image.png"}
                      alt={product.name}
                      className="w-full h-64 object-cover"
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
                    <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
             
                 {/*
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                         
                        <span className="text-sm font-medium">{product.rating}</span> 
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>

                    */}

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-blue-600">
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
                      disabled={!product.inStock}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="size-5" />
                      Add to Cart
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
