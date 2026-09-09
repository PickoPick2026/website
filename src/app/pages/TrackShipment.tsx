import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, Package, Plane, Search, ShieldCheck } from 'lucide-react';

type TrackingEvent = {
  event_description?: string;
  event_location?: string;
  event_at?: string;
};

type Shipment = {
  id: string;
  status: string;
  from: string;
  to: string;
  arrivalDate?: string;
  consigneeName?: string;
  shipperName?: string;
  shipperCity?: string;
  consigneeCity?: string;
  bookingDate?: string;
  weight?: string | number;
  originHub?: string;
  progress?: number;
  events?: TrackingEvent[];
};

const progressForStatus = (shipment: Shipment) => {
  if (/delivered/i.test(shipment.status)) return 100;
  return shipment.progress || (shipment.events?.length ? 70 : 30);
};

export default function TrackShipmentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cargoId, setCargoId] = useState(searchParams.get('cargoId') || '');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const loadedCargoId = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trackShipment = async (id: string) => {
    const value = id.trim();
    if (!value) {
      inputRef.current?.focus();
      return;
    }

    setIsSearching(true);
    setError('');
    setShipment(null);
    try {
      const response = await fetch(`/api/shipments/${encodeURIComponent(value)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Shipment not found');
      setShipment(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to track this shipment right now.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const queryCargoId = searchParams.get('cargoId')?.trim() || '';
    setCargoId(queryCargoId);
    if (queryCargoId && loadedCargoId.current !== queryCargoId) {
      loadedCargoId.current = queryCargoId;
      void trackShipment(queryCargoId);
    }
  }, [searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = cargoId.trim();
    if (!value) {
      inputRef.current?.focus();
      return;
    }
    loadedCargoId.current = value;
    setSearchParams({ cargoId: value });
    void trackShipment(value);
  };

  const progress = shipment ? progressForStatus(shipment) : 0;
  const isDelivered = shipment ? /delivered/i.test(shipment.status) : false;

  return (
    <main className="min-h-screen bg-[#F7F9FF] pt-16 sm:pt-[68px]">
      <section className="relative isolate overflow-hidden bg-[#0B56D9] px-4 py-14 sm:px-8 sm:py-20">
        <img src="/images/nri-hero-logistics-v2.webp" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[#0B56D9]/30" />
        <div className="mx-auto max-w-4xl text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] backdrop-blur-sm"><Plane className="h-4 w-4" /> Global shipment tracking</span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">Track your shipment</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-blue-50 sm:text-base">Enter your Pick O Pick cargo ID to see its latest route, shipment status and delivery events.</p>
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/35 bg-white p-2 shadow-xl sm:flex-row sm:rounded-full">
            <label className="sr-only" htmlFor="tracking-cargo-id">Cargo ID</label>
            <div className="flex min-w-0 flex-1 items-center gap-2 px-3 text-[#0A1931]"><Search className="h-5 w-5 shrink-0 text-[#0B56D9]" /><input ref={inputRef} id="tracking-cargo-id" value={cargoId} onChange={(event) => setCargoId(event.target.value)} placeholder="Enter Cargo ID" className="h-11 min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400" /></div>
            <button type="submit" disabled={isSearching} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B56D9] px-6 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7] disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-full">{isSearching ? 'Tracking...' : 'Track now'} <ArrowRight className="h-4 w-4" /></button>
          </form>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0B56D9] transition-colors hover:text-[#0849B7]"><ArrowLeft className="h-4 w-4" /> Back to home</Link>

          {!shipment && !error && !isSearching && <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center sm:p-12"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0B56D9]"><Package className="h-7 w-7" /></div><h2 className="mt-5 text-2xl font-extrabold tracking-tight text-[#0A1931]">Your shipment details will appear here</h2><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">Use the cargo ID on your Pick O Pick receipt or shipment confirmation to get started.</p></div>}

          {isSearching && <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center"><div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-[#0B56D9]" /><p className="mt-4 text-sm font-bold text-[#0A1931]">Finding your latest shipment update…</p></div>}

          {error && !isSearching && <div className="mt-6 rounded-3xl border border-red-100 bg-white p-8 text-center sm:p-12"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><CircleAlert className="h-7 w-7" /></div><h2 className="mt-5 text-2xl font-extrabold tracking-tight text-[#0A1931]">We could not find that shipment</h2><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">{error}. Check the cargo ID and try again, or contact our team for help.</p><Link to="/contact" className="mt-6 inline-flex rounded-full bg-[#0B56D9] px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-white">Contact support</Link></div>}

          {shipment && !isSearching && <div className="mt-6 space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="flex flex-col gap-5 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0B56D9]">Cargo ID · {shipment.id}</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A1931]">{shipment.status || 'Shipment update'}</h2><p className="mt-1 text-sm text-slate-500">{shipment.shipperName || 'Pick O Pick'} to {shipment.consigneeName || 'your destination'}</p></div><span className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold ${isDelivered ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-[#0B56D9]'}`}><CheckCircle2 className="h-4 w-4" /> {isDelivered ? 'Delivered' : 'In transit'}</span></div>
              <div className="p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr]"><div><p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">From</p><p className="mt-1 text-lg font-extrabold text-[#0A1931]">{shipment.from || 'India'}</p><p className="mt-1 text-sm text-slate-500">{shipment.shipperCity || shipment.originHub || 'Origin hub'}</p></div><div className="hidden items-center text-[#0B56D9] sm:flex"><ArrowRight className="h-6 w-6" /></div><div className="sm:text-right"><p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">To</p><p className="mt-1 text-lg font-extrabold text-[#0A1931]">{shipment.to || 'Destination'}</p><p className="mt-1 text-sm text-slate-500">{shipment.consigneeCity || 'Destination hub'}</p></div></div><div className="mt-7"><div className="flex items-center justify-between text-xs font-bold text-slate-500"><span>Shipment progress</span><span className="text-[#0B56D9]">{progress}%</span></div><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-blue-50"><div className="h-full rounded-full bg-[#0B56D9] transition-all duration-700" style={{ width: `${progress}%` }} /></div></div></div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]"><section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"><h3 className="text-xl font-extrabold tracking-tight text-[#0A1931]">Shipment timeline</h3><div className="mt-7 space-y-6">{shipment.events?.length ? shipment.events.map((event, index) => <div key={`${event.event_at}-${index}`} className="relative flex gap-4"><div className="flex flex-col items-center"><div className={`mt-0.5 h-3 w-3 rounded-full ${index === 0 ? 'bg-[#0B56D9] ring-4 ring-blue-100' : 'bg-slate-300'}`} />{index < (shipment.events?.length || 0) - 1 && <div className="mt-2 h-full min-h-8 w-px bg-slate-200" />}</div><div className="pb-2"><p className="text-sm font-extrabold text-[#0A1931]">{event.event_description || 'Shipment update'}</p><p className="mt-1 text-xs text-slate-500">{[event.event_location, event.event_at].filter(Boolean).join(' · ')}</p></div></div>) : <p className="text-sm text-slate-500">The latest status is available above. More delivery events will appear as the shipment moves.</p>}</div></section><aside className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"><h3 className="text-base font-extrabold text-[#0A1931]">Shipment summary</h3><dl className="mt-6 space-y-5 text-sm"><div><dt className="text-xs font-bold text-slate-400">Booked</dt><dd className="mt-1 font-semibold text-[#0A1931]">{shipment.bookingDate || '—'}</dd></div><div><dt className="text-xs font-bold text-slate-400">Delivery update</dt><dd className="mt-1 font-semibold text-[#0A1931]">{shipment.arrivalDate || 'In progress'}</dd></div><div><dt className="text-xs font-bold text-slate-400">Chargeable weight</dt><dd className="mt-1 font-semibold text-[#0A1931]">{shipment.weight ? `${shipment.weight} kg` : '—'}</dd></div></dl><div className="mt-8 rounded-2xl bg-blue-50 p-4"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0B56D9]" /><p className="text-xs leading-relaxed text-slate-600">Need help with this shipment? Our support team can guide you through its latest update.</p></div><Link to="/contact" className="mt-4 inline-flex text-xs font-extrabold text-[#0B56D9]">Contact support <ArrowRight className="ml-1 h-4 w-4" /></Link></div></aside></div>
          </div>}
        </div>
      </section>
    </main>
  );
}
