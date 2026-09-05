import { FormEvent, useRef, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

export function Hero() {
  const [cargoId, setCargoId] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTrack = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trackingId = cargoId.trim();
    if (!trackingId) {
      inputRef.current?.focus();
      return;
    }

    window.dispatchEvent(new CustomEvent('pickopick:prefill-tracking', { detail: trackingId }));
    document.querySelector('#track-shipment')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative mt-[68px] min-h-[420px] overflow-hidden bg-white scroll-mt-24 sm:mt-[76px] sm:min-h-[90vh]">
      <img src="/images/hero-global-delivery-v5.webp" alt="Pick O Pick connecting India to the world by air cargo" className="absolute inset-0 h-full w-full object-cover object-bottom" />

      <div className="relative z-10 mx-auto flex min-h-[420px] max-w-6xl flex-col items-center px-5 pt-14 text-center sm:h-full sm:min-h-[90vh] sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0B56D9]">India to the world</p>
        <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[#073E96] sm:text-5xl sm:whitespace-nowrap lg:text-6xl">To move from your hometown.</h1>
        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-600 sm:text-lg">Pick O Pick delivers across India and the world.</p>

        <form onSubmit={handleTrack} className="mt-6 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-blue-100 bg-white p-2 sm:flex-row sm:rounded-full">
          <label className="sr-only" htmlFor="hero-cargo-id">Cargo ID</label>
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
            <Search className="h-4 w-4 shrink-0 text-[#0B56D9]" />
            <input ref={inputRef} id="hero-cargo-id" value={cargoId} onChange={(event) => setCargoId(event.target.value)} placeholder="Enter Cargo ID" className="h-11 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#0A1931] outline-none placeholder:text-slate-400" />
          </div>
          <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B56D9] px-6 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7] sm:rounded-full">Track now <ArrowRight className="h-4 w-4" /></button>
        </form>
      </div>
    </section>
  );
}
