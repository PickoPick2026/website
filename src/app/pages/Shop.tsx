import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Search, X } from "lucide-react";
import { ShoppingDirectory } from "../components/ShoppingDirectory";
import { supabase } from "@/src/lib/supabase";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

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

  const clearFilters = () => {
    setSearchInput("");
    setQuery("");
    setSelectedCategoryId("");
    setSearchParams({});
  };

  return (
    <main className="bg-white pt-[68px] sm:pt-[76px]">
      <section className="relative h-[220px] overflow-hidden bg-white sm:h-[280px] lg:h-[330px]">
        <img
          src="/images/shop-bg.webp"
          alt="Pick O Pick global marketplace"
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/35 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-end px-4 pb-6 text-center sm:px-6 sm:pb-8">
          <h1 className="mb-3 text-xl font-extrabold tracking-tight text-[#0A1931] sm:text-2xl">
            Find the products you love from India
          </h1>

          {/* Search Bar */}
          <form
            id="shop-search"
            onSubmit={handleSearch}
            className="flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-blue-100 bg-white/95 p-2 shadow-lg backdrop-blur-sm sm:flex-row sm:rounded-full"
          >
            <label htmlFor="shop-search-input" className="sr-only">
              Search the marketplace
            </label>
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-4 w-4 text-[#0B56D9]" />
              <input
                id="shop-search-input"
                value={searchInput}
                onChange={(event) =>
                  handleSearchInputChange(event.target.value)
                }
                placeholder="Search products, brands, or categories..."
                className="h-10 min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => handleSearchInputChange("")}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0B56D9] px-6 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7] sm:rounded-full cursor-pointer"
            >
              Search <ArrowRight className="h-4 w-4" />
            </button>
          </form>

        </div>
      </section>

      <ShoppingDirectory
        searchQuery={query}
        categoryFilter={selectedCategoryId}
        onSelectCategory={(id) => {
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
        }}
        onClearFilters={clearFilters}
      />
    </main>
  );
}
