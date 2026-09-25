"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  ChevronDown,
  Filter,
  PackagePlus,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { LoginModal } from "./LoginModal";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import { submitServiceRequest } from "../../lib/serviceRequests";

interface ShoppingDirectoryProps {
  searchQuery?: string;
  categoryFilter?: string;
  onSelectCategory?: (categoryId: string) => void;
  onClearFilters?: () => void;
}

const getImageUrl = (imageField: unknown) => {
  try {
    if (!imageField) return "";
    const parsed =
      typeof imageField === "string" ? JSON.parse(imageField) : imageField;
    const url = Array.isArray(parsed)
      ? parsed[0]
      : typeof parsed === "string"
        ? parsed
        : "";
    return url?.startsWith("blob:") ? "" : url || "";
  } catch {
    return typeof imageField === "string" && !imageField.startsWith("blob:")
      ? imageField
      : "";
  }
};

const exclusiveItems = [
  {
    title: "Tirupati Laddu",
    desc: "Authentic temple prasadam, sourced to order.",
    image: "/images/sweets/tirupati-laddu.webp",
  },
  {
    title: "Tirunelveli Halwa",
    desc: "Traditional, rich Tirunelveli halwa.",
    image: "/images/sweets/tirunelveli-halwa.webp",
  },
  {
    title: "Thoothukudi Macaroon",
    desc: "The famous cashew macaroon from Thoothukudi.",
    image: "/images/sweets/thoothukudi-macaroon.webp",
  },
];

