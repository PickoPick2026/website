import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Minus, PackageCheck, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';

interface CartItem { id: string; productId: string | number | null; name: string; quantity: number; image: string; }
const getCustomerId = () => { const user = JSON.parse(localStorage.getItem('user') || '{}'); return user?.customerID ?? user?.customerId ?? user?.id; };

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const fetchCart = async () => {
    const customerId = getCustomerId();
    if (!customerId) return setCartItems([]);
    const { data, error } = await supabase.from('cart').select('*').eq('customer_id', customerId);
    if (error) return toast.error('Could not load your selected products.');
    setCartItems((data || []).map((item) => ({ id: String(item.id), productId: item.product_id ?? null, name: item.name, quantity: Number(item.quantity) || 1, image: item.image || '' })));
  };
  useEffect(() => { void fetchCart(); }, []);

  const removeItem = async (id: string) => {
    const { error } = await supabase.from('cart').delete().eq('id', id);
    if (error) return toast.error('Could not remove this item.');
    await fetchCart(); window.dispatchEvent(new Event('cart-updated')); toast.success('Item removed.');
  };
  const updateQuantity = async (id: string, delta: number) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);
    if (!item) return;
    const { error } = await supabase.from('cart').update({ quantity: Math.max(1, item.quantity + delta) }).eq('id', id);
    if (error) return toast.error('Could not update the quantity.');
    await fetchCart(); window.dispatchEvent(new Event('cart-updated'));
  };
  const requestQuote = async () => {
    const customerId = getCustomerId();
    if (!customerId) return toast.error('Please log in to request a quote.');
    if (!cartItems.length || isRequesting) return;
    setIsRequesting(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      const orderCode = `POP-QUOTE-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;
      const { data: quote, error: quoteError } = await supabase.from('orders').insert({ order_code: orderCode, customer_id: String(customerId), status: 'QUOTE_REQUESTED', payment_status: 'PENDING', payment_method: 'QUOTE', subtotal: 0, shipping: 0, tax: 0, total: 0, customer_name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null, customer_phone: user.phoneNumber || null, customer_email: user.emailID || null }).select('id').single();
      if (quoteError || !quote) throw quoteError || new Error('Quote request was not created.');
      const { error: itemsError } = await supabase.from('order_items').insert(cartItems.map((item) => ({ order_id: quote.id, product_id: item.productId != null ? String(item.productId) : null, name: item.name, price: 0, quantity: item.quantity, image: item.image || null })));
      if (itemsError) { await supabase.from('orders').delete().eq('id', quote.id); throw itemsError; }
      const { error: clearError } = await supabase.from('cart').delete().eq('customer_id', customerId);
      if (clearError) throw clearError;
      setCartItems([]); setIsRequested(true); window.dispatchEvent(new Event('cart-updated')); toast.success('Your quote request has been sent.');
    } catch (error) { console.error('QUOTE REQUEST ERROR:', error); toast.error('Could not send your quote request. Please try again.'); }
    finally { setIsRequesting(false); }
  };

  if (isRequested) return <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6"><div className="rounded-2xl border border-slate-200 bg-white p-8 text-center"><div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600"><CheckCircle2 className="size-7" /></div><h1 className="text-2xl font-extrabold tracking-tight text-[#0A1931]">Thank you for shopping with Pick O Pick.</h1><p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">Our team will contact you shortly with the best quote for the products you selected.</p><Link to="/shop" className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0B56D9] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0849B7]"><ArrowLeft className="size-5" />Continue shopping</Link></div></div>;
  if (!cartItems.length) return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="text-center"><ShoppingBag className="mx-auto mb-6 size-24 text-slate-300" /><h1 className="mb-4 text-2xl font-extrabold tracking-tight text-[#0A1931]">Your selected products list is empty</h1><p className="mb-8 text-slate-500">Add products from the shop, and we will prepare a personalised quote.</p><Link to="/shop" className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0B56D9] px-6 py-3 text-white transition-colors hover:bg-[#0849B7]"><ArrowLeft className="size-5" />Browse products</Link></div></div>;
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><Link to="/shop" className="mb-6 inline-flex cursor-pointer items-center gap-2 text-slate-600 transition-colors hover:text-[#0A1931]"><ArrowLeft className="size-5" />Continue shopping</Link><h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[#0A1931]">Your selected products</h1><p className="mb-8 text-sm text-slate-500">Prices are confirmed by our team after reviewing your complete request.</p><div className="grid items-start gap-8 lg:grid-cols-3"><div className="space-y-4 lg:col-span-2">{cartItems.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex gap-4"><img src={item.image || '/no-image.png'} alt={item.name} className="size-24 rounded-xl object-cover sm:size-32" /><div className="min-w-0 flex-1"><h2 className="mb-4 text-lg font-semibold text-[#0A1931]">{item.name}</h2><div className="flex flex-wrap items-center gap-4"><div className="flex items-center gap-2"><button type="button" onClick={() => void updateQuantity(item.id, -1)} className="cursor-pointer rounded-xl border border-slate-300 p-2 transition-colors hover:bg-slate-50" aria-label={`Reduce ${item.name} quantity`}><Minus className="size-4" /></button><span className="w-12 text-center font-semibold text-[#0A1931]">{item.quantity}</span><button type="button" onClick={() => void updateQuantity(item.id, 1)} className="cursor-pointer rounded-xl border border-slate-300 p-2 transition-colors hover:bg-slate-50" aria-label={`Increase ${item.name} quantity`}><Plus className="size-4" /></button></div><button type="button" onClick={() => void removeItem(item.id)} className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-red-600 transition-colors hover:bg-red-50"><Trash2 className="size-4" /><span className="hidden sm:inline">Remove</span></button></div></div></div></article>)}</div><aside className="lg:col-span-1"><div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6"><h2 className="mb-3 text-xl font-extrabold tracking-tight text-[#0A1931]">Request a quote</h2><p className="mb-6 text-sm leading-relaxed text-slate-600">You have selected <strong className="text-[#0A1931]">{totalItems} {totalItems === 1 ? 'item' : 'items'}</strong>. Send this list to our team and receive the best quote.</p><button type="button" onClick={() => void requestQuote()} disabled={isRequesting} className="w-full cursor-pointer rounded-xl bg-[#0B56D9] py-3 font-semibold text-white transition-colors hover:bg-[#0849B7] disabled:cursor-not-allowed disabled:opacity-60">{isRequesting ? 'Sending request…' : 'Request quote'}</button><div className="mt-5 flex gap-2 text-sm text-slate-600"><PackageCheck className="mt-0.5 size-5 shrink-0 text-green-600" /><span>Our team will verify availability, delivery and the final price with you.</span></div></div></aside></div></div>;
}
