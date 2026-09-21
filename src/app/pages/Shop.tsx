import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Search, Sparkles, Filter, X } from "lucide-react";
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

  const handleQuickCategory = (category: any) => {
    const catId = String(category.categoryID);
    if (selectedCategoryId === catId) {
      // Toggle off
      clearCategoryFilter();
      return;
    }
    setSelectedCategoryId(catId);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", category.categoryName);
    setSearchParams(newParams);
    document
      .querySelector("#shop-directory")
      ?.scrollIntoView();
  };

  const clearCategoryFilter = () => {
    setSelectedCategoryId("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("category");
    setSearchParams(newParams);
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

  const activeCategoryObj = categories.find(
    (c) => String(c.categoryID) === String(selectedCategoryId),
  );

  return (
    <main className="bg-white pt-[68px] sm:pt-[76px]">
      <section className="relative overflow-hidden bg-white">
        <img
          src="/images/shop-bg.webp"
          alt="Pick O Pick global marketplace"
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0B56D9]">
            <Sparkles className="h-3 w-3" />
            Pick O Pick Marketplace
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#073E96] sm:text-3xl">
            Shop From India Online
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-600">
            Browse authentic Indian products by category. We verify, pack, and
            express ship directly to your international doorstep.
          </p>

          {/* Search Bar */}
          <form
            id="shop-search"
            onSubmit={handleSearch}
            className="mt-4 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-blue-100 bg-white p-2 sm:flex-row sm:rounded-full shadow-xs"
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

          {/* Category Chips Bar */}
          <div className="mt-4 flex max-w-4xl flex-wrap justify-center items-center gap-2">
            <button
              type="button"
              onClick={clearCategoryFilter}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                !selectedCategoryId
                  ? "bg-[#0B56D9] text-white shadow-xs"
                  : "border border-blue-100 bg-white text-[#0B56D9] hover:bg-blue-50"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => {
              const isSelected =
                String(category.categoryID) === String(selectedCategoryId);
              return (
                <button
                  key={category.categoryID}
                  type="button"
                  onClick={() => handleQuickCategory(category)}
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#0B56D9] text-white shadow-xs ring-2 ring-[#0B56D9]/30"
                      : "border border-blue-100 bg-white text-[#0B56D9] hover:bg-blue-50"
                  }`}
                >
                  {category.categoryName}
                </button>
              );
            })}
          </div>

          {/* Active Filter Indicator */}
          {activeCategoryObj && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs text-[#0B56D9] font-bold">
              <Filter size={12} />
              <span>Filtered by: {activeCategoryObj.categoryName}</span>
              <button
                type="button"
                onClick={clearCategoryFilter}
                className="hover:text-red-500 transition-colors ml-1 p-0.5"
                title="Remove filter"
              >
                <X size={12} />
              </button>
            </div>
          )}
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