export function ShoppingDirectory({
  searchQuery = "",
  categoryFilter = "",
  onSelectCategory,
  onClearFilters,
}: ShoppingDirectoryProps) {
  const [activeTab, setActiveTab] = useState<"directory" | "exclusive">(
    "directory",
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [exclusiveList, setExclusiveList] = useState("");
  const [exclusiveQuantity, setExclusiveQuantity] = useState("1");
  const [exclusiveName, setExclusiveName] = useState("");
  const [exclusivePhone, setExclusivePhone] = useState("");
  const [exclusiveEmail, setExclusiveEmail] = useState("");
  const [exclusiveLocation, setExclusiveLocation] = useState("");
  const [isSubmittingExclusive, setIsSubmittingExclusive] = useState(false);
  const [exclusiveError, setExclusiveError] = useState("");

  const resolveCategoryId = (val: string, catList: any[]) => {
    if (!val) return "";
    const clean = val.toLowerCase().trim();
    const found = catList.find((c) => {
      const name = (c.categoryName || "").toLowerCase();
      const id = String(c.categoryID).toLowerCase();
      return (
        id === clean ||
        name === clean ||
        name.replace(/[^a-z0-9]/g, "") === clean.replace(/[^a-z0-9]/g, "") ||
        (clean.includes("dress") && name.includes("dress")) ||
        (clean.includes("wear") && name.includes("dress")) ||
        (clean.includes("saree") && name.includes("dress")) ||
        (clean.includes("ethnic") && name.includes("dress")) ||
        (clean.includes("sweet") && name.includes("sweet")) ||
        (clean.includes("snack") && name.includes("sweet")) ||
        (clean.includes("decor") && name.includes("decor")) ||
        (clean.includes("grocer") && name.includes("grocer")) ||
        (clean.includes("food") &&
          (name.includes("grocer") || name.includes("sweet"))) ||
        (clean.includes("pooja") && name.includes("pooja"))
      );
    });
    return found ? String(found.categoryID) : val;
  };

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: catData }, { data: productData }] = await Promise.all([
        supabase.from("category").select("*"),
        supabase.from("productTable").select("*"),
      ]);
      const cats = catData || [];
      setCategories(cats);
      setProducts(productData || []);

      if (categoryFilter) {
        const resolved = resolveCategoryId(categoryFilter, cats);
        setSelectedCategory(resolved);
      }
    };
    void fetchData();
  }, []);

  useEffect(() => {
    const syncTabFromHash = () =>
      setActiveTab(
        window.location.hash === "#exclusive" ? "exclusive" : "directory",
      );
    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      setActiveTab("directory");
      const resolved = resolveCategoryId(categoryFilter, categories);
      setSelectedCategory(resolved);
    } else {
      setSelectedCategory("");
    }
  }, [categoryFilter, categories]);

  const exclusiveCategory = categories.find(
    (category) => category.categoryName === "Exclusive",
  );
  const regularCategories = categories.filter(
    (category) => category.categoryName !== "Exclusive",
  );

  const matchesSearch = (name: string | undefined) =>
    !searchQuery ||
    (name || "").toLowerCase().includes(searchQuery.toLowerCase());

  // Strictly filter products by active category ID when selected
  const directoryProducts = products.filter(
    (product) =>
      product.categoryID !== exclusiveCategory?.categoryID &&
      (!selectedCategory ||
        String(product.categoryID) === String(selectedCategory)) &&
      matchesSearch(product.productName),
  );

  const activeCategoryObj = regularCategories.find(
    (c) => String(c.categoryID) === String(selectedCategory),
  );

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    onSelectCategory?.(catId);
  };

  const addToCart = async (product: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const customerId = user?.customerID ?? user?.customerId ?? user?.id;
    if (!customerId) {
      setIsLoginOpen(true);
      return;
    }

    setIsAdding(String(product.productID));
    const { data: existingItem, error: lookupError } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("customer_id", customerId)
      .eq("product_id", product.productID)
      .maybeSingle();

    const { error } = lookupError
      ? { error: lookupError }
      : existingItem
        ? await supabase
            .from("cart")
            .update({ quantity: (Number(existingItem.quantity) || 0) + 1 })
            .eq("id", existingItem.id)
        : await supabase.from("cart").insert([
            {
              customer_id: customerId,
              product_id: product.productID,
              name: product.productName,
              price: 0,
              image: getImageUrl(product.imageURL),
              quantity: 1,
            },
          ]);

    setIsAdding(null);
    if (error) {
      console.error("Unable to add directory item to cart:", error);
      toast.error("Could not add this item to your cart. Please try again.");
      return;
    }
    window.dispatchEvent(new Event("cart-updated"));
    toast.success(
      existingItem
        ? `${product.productName} quantity increased.`
        : `${product.productName} added to your cart.`,
    );
  };

  const submitExclusiveRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!exclusiveList.trim()) {
      setExclusiveError("Please share the items you would like us to source.");
      return;
    }
    if (
      !exclusiveName.trim() ||
      !exclusivePhone.trim() ||
      !exclusiveEmail.trim() ||
      !exclusiveLocation.trim()
    ) {
      setExclusiveError(
        "Please complete your name, phone, email, and delivery location.",
      );
      return;
    }
    setExclusiveError("");
    setIsSubmittingExclusive(true);
    try {
      const result = await submitServiceRequest("exclusive_sourcing", {
        customerName: exclusiveName,
        phone: exclusivePhone,
        email: exclusiveEmail,
        location: exclusiveLocation,
        requestedItems: exclusiveList,
        quantity: exclusiveQuantity,
      });
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      setExclusiveList("");
      setExclusiveQuantity("1");
      setIsThankYouOpen(true);
      toast.success(
        result.emailSent
          ? "Sourcing request sent to WhatsApp and email."
          : "Sourcing request sent to WhatsApp.",
      );
    } catch (error) {
      setExclusiveError(
        error instanceof Error
          ? error.message
          : "Unable to submit your sourcing request.",
      );
    } finally {
      setIsSubmittingExclusive(false);
    }
  };

  const clearDirectoryFilters = () => {
    setSelectedCategory("");
    onClearFilters?.();
  };

  return (
    <section
      id="shop-directory"
      className="scroll-mt-24 border-b border-slate-200 bg-[#F7F9FF] py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Top Control Bar: Tabs & Dropdown Filter */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("directory")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "directory"
                  ? "bg-[#0B56D9] text-white shadow-xs"
                  : "text-slate-500 hover:text-[#0A1931]"
              }`}
            >
              <ShoppingBag size={14} /> Catalog Directory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("exclusive")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "exclusive"
                  ? "bg-[#0B56D9] text-white shadow-xs"
                  : "text-slate-500 hover:text-[#0A1931]"
              }`}
            >
              <Sparkles size={14} /> Exclusive Sourcing
            </button>
          </div>

          {activeTab === "directory" && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  aria-label="Filter products by category"
                  value={selectedCategory}
                  onChange={(event) => handleCategorySelect(event.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-full border border-slate-300 bg-white py-2 pl-4 pr-10 text-xs font-bold text-[#0A1931] focus:outline-none focus:ring-2 focus:ring-[#0B56D9]"
                >
                  <option value="">
                    All Categories (
                    {
                      products.filter(
                        (p) => p.categoryID !== exclusiveCategory?.categoryID,
                      ).length
                    }
                    )
                  </option>
                  {regularCategories.map((category) => {
                    const count = products.filter(
                      (p) =>
                        String(p.categoryID) === String(category.categoryID),
                    ).length;
                    return (
                      <option
                        key={category.categoryID}
                        value={category.categoryID}
                      >
                        {category.categoryName} ({count})
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>

              <span className="whitespace-nowrap rounded-full border border-slate-300 bg-slate-200 px-3.5 py-1.5 text-[11px] font-bold text-[#0A1931]">
                {directoryProducts.length} items
              </span>

              {(selectedCategory || searchQuery) && (
                <button
                  type="button"
                  onClick={clearDirectoryFilters}
                  className="cursor-pointer text-xs font-extrabold text-[#0B56D9] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Prominent Category Pills Bar */}
        {activeTab === "directory" && (
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              type="button"
              onClick={() => handleCategorySelect("")}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                !selectedCategory
                  ? "bg-[#0A1931] text-white shadow-xs"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              All Products
            </button>
            {regularCategories.map((cat) => {
              const isSelected =
                String(cat.categoryID) === String(selectedCategory);
              return (
                <button
                  key={cat.categoryID}
                  type="button"
                  onClick={() => handleCategorySelect(String(cat.categoryID))}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#0B56D9] text-white shadow-xs ring-2 ring-[#0B56D9]/30"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {cat.categoryName}
                </button>
              );
            })}
          </div>
        )}

        {/* Active Dedicated Category Header */}
        {activeTab === "directory" && activeCategoryObj && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-blue-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0B56D9] text-[10px] font-extrabold uppercase tracking-wider">
                  <Filter size={10} /> Active Category Filter
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {directoryProducts.length} product
                  {directoryProducts.length === 1 ? "" : "s"} found
                </span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#0A1931]">
                {activeCategoryObj.categoryName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Displaying only authentic items under{" "}
                {activeCategoryObj.categoryName}. Add to cart for combined
                international shipping.
              </p>
            </div>
            <button
              type="button"
              onClick={clearDirectoryFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer shrink-0"
            >
              <X size={14} />
              <span>Show All Categories</span>
            </button>
          </div>
        )}

        {searchQuery && activeTab === "directory" && (
          <p className="mb-5 text-xs font-semibold text-slate-600">
            Showing results for{" "}
            <span className="text-[#0B56D9]">“{searchQuery}”</span>
          </p>
        )}

        {activeTab === "directory" ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {directoryProducts.map((product) => (
                <motion.article
                  key={product.productID}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="aspect-square w-full overflow-hidden bg-slate-100">
                      <img
                        src={getImageUrl(product.imageURL) || "/no-image.png"}
                        alt={product.productName}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3.5 sm:p-4">
                      <p className="min-h-[2.5rem] text-sm font-bold leading-snug text-[#0A1931] line-clamp-2">
                        {product.productName}
                      </p>
                      {product.price && (
                        <p className="mt-1 text-xs font-extrabold text-[#0B56D9]">
                          ₹{product.price}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-3.5 sm:p-4 pt-0">
                    <button
                      type="button"
                      disabled={isAdding === String(product.productID)}
                      onClick={() => void addToCart(product)}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0B56D9] px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7] disabled:opacity-60 cursor-pointer"
                    >
                      <PackagePlus className="h-3.5 w-3.5" />{" "}
                      {isAdding === String(product.productID)
                        ? "Adding…"
                        : "Add to cart"}
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            {directoryProducts.length === 0 && (
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
                <p className="text-base font-bold text-[#0A1931]">
                  No products found in this category
                </p>
                <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto">
                  We are constantly adding new items. Try selecting a different
                  category or search term, or request custom sourcing below.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={clearDirectoryFilters}
                    className="cursor-pointer rounded-full border border-[#0B56D9] px-5 py-2 text-xs font-extrabold text-[#0B56D9] transition-colors hover:bg-blue-50"
                  >
                    View All Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("exclusive")}
                    className="cursor-pointer rounded-full bg-[#0B56D9] px-5 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#0849B7]"
                  >
                    Request Exclusive Sourcing
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0B56D9]">
              <Sparkles className="h-3.5 w-3.5 text-[#0B56D9]" />
              Exclusive Sourcing Desk
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A1931]">
              We Exclusively Source These Famous Items
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-xl">
              Can’t find what you need? We source authentic regional specialties
              directly from India and air-ship them fresh to your destination.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {exclusiveItems.map((item) => {
                const selectedItems = exclusiveList.split(",").map((value) => value.trim()).filter(Boolean);
                const isSelected = selectedItems.includes(item.title);
                return (
                  <button
                    key={item.title}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      const nextItems = isSelected
                        ? selectedItems.filter((value) => value !== item.title)
                        : [...selectedItems, item.title];
                      setExclusiveList(nextItems.join(", "));
                    }}
                    className={`group relative rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#0B56D9] bg-blue-50/80 shadow-xs ring-1 ring-[#0B56D9]"
                        : "border-slate-200 bg-[#F7F9FF] hover:border-[#0B56D9] hover:bg-blue-50/40"
                    }`}
                  >
                    <span className="relative block aspect-square overflow-hidden rounded-xl bg-white">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
                      {isSelected && <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0B56D9] text-white shadow"><CheckCircle2 className="h-5 w-5" /></span>}
                    </span>
                    <span className="mt-3 block text-sm font-extrabold text-[#0A1931] transition-colors group-hover:text-[#0B56D9] sm:text-base">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={submitExclusiveRequest} className="mt-8 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-extrabold text-[#0A1931]">
                  Your Name <span className="text-red-500">*</span>
                  <input
                    required
                    value={exclusiveName}
                    onChange={(event) => setExclusiveName(event.target.value)}
                    placeholder="Enter your name"
                    className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-[#0B56D9]"
                  />
                </label>
                <label className="block text-xs font-extrabold text-[#0A1931]">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                  <input
                    required
                    type="tel"
                    value={exclusivePhone}
                    onChange={(event) => setExclusivePhone(event.target.value)}
                    placeholder="Enter your phone number"
                    className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-[#0B56D9]"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-extrabold text-[#0A1931]">
                  Email Address <span className="text-red-500">*</span>
                  <input
                    required
                    type="email"
                    value={exclusiveEmail}
                    onChange={(event) => setExclusiveEmail(event.target.value)}
                    placeholder="Enter your email address"
                    className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-[#0B56D9]"
                  />
                </label>
                <label className="block text-xs font-extrabold text-[#0A1931]">
                  Where to Send <span className="text-red-500">*</span>
                  <input
                    required
                    value={exclusiveLocation}
                    onChange={(event) =>
                      setExclusiveLocation(event.target.value)
                    }
                    placeholder="Enter your address"
                    className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-[#0B56D9]"
                  />
                </label>
              </div>
              <label className="block text-sm font-extrabold text-[#0A1931]">
                Share your item list or requirements below:{" "}
                <span className="text-red-500">*</span>
                <textarea
                  required
                  value={exclusiveList}
                  onChange={(event) => setExclusiveList(event.target.value)}
                  rows={4}
                  placeholder="Enter the items you want to source..."
                  className="mt-2 block w-full resize-none rounded-2xl border border-slate-300 p-4 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-[#0B56D9] focus:ring-4 focus:ring-blue-50"
                />
              </label>
              <label className="block max-w-xs text-sm font-extrabold text-[#0A1931]">
                Quantity / Estimate
                <input
                  required
                  min="1"
                  type="number"
                  value={exclusiveQuantity}
                  onChange={(event) => setExclusiveQuantity(event.target.value)}
                  placeholder="Enter quantity or estimate"
                  className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-[#0B56D9] focus:ring-4 focus:ring-blue-50"
                />
              </label>
              {exclusiveError && (
                <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">
                  {exclusiveError}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmittingExclusive}
                className="inline-flex items-center gap-2 rounded-full bg-[#0B56D9] px-7 py-3.5 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7] cursor-pointer disabled:opacity-60"
              >
                <FaWhatsapp size={16} className="text-[#25D366]" />
                <span>
                  {isSubmittingExclusive
                    ? "Submitting..."
                    : "Submit to WhatsApp & Email"}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AnimatePresence>
        {isThankYouOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close confirmation"
              onClick={() => setIsThankYouOpen(false)}
              className="fixed inset-0 z-[105] bg-slate-950/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="shopping-confirmation-title"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="fixed left-1/2 top-1/2 z-[106] w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-9"
            >
              <button
                type="button"
                onClick={() => setIsThankYouOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2
                id="shopping-confirmation-title"
                className="mt-5 text-2xl font-extrabold tracking-tight text-[#0A1931]"
              >
                Thank you for your sourcing request!
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Our personal shopping concierge will review your list and
                contact you with quotes and shipping estimates.
              </p>
              <button
                type="button"
                onClick={() => setIsThankYouOpen(false)}
                className="mt-7 rounded-full bg-[#0B56D9] px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-white cursor-pointer"
              >
                Done
              </button>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
