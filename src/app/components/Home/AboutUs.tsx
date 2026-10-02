import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  X,
  CheckCircle2,
  Quote,
} from "lucide-react";

const services = [
  "Product sourcing from India",
  "Personal shopping assistance",
  "International parcel shipping",
  "Secure packaging & parcel consolidation",
  "Worldwide delivery support",
  "Export assistance for businesses",
  "Shipment tracking & customer support",
];

const challenges = [
  "Payment issues",
  "Shipping limitations",
  "Communication barriers",
  "Unreliable delivery",
];

export function AboutUs() {
  return (
    <section
      id="about"
      className="relative py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/80 overflow-hidden scroll-mt-24"
    >
      {/* Faint longitude lines — a nod to "India to the World" */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] text-[#0B56D9]/[0.07]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      >
        <circle cx="100" cy="100" r="98" />
        <ellipse cx="100" cy="100" rx="70" ry="98" />
        <ellipse cx="100" cy="100" rx="38" ry="98" />
        <line x1="100" y1="2" x2="100" y2="198" />
        <ellipse cx="100" cy="100" rx="98" ry="34" />
        <line x1="2" y1="100" x2="198" y2="100" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="mb-12 sm:mb-16 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
              <Sparkles size={12} className="text-[#0B56D9]" />
              About Pick O Pick
            </span>
            <h2 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0A1931] leading-[1.02]">
              Connecting India
              <br />
              to the{" "}
              <span className="relative inline-block text-[#0B56D9]">
                World
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full text-[#0B56D9]/30"
                >
                  <path
                    d="M2 9 C 50 2, 120 2, 198 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h2>
          </div>
          <p className="lg:col-span-5 text-sm sm:text-base leading-relaxed text-slate-600 lg:border-l-2 lg:border-[#0B56D9] lg:pl-6">
            Helping customers worldwide shop products from India and deliver
            them safely to their doorstep through one reliable platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* ───────── Our Story: a postcard from Chennai ───────── */}
          <div className="lg:col-span-7 relative bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-10 flex flex-col">
            {/* Postmark */}
            <div
              aria-hidden="true"
              className="absolute right-6 top-6 sm:right-8 sm:top-8 flex h-24 w-24 rotate-12 flex-col items-center justify-center rounded-full border-2 border-dashed border-[#0B56D9]/40 text-center"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#0B56D9]/70">
                Posted from
              </span>
              <span className="text-sm font-black text-[#0B56D9]">Chennai</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#0B56D9]/70">
                India
              </span>
            </div>

            <span className="self-start text-[11px] font-black uppercase tracking-widest text-[#0B56D9] px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
              Our Story
            </span>

            <Quote
              size={28}
              className="mt-6 text-[#0B56D9] fill-[#0B56D9]/10"
              aria-hidden="true"
            />
            <h3 className="mt-2 max-w-md pr-20 sm:pr-0 text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight leading-tight">
              Making Indian shopping accessible to everyone, anywhere.
            </h3>

            <p className="mt-5 text-sm text-slate-600 leading-relaxed">
              Pick O Pick was founded with a simple mission — making products
              from India easily accessible to customers across the world.
            </p>

            {/* Before → After */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Before
                </p>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  International customers struggled to buy directly from
                  Indian stores:
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {challenges.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-400 line-through decoration-red-400/70"
                    >
                      <X size={11} className="text-red-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-[#0B56D9] p-4 text-white">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">
                  With Pick O Pick
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/90">
                  We created Pick O Pick to simplify sourcing, shopping,
                  packaging, and international delivery through a secure and
                  dependable platform.
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold">
                  <CheckCircle2 size={13} className="text-white" />
                  One platform, end to end
                </p>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="pt-5 border-t border-dashed border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
                <span className="uppercase tracking-wider text-slate-500">
                  Sourcing • Consolidation • Global Freight
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#0B56D9] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0B56D9]" />
                  Trusted Worldwide
                </span>
              </div>
            </div>
          </div>

          {/* ───────── What We Do: brand image with blue overlay ───────── */}
          <div
            className="lg:col-span-5 relative overflow-hidden rounded-3xl bg-[#0B56D9] bg-cover bg-center text-white flex flex-col"
            style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.webp')" }}
          >
            <div className="absolute inset-0 z-0 bg-[#0B56D9]/85 backdrop-blur-[0.5px]" />
            <div className="relative z-10 flex items-end justify-between px-7 pt-7 pb-4 sm:px-9 sm:pt-9">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-white px-2.5 py-1 rounded-full bg-white/15 border border-white/25">
                  Capabilities
                </span>
                <h4 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight">
                  What We Do
                </h4>
              </div>
              <span className="text-right leading-none">
                <span className="block text-4xl font-black">7</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">
                  Core Services
                </span>
              </span>
            </div>

            <ol className="relative z-10 flex-1 px-7 sm:px-9 py-2">
              {services.map((service, index) => (
                <li
                  key={service}
                  className="group flex items-center gap-4 border-b border-white/15 py-3 last:border-b-0"
                >
                  <span className="w-6 text-xs font-bold text-blue-200">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-sm font-medium text-white/85 transition-colors group-hover:text-white">
                    {service}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="text-white/0 transition-all group-hover:text-white group-hover:-translate-y-0.5"
                  />
                </li>
              ))}
            </ol>

            <div className="relative z-10 px-7 pb-7 pt-3 sm:px-9 sm:pb-9">
              <Link
                to="/nri"
                className="group inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-blue-50 text-[#0B56D9] text-xs sm:text-sm font-extrabold tracking-wide transition-colors"
              >
                <span>Explore NRI Services</span>
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
