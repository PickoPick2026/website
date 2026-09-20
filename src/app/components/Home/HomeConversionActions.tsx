import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, PackageCheck, ShoppingBag, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

type Offer = 'buy' | 'send' | 'nri';

const offerDetails: Record<Offer, { eyebrow: string; title: string; body: string; action: string }> = {
  buy: { eyebrow: 'Buy & Ship', title: 'We shop in India. You receive abroad.', body: 'Share a product link or wishlist. Our team purchases, checks and securely ships it to your doorstep.', action: 'Start Buy & Ship' },
  send: { eyebrow: 'Order & Send', title: 'Send purchases and parcels up to 62 kg.', body: 'Already bought your items? Arrange collection, consolidation and international delivery in one place.', action: 'Plan Order & Send' },
  nri: { eyebrow: 'NRI Services', title: 'Your India shopping concierge.', body: 'Speak to an expert about what you can send, sourcing help and the best way to combine your shipment.', action: 'Book your consultation' },
};

const openRegister = () => window.dispatchEvent(new Event('pickopick:open-register'));
const openConsultation = () => window.dispatchEvent(new Event('pickopick:open-consultation'));

export function HomeConversionActions() {
  const [offer, setOffer] = useState<Offer | null>(null);

  const start = () => {
    if (offer === 'nri') openConsultation(); else openRegister();
    setOffer(null);
  };

  return <>
    <section aria-label="Pick O Pick services" className="relative z-20 -mt-5 px-4 sm:-mt-7">
      <div className="mx-auto grid max-w-5xl gap-2 rounded-2xl border border-blue-100 bg-white p-2 sm:grid-cols-[1fr_1fr_auto]">
        <button type="button" onClick={() => setOffer('buy')} className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-blue-50"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0B56D9]"><ShoppingBag className="h-4 w-4" /></span><span><span className="block text-xs font-extrabold text-[#0A1931]">Buy &amp; Ship</span><span className="mt-0.5 block text-[10px] text-slate-500">We buy from India for you</span></span><ArrowRight className="ml-auto h-4 w-4 text-[#0B56D9]" /></button>
        <button type="button" onClick={() => setOffer('send')} className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-blue-50"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0B56D9]"><PackageCheck className="h-4 w-4" /></span><span><span className="block text-xs font-extrabold text-[#0A1931]">Order &amp; Send</span><span className="mt-0.5 block text-[10px] text-slate-500">Ship parcels up to 62 kg</span></span><ArrowRight className="ml-auto h-4 w-4 text-[#0B56D9]" /></button>
        <div className="flex items-center justify-center gap-2 rounded-xl bg-[#0B56D9] px-3 py-2 text-white"><span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide"><Sparkles className="h-3.5 w-3.5" /> Exclusive Picks</span></div>
      </div>
    </section>

    <AnimatePresence>
      {offer && <><motion.button type="button" aria-label="Close service details" onClick={() => setOffer(null)} className="fixed inset-0 z-[105] cursor-default bg-slate-950/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /><motion.section role="dialog" aria-modal="true" initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="fixed left-1/2 top-1/2 z-[106] w-[min(92vw,500px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-blue-100 bg-white p-6 sm:p-8"><button type="button" onClick={() => setOffer(null)} className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X className="h-5 w-5" /></button><p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0B56D9]">{offerDetails[offer].eyebrow}</p><h2 className="mt-3 max-w-sm text-2xl font-extrabold tracking-tight text-[#0A1931]">{offerDetails[offer].title}</h2><p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">{offerDetails[offer].body}</p>{offer === 'buy' && <p className="mt-5 text-xs font-semibold text-[#0B56D9]">Explore Buy &amp; Ship — please see the video before you start.</p>}<div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={start} className="rounded-full bg-[#0B56D9] px-5 py-3 text-xs font-extrabold text-white hover:bg-[#0849B7]">{offerDetails[offer].action}</button><Link to="/contact" onClick={() => setOffer(null)} className="rounded-full border border-[#0B56D9] px-5 py-3 text-center text-xs font-extrabold text-[#0B56D9] hover:bg-blue-50">For more details, Contact Us</Link></div></motion.section></>}
    </AnimatePresence>
  </>;
}
