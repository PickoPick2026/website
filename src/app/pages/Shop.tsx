import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Globe2, Search, ShieldCheck, Truck, X } from "lucide-react";
import { ShoppingDirectory } from "../components/ShoppingDirectory";
import { CrossLinkBanner } from "../components/ServicePage";
import { CartDrawer } from "../components/Shop/CartDrawer";
import { supabase } from "@/src/lib/supabase";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // The cart lives in a drawer on this page: open it from ?cart=open
  // (Navbar from other pages, old /cart links) or the open-cart event.
  useEffect(() => {
    if (searchParams.get("cart") === "open") setIsCartOpen(true);
  }, [searchParams]);

  useEffect(() => {
    const openCart = () => setIsCartOpen(true);
    window.addEventListener("pickopick:open-cart", openCart);
    return () => window.removeEventListener("pickopick:open-cart", openCart);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("cart");
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  // Normalize & match category by ID or name
  const matchCategory = (catParam: string, list: any[]) => {
    if (!catParam) return "";
    const clean = catParam.toLowerCase().trim();
    const found = list.find((c) => {
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
    return found ? String(found.categoryID) : "";
  };

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase
        .from("category")
        .select("categoryID, categoryName");
      const filtered = (data || []).filter(
        (category) => category.categoryName !== "Exclusive",
      );
      setCategories(filtered);

      const urlCategory = searchParams.get("category");
      if (urlCategory) {
        const resolvedId = matchCategory(urlCategory, filtered);
        if (resolvedId) {
          setSelectedCategoryId(resolvedId);
        }
      }

      const urlSearch = searchParams.get("search");
      if (urlSearch) {
        setSearchInput(urlSearch);
        setQuery(urlSearch);
      }
    };
    void loadCategories();
  }, []);

  // Update when URL searchParams change
  useEffect(() => {
    if (categories.length === 0) return;
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      const resolvedId = matchCategory(urlCategory, categories);
      setSelectedCategoryId(resolvedId);
    } else {
      setSelectedCategoryId("");
    }

    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) {
      setSearchInput(urlSearch);
      setQuery(urlSearch);
    }
  }, [searchParams, categories]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchInput.trim();
    setQuery(trimmed);
    const newParams = new URLSearchParams(searchParams);
    if (trimmed) {
      newParams.set("search", trimmed);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
    document
      .querySelector("#shop-directory")
      ?.scrollIntoView();
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    setQuery(value.trim());
    const newParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newParams.set("search", value.trim());
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const selectCategory = (id: string) => {
    setSelectedCategoryId(id);
    const matched = categories.find(
      (c) => String(c.categoryID) === String(id),
    );
    const newParams = new URLSearchParams(searchParams);
    if (matched) {
      newParams.set("category", matched.categoryName);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchInput("");
    setQuery("");
    setSelectedCategoryId("");
    setSearchParams({});
  };

  return (
    <main className="bg-[#F7F9FF] pt-[100px] sm:pt-[106px]">
      {/* ───────── Hero banner ───────── */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-8 sm:pt-6">
        <div className="relative overflow-hidden rounded-[32px] bg-[#0B56D9]">
          <img
            src="/images/shop-bg.webp"
            alt="Saree, sweets, filter coffee and pickles packed in a Pick O Pick box for worldwide delivery"
            className="absolute inset-0 h-full w-full object-cover object-right-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B56D9] via-[#0B56D9]/80 to-[#0B56D9]/0 sm:via-[#0B56D9]/70 lg:to-transparent" />

          <div className="relative z-10 max-w-xl px-6 pb-24 pt-10 text-white sm:px-10 sm:pb-28 sm:pt-14 lg:px-14">
            <span className="inline-block rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest">
              Pick O Pick Marketplace
            </span>
            <h1 className="mt-4 text-[clamp(1.9rem,4.5vw,3.25rem)] font-extrabold leading-[1.06] tracking-tight">
              Find the products you love from India
            </h1>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-blue-50">
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} /> Authentic Indian products
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Truck size={14} /> Combined international shipping
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Globe2 size={14} /> Delivered worldwide
              </li>
            </ul>
          </div>
        </div>

        {/* Search card overlapping the banner */}
        <div className="relative z-20 mx-auto -mt-14 max-w-4xl px-2 sm:-mt-16 sm:px-6">
          <div className="rounded-3xl border border-blue-100 bg-white p-3 shadow-[0_30px_60px_-30px_rgba(11,86,217,0.5)] sm:p-4">
            <form
              id="shop-search"
              onSubmit={handleSearch}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <label htmlFor="shop-search-input" className="sr-only">
                Search the marketplace
              </label>
              <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl bg-[#F7F9FF] px-4 transition-shadow focus-within:ring-4 focus-within:ring-[#0B56D9]/10">
                <Search className="h-5 w-5 shrink-0 text-[#0B56D9]" />
                <input
                  id="shop-search-input"
                  value={searchInput}
                  onChange={(event) =>
                    handleSearchInputChange(event.target.value)
                  }
                  placeholder="Search sarees, sweets, pooja items, groceries..."
                  className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#0A1931] outline-none placeholder:text-slate-400"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => handleSearchInputChange("")}
                    className="rounded-full p-1.5 text-slate-400 hover:bg-white hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#0B56D9] px-8 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#0849B7]"
              >
                Search
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {categories.length > 0 && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
                <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Popular:
                </span>
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat.categoryID}
                    type="button"
                    onClick={() => {
                      selectCategory(String(cat.categoryID));
                      document.querySelector("#shop-directory")?.scrollIntoView();
                    }}
                    className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:border-[#0B56D9] hover:bg-blue-50 hover:text-[#0B56D9]"
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <ShoppingDirectory
        searchQuery={query}
        categoryFilter={selectedCategoryId}
        onSelectCategory={selectCategory}
        onClearFilters={clearFilters}
      />

      <CrossLinkBanner
        eyebrow="Can’t find it here?"
        title="Paste any Indian product link — we buy it for you."
        description="Our personal shoppers can purchase from Amazon.in, Myntra, Nykaa, local boutiques and more, then ship it to your doorstep abroad."
        to="/buy-and-ship"
        cta="Start Buy & Ship"
        image="/images/nri-trust/shop-from-india.webp"
      />

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </main>
  );
}
