import { FormEvent, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroMobile() {
  const [cargoId, setCargoId] = useState("");
  const navigate = useNavigate();

  const handleTrack = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trackingId = cargoId.trim();
    if (!trackingId) {
      navigate("/track-shipment");
      return;
    }

    navigate(`/track-shipment?cargoId=${encodeURIComponent(trackingId)}`);
  };

  return (
    <section
      id="home"
      className="relative mt-[60px] overflow-hidden bg-white scroll-mt-24"
    >
      <img
        src="/images/worldwide-shipping-and-south-indian-sweets-banner.webp"
        alt="Pick O Pick worldwide shipping with international landmarks and South Indian sweets"
        className="block h-auto w-full"
      />

      <div className="bg-white px-4 py-4">
        <form
          onSubmit={handleTrack}
          className="mx-auto flex w-full max-w-md flex-col gap-2 rounded-2xl border border-blue-100 bg-white p-2 shadow-sm"
        >
          <label className="sr-only" htmlFor="hero-mobile-cargo-id">
            Cargo ID
          </label>
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
            <Search className="h-4 w-4 shrink-0 text-[#0B56D9]" />
            <input
              id="hero-mobile-cargo-id"
              value={cargoId}
              onChange={(event) => setCargoId(event.target.value)}
              placeholder="Enter Cargo ID"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#0A1931] outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0B56D9] px-6 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7]"
          >
            Track now <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
