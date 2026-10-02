import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/src/lib/supabase";

interface ShowcaseProduct {
  productID: string | number;
  productName?: string;
  price?: number | string;
  imageURL?: unknown;
  categoryID?: string | number;
}

interface ShowcaseCategory {
  categoryID: string | number;
  categoryName?: string;
}

const MAX_ROW_PRODUCTS = 12;

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
    return url && !url.startsWith("blob:") ? url : "";
  } catch {
    return typeof imageField === "string" && !imageField.startsWith("blob:")
      ? imageField
      : "";
  }
};

const shopUrl = (categoryName?: string) =>
  categoryName ? `/shop?category=${encodeURIComponent(categoryName)}` : "/shop";

// Home "Browse by Category": category tiles + one swipeable product row.
export function ShoppingDirectoryMarquee() {
  const [categories, setCategories] = useState<ShowcaseCategory[]>([]);
  const [products, setProducts] = useState<ShowcaseProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: catData }, { data: prodData }] = await Promise.all([
        supabase.from("category").select("categoryID, categoryName"),
        supabase
          .from("productTable")
          .select("productID, productName, price, imageURL, categoryID"),
      ]);
      setCategories(catData || []);
      setProducts(prodData || []);
      setIsLoading(false);
    };
    void fetchData();
  }, []);

  const exclusiveId = categories.find(
    (c) => c.categoryName === "Exclusive",
  )?.categoryID;

  // Only show categories that actually have products, each with a cover image.
  const tiles = categories
    .filter((c) => c.categoryName !== "Exclusive")
    .map((category) => {
      const inCategory = products.filter(
        (p) => String(p.categoryID) === String(category.categoryID),
      );
      const cover = inCategory.map((p) => getImageUrl(p.imageURL)).find(Boolean);
      return { ...category, count: inCategory.length, cover };
    })
    .filter((tile) => tile.count > 0);

  const activeTile = tiles.find(
    (t) => String(t.categoryID) === activeCategory,
  );

  const rowProducts = products
    .filter(
      (p) =>
        String(p.categoryID) !== String(exclusiveId) &&
        (!activeCategory || String(p.categoryID) === activeCategory),
    )
    .slice(0, MAX_ROW_PRODUCTS);

  const scrollRow = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: "smooth" });
  };

  const selectCategory = (id: string) => {
    setActiveCategory(id);
    rowRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  return (
    <section
      id="shop-directory"
      className="border-b border-slate-200 bg-[#F7F9FF] py-14 sm:py-20 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0B56D9]">
              Marketplace Showcase
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              A curated selection of authentic Indian products available for
              doorstep worldwide delivery.
            </p>
          </div>
          <Link
            to="/shop"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#0B56D9] px-5 py-3 text-xs font-extrabold text-white transition-colors hover:bg-[#0849B7]"
          >
            Open Full Marketplace
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category tiles — swipe on mobile, grid on desktop */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
          <button
            type="button"
            onClick={() => selectCategory("")}
            aria-pressed={!activeCategory}
            className={`group flex w-28 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-all sm:w-auto ${
              !activeCategory
                ? "border-[#0B56D9] bg-[#0B56D9] text-white"
                : "border-slate-200 bg-white text-[#0A1931] hover:border-[#0B56D9]/40"
            }`}
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                !activeCategory ? "bg-white/15" : "bg-blue-50 text-[#0B56D9]"
              }`}
            >
              <LayoutGrid size={20} />
            </span>
            <span className="text-xs font-extrabold">All products</span>
          </button>

          {isLoading
            ? Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="h-[132px] w-28 shrink-0 animate-pulse rounded-2xl bg-white sm:w-auto"
                />
              ))
            : tiles.map((tile) => {
                const id = String(tile.categoryID);
                const isActive = activeCategory === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectCategory(id)}
                    aria-pressed={isActive}
                    className={`group w-28 shrink-0 snap-start overflow-hidden rounded-2xl border bg-white p-1.5 text-left transition-all sm:w-auto ${
                      isActive
                        ? "border-[#0B56D9] ring-2 ring-[#0B56D9]/20"
                        : "border-slate-200 hover:-translate-y-0.5 hover:border-[#0B56D9]/40"
                    }`}
                  >
                    <span className="block aspect-[4/3] overflow-hidden rounded-xl bg-[#F7F9FF]">
                      {tile.cover ? (
                        <img
                          src={tile.cover}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-[#0B56D9]/40">
                          <LayoutGrid size={22} />
                        </span>
                      )}
                    </span>
                    <span className="block px-1.5 pb-1 pt-2">
                      <span
                        className={`block truncate text-xs font-extrabold ${
                          isActive ? "text-[#0B56D9]" : "text-[#0A1931]"
                        }`}
                      >
                        {tile.categoryName}
                      </span>
                      <span className="block text-[11px] font-semibold text-slate-400">
                        {tile.count} item{tile.count === 1 ? "" : "s"}
                      </span>
                    </span>
                  </button>
                );
              })}
        </div>

        {/* Product row */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-extrabold text-[#0A1931] sm:text-lg">
              {activeTile ? activeTile.categoryName : "Popular right now"}
            </h3>
            <div className="flex items-center gap-2">
              <Link
                to={shopUrl(activeTile?.categoryName)}
                className="text-xs font-extrabold text-[#0B56D9] hover:underline"
              >
                View all
              </Link>
              <button
                type="button"
                onClick={() => scrollRow(-1)}
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#0B56D9] hover:text-[#0B56D9] sm:flex"
                aria-label="Scroll products left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollRow(1)}
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#0B56D9] hover:text-[#0B56D9] sm:flex"
                aria-label="Scroll products right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {!isLoading && rowProducts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500">
              No products in this category yet — check back soon.
            </p>
          ) : (
            <div
              ref={rowRef}
              className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 scrollbar-hide sm:mx-0 sm:gap-4 sm:px-0"
            >
              {rowProducts.map((product) => {
                const category = tiles.find(
                  (t) => String(t.categoryID) === String(product.categoryID),
                );
                return (
                  <Link
                    key={product.productID}
                    to={shopUrl(category?.categoryName)}
                    className="group w-[44%] shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-1.5 transition-all hover:-translate-y-0.5 hover:border-[#0B56D9]/40 sm:w-52"
                  >
                    <span className="block aspect-square overflow-hidden rounded-xl bg-[#F7F9FF]">
                      <img
                        src={getImageUrl(product.imageURL) || "/no-image.png"}
                        alt={product.productName || "Product"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </span>
                    <span className="block px-1.5 pb-1.5 pt-2.5">
                      <span className="line-clamp-2 min-h-[2.25rem] text-xs font-bold leading-snug text-[#0A1931] sm:text-sm">
                        {product.productName}
                      </span>
                      <span className="mt-1.5 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#0B56D9]">
                          {product.price ? `₹${product.price}` : "View in Shop"}
                        </span>
                        <ArrowRight
                          size={13}
                          className="text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-[#0B56D9]"
                        />
                      </span>
                    </span>
                  </Link>
                );
              })}

              {/* Final "see more" card */}
              <Link
                to={shopUrl(activeTile?.categoryName)}
                className="flex w-[44%] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#0B56D9]/40 bg-white p-4 text-center text-[#0B56D9] transition-colors hover:bg-blue-50 sm:w-52"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                  <ArrowRight size={18} />
                </span>
                <span className="text-xs font-extrabold">
                  See all {activeTile ? activeTile.categoryName : "products"}
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Exclusive sourcing shortcut */}
        <Link
          to="/shop#exclusive"
          className="group mt-8 flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-4 transition-colors hover:border-[#0B56D9]/40 sm:p-5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B56D9] text-white">
            <Sparkles size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold text-[#0A1931]">
              Can’t find it? Try Exclusive Sourcing
            </span>
            <span className="block text-xs text-slate-500">
              Tirupati Laddu, Tirunelveli Halwa and more — sourced to order.
            </span>
          </span>
          <ArrowRight
            size={16}
            className="shrink-0 text-[#0B56D9] transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
