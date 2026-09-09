import { FormEvent, useRef, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroMobile() {
  const [cargoId, setCargoId] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleTrack = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trackingId = cargoId.trim();
    if (!trackingId) {
      inputRef.current?.focus();
      return;
    }

    navigate(`/track-shipment?cargoId=${encodeURIComponent(trackingId)}`);
  };

  return (
    <section id="home" className="relative mt-[60px] min-h-[680px] overflow-hidden bg-white scroll-mt-24">
      <img src="/images/hero-global-delivery-mobile-v1.webp" alt="Pick O Pick connecting India to the world by air cargo" className="absolute inset-0 h-full w-full object-cover object-bottom" />

      <div className="relative z-10 mx-auto flex min-h-[680px] w-full max-w-md flex-col items-center px-5 pb-6 pt-12 text-center">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#0B56D9]">India to the world</p>
        <h1 className="mt-3 max-w-sm text-3xl font-extrabold leading-tight tracking-[-0.03em] text-[#073E96]">Home From Your Hometown.</h1>
        <p className="mt-3 max-w-xs text-lg font-semibold leading-relaxed text-[#0B56D9]">India Has It. We'll Deliver It.</p>

        <form onSubmit={handleTrack} className="mt-5 flex w-full flex-col gap-2 rounded-2xl border border-blue-100 bg-white p-2">
          <label className="sr-only" htmlFor="hero-mobile-cargo-id">Cargo ID</label>
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
            <Search className="h-4 w-4 shrink-0 text-[#0B56D9]" />
            <input ref={inputRef} id="hero-mobile-cargo-id" value={cargoId} onChange={(event) => setCargoId(event.target.value)} placeholder="Enter Cargo ID" className="h-11 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#0A1931] outline-none placeholder:text-slate-400" />
          </div>
          <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0B56D9] px-6 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7]">
            Track now <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
