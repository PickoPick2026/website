import { FormEvent, useState } from 'react';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { ShoppingDirectory } from '../components/ShoppingDirectory';

const quickCategories = ['Fashion', 'Groceries', 'Home & Living', 'Gifts', 'Beauty', 'Electronics'];

export default function ShopPage() {
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(searchInput.trim());
    document.querySelector('#shop-directory')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickCategory = (category: string) => {
    setSearchInput(category);
    setQuery(category);
    document.querySelector('#shop-directory')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="bg-white pt-[68px] sm:pt-[76px]">
      <section className="relative overflow-hidden bg-white">
        <img src="/images/shop-bg.png" alt="Pick O Pick global marketplace" className="absolute inset-0 h-full w-full object-cover object-bottom" />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0B56D9]">
            <Sparkles className="h-3 w-3" />Pick O Pick marketplace
          </span>
          <form id="shop-search" onSubmit={handleSearch} className="mt-4 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-blue-100 bg-white p-2 sm:flex-row sm:rounded-full">
            <label htmlFor="shop-search-input" className="sr-only">Search the marketplace</label>
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-4 w-4 text-[#0B56D9]" />
              <input id="shop-search-input" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search products, brands, or categories" className="h-10 min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400" />
            </div>
            <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0B56D9] px-6 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7] sm:rounded-full">
              Search <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-4 flex max-w-3xl flex-wrap justify-center gap-2">
            {quickCategories.map((category) => (
              <button key={category} onClick={() => handleQuickCategory(category)} className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[11px] font-bold text-[#0B56D9] transition-colors hover:bg-blue-50">{category}</button>
            ))}
          </div>
        </div>
      </section>

      <ShoppingDirectory searchQuery={query} />
    </main>
  );
}
