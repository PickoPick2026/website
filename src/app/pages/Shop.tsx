import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
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
    <main className="bg-[#F7F9FF] pt-24 sm:pt-[100px]">
      {/* ───────── Hero banner ───────── */}
      <section className="relative w-full">
        <img
          src="/images/shop-bg.png"
          alt=""
          width={2172}
          height={724}
          fetchPriority="high"
          className="block h-auto w-full"
        />
        <div className="absolute inset-0 flex items-center justify-center px-3 py-1 text-center sm:px-6">
          <div className="w-full max-w-3xl">
            <h1 className="mx-auto max-w-2xl text-[clamp(1rem,3.6vw,3rem)] font-extrabold leading-tight tracking-tight text-[#0B56D9]">
              Explore the products you love from India
            </h1>
            <form
              id="shop-search"
              onSubmit={handleSearch}
              className="mx-auto mt-2 flex h-11 w-full max-w-xl items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 text-left shadow-md backdrop-blur-sm sm:mt-5 sm:h-14 sm:gap-3 sm:rounded-2xl sm:px-5"
            >
              <label htmlFor="shop-search-input" className="sr-only">
                Search Indian products
              </label>
              <Search className="h-4 w-4 shrink-0 text-[#0B56D9] sm:h-5 sm:w-5" />
              <input
                id="shop-search-input"
                value={searchInput}
                onChange={(event) =>
                  handleSearchInputChange(event.target.value)
                }
                placeholder="Search sarees, sweets, pooja items, groceries..."
                className="h-full min-w-0 flex-1 bg-transparent text-xs font-semibold text-[#0A1931] outline-none placeholder:text-slate-400 sm:text-sm"
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
            </form>
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
