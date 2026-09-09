"use client";

import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, ChevronDown, PackagePlus, ShoppingBag, Sparkles, X } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';

interface ShoppingDirectoryProps {
  searchQuery?: string;
  categoryFilter?: string;
}

const getImageUrl = (imageField: unknown) => {
  try {
    if (!imageField) return '';
    const parsed = typeof imageField === 'string' ? JSON.parse(imageField) : imageField;
    const url = Array.isArray(parsed) ? parsed[0] : typeof parsed === 'string' ? parsed : '';
    return url?.startsWith('blob:') ? '' : url || '';
  } catch {
    return typeof imageField === 'string' && !imageField.startsWith('blob:') ? imageField : '';
  }
};

export function ShoppingDirectory({ searchQuery = '', categoryFilter = '' }: ShoppingDirectoryProps) {
  const [activeTab, setActiveTab] = useState<'directory' | 'exclusive'>('directory');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [exclusiveList, setExclusiveList] = useState('');
  const [exclusiveQuantity, setExclusiveQuantity] = useState('1');
  const [exclusiveError, setExclusiveError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: catData }, { data: productData }] = await Promise.all([
        supabase.from('category').select('*'),
        supabase.from('productTable').select('*'),
      ]);
      setCategories(catData || []);
      setProducts(productData || []);
    };
    void fetchData();
  }, []);

  useEffect(() => {
    const syncTabFromHash = () => setActiveTab(window.location.hash === '#exclusive' ? 'exclusive' : 'directory');
    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      setActiveTab('directory');
      setSelectedCategory(categoryFilter);
    }
  }, [categoryFilter]);

  const exclusiveCategory = categories.find((category) => category.categoryName === 'Exclusive');
  const regularCategories = categories.filter((category) => category.categoryName !== 'Exclusive');
  const matchesSearch = (name: string | undefined) => !searchQuery || (name || '').toLowerCase().includes(searchQuery.toLowerCase());
  const directoryProducts = products.filter((product) => product.categoryID !== exclusiveCategory?.categoryID && (!selectedCategory || String(product.categoryID) === String(selectedCategory)) && matchesSearch(product.productName));

  const addToCart = async (product: any) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const customerId = user?.customerID ?? user?.customerId ?? user?.id;
    if (!customerId) {
      setIsLoginOpen(true);
      return;
    }

    setIsAdding(String(product.productID));
    const { error } = await supabase.from('cart').insert([{
      customer_id: customerId,
      product_id: product.productID,
      name: product.productName,
      price: Number(product.price ?? product.price_value ?? 0) || 0,
      image: getImageUrl(product.imageURL),
      quantity: 1,
    }]);
    setIsAdding(null);
    if (error) {
      console.error('Unable to add directory item to cart:', error);
      toast.error('Could not add this item to your cart. Please try again.');
      return;
    }
    window.dispatchEvent(new Event('cart-updated'));
    toast.success(`${product.productName} added to your cart.`);
  };

  const submitExclusiveRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!exclusiveList.trim()) {
      setExclusiveError('Please share the items you would like us to source.');
      return;
    }
    setExclusiveError('');
    setExclusiveList('');
    setExclusiveQuantity('1');
    setIsThankYouOpen(true);
  };

  return (
    <section id="shop-directory" className="scroll-mt-24 border-b border-slate-200 bg-[#F7F9FF] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white p-1">
            <button type="button" onClick={() => setActiveTab('directory')} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'directory' ? 'bg-[#0B56D9] text-white shadow-md shadow-[#0B56D9]/20' : 'text-slate-500 hover:text-[#0A1931]'}`}><ShoppingBag size={14} /> Directory</button>
            <button type="button" onClick={() => setActiveTab('exclusive')} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'exclusive' ? 'bg-[#0B56D9] text-white shadow-md shadow-[#0B56D9]/20' : 'text-slate-500 hover:text-[#0A1931]'}`}><Sparkles size={14} /> Exclusive</button>
          </div>
          {activeTab === 'directory' && <div className="flex items-center gap-3"><div className="relative"><select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="w-full cursor-pointer appearance-none rounded-full border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-xs font-bold text-[#0A1931] focus:outline-none focus:ring-2 focus:ring-[#0B56D9]"><option value="">All Categories</option>{regularCategories.map((category) => <option key={category.categoryID} value={category.categoryID}>{category.categoryName}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /></div><span className="whitespace-nowrap rounded-full border border-slate-300 bg-slate-200 px-3.5 py-2 text-[11px] font-bold text-[#0A1931]">{directoryProducts.length} items</span></div>}
        </div>

        {searchQuery && activeTab === 'directory' && <p className="mb-5 text-xs font-semibold text-slate-600">Showing results for <span className="text-[#0B56D9]">“{searchQuery}”</span></p>}

        {activeTab === 'directory' ? <>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {directoryProducts.map((product) => <motion.article key={product.productID} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="aspect-square w-full overflow-hidden bg-slate-100"><img src={getImageUrl(product.imageURL) || '/no-image.png'} alt={product.productName} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" /></div>
              <div className="p-3.5 sm:p-4"><p className="min-h-[2.5rem] text-sm font-bold leading-snug text-[#0A1931] line-clamp-2">{product.productName}</p><button type="button" disabled={isAdding === String(product.productID)} onClick={() => void addToCart(product)} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0B56D9] to-[#2877ED] px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-white transition-colors hover:from-[#0849B7] hover:to-[#0B56D9] disabled:opacity-60"><PackagePlus className="h-3.5 w-3.5" /> {isAdding === String(product.productID) ? 'Adding…' : 'Add to cart'}</button></div>
            </motion.article>)}
          </div>
          {directoryProducts.length === 0 && <div className="py-16 text-center"><p className="text-sm font-bold text-[#0A1931]">No products found</p><p className="mt-1 text-xs text-slate-500">Try selecting a different category or search term.</p></div>}
        </> : <div className="mx-auto max-w-3xl rounded-3xl border border-blue-100 bg-white p-6 sm:p-9"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0B56D9]"><Sparkles className="h-5 w-5" /></div><h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0A1931]">Exclusive Picks</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">Can’t find what you need? Tell us what you are looking for and our team will source it from India for you.</p><form onSubmit={submitExclusiveRequest} className="mt-7 space-y-5"><label className="block text-sm font-extrabold text-[#0A1931]">Share your list below :<textarea required value={exclusiveList} onChange={(event) => setExclusiveList(event.target.value)} rows={5} placeholder="Example: 2 silk sarees, brass pooja lamps, regional snacks…" className="mt-2 block w-full resize-none rounded-2xl border border-slate-300 p-4 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-[#0B56D9] focus:ring-4 focus:ring-blue-50" /></label><label className="block max-w-xs text-sm font-extrabold text-[#0A1931]">Quantity<input required min="1" type="number" value={exclusiveQuantity} onChange={(event) => setExclusiveQuantity(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium outline-none focus:border-[#0B56D9] focus:ring-4 focus:ring-blue-50" /></label>{exclusiveError && <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{exclusiveError}</p>}<button type="submit" className="rounded-full bg-[#0B56D9] px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7]">Submit your list</button></form></div>}
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AnimatePresence>{isThankYouOpen && <><motion.button type="button" aria-label="Close confirmation" onClick={() => setIsThankYouOpen(false)} className="fixed inset-0 z-[105] bg-slate-950/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /><motion.section role="dialog" aria-modal="true" aria-labelledby="shopping-confirmation-title" initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="fixed left-1/2 top-1/2 z-[106] w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-9"><button type="button" onClick={() => setIsThankYouOpen(false)} className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X className="h-5 w-5" /></button><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 className="h-7 w-7" /></div><h2 id="shopping-confirmation-title" className="mt-5 text-2xl font-extrabold tracking-tight text-[#0A1931]">Thank you for shopping in Pick O Pick.</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">Our team will contact you shortly with the best quote.</p><button type="button" onClick={() => setIsThankYouOpen(false)} className="mt-7 rounded-full bg-[#0B56D9] px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-white">Done</button></motion.section></>}</AnimatePresence>
    </section>
  );
}
