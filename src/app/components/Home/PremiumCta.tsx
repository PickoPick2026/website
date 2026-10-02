import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  Crown,
  Headset,
  MessageCircleHeart,
  PackageCheck,
  UserRound,
} from "lucide-react";

const perks = [
  {
    icon: UserRound,
    title: "Dedicated account manager",
    text: "One person who knows your shipments end to end.",
  },
  {
    icon: PackageCheck,
    title: "Priority pickup & packing",
    text: "Your parcels are picked, packed and dispatched first.",
  },
  {
    icon: Headset,
    title: "Free premium consultation",
    text: "Plan rates, customs and timelines with our experts.",
  },
];

export function PremiumCta() {
  return (
    <section
      id="premium-services"
      className="bg-[#F7F9FF] py-14 scroll-mt-28 sm:py-20"
      aria-label="NRI Premium Services"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div
          className="relative overflow-hidden rounded-3xl bg-[#0B56D9] bg-cover bg-center text-white"
          style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.webp')" }}
        >
          <div className="absolute inset-0 z-0 bg-[#0B56D9]/85 backdrop-blur-[0.5px]" />

          <div className="relative z-10 grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:p-12">
            {/* Copy + actions */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em]">
                <Crown size={13} aria-hidden="true" />
                NRI Premium Service
              </span>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.08]">
                Premium picks for premium shipping.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-50 sm:text-base">
                A dedicated service team, priority handling, personal account
                manager and white-glove support — see what premium gets you,
                then book your consultation immediately.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/nri#booking-portal"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50"
                >
                  <CalendarCheck size={15} aria-hidden="true" />
                  Book Your Slot
                  <ArrowRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  to="/nri"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                >
                  <MessageCircleHeart size={15} aria-hidden="true" />
                  Book Your Consultation
                </Link>
              </div>
            </div>

            {/* Concierge photo */}
            <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <div className="overflow-hidden rounded-2xl border-4 border-white/20">
                <img
                  src="/images/nri-consultation-concierge-v1.webp"
                  alt="Pick O Pick premium concierge helping an NRI customer"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover object-top lg:aspect-[4/4.2]"
                />
              </div>
              <div className="absolute -bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl bg-white p-3 text-[#0A1931] shadow-lg sm:left-auto sm:right-[-12px] sm:w-64">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B56D9]">
                  <Crown size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-extrabold">
                    Your premium concierge
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    White-glove support, start to finish
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Perks strip */}
          <ul className="relative z-10 grid gap-px border-t border-white/20 bg-white/15 sm:grid-cols-3">
            {perks.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-start gap-3 bg-[#0B56D9]/40 px-6 py-5 sm:px-8"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0B56D9]">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-extrabold">{title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-blue-100">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
