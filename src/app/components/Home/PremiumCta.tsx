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
      className="w-full bg-[#F7F9FF] py-14 scroll-mt-28 sm:py-20"
      aria-label="NRI Premium Services"
    >
        <div className="relative grid w-full bg-white text-[#0A1931]">
          <img
            src="/images/nri-premium-concierge-bg.webp"
            alt="Pick O Pick concierge speaking with a customer through her headset"
            loading="lazy"
            width={2072}
            height={759}
            className="col-start-1 row-start-1 block h-auto w-full self-center"
          />

          <div className="relative z-10 self-center p-6 sm:p-8 lg:col-start-1 lg:row-start-1 lg:w-[55%] lg:py-6 xl:p-12">
            {/* Copy + actions */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#0B56D9]">
                <Crown size={13} aria-hidden="true" />
                <span className="brand-shine-text">NRI Premium Service</span>
              </span>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:leading-[1.08] xl:text-5xl">
                Premium picks for premium shipping.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 xl:text-base">
                A dedicated service team, priority handling, personal account
                manager and white-glove support — see what premium gets you,
                then book your consultation immediately.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/nri#booking-portal"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0B56D9] px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#0849B7]"
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
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0B56D9]/30 bg-white/80 px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50"
                >
                  <MessageCircleHeart size={15} aria-hidden="true" />
                  Book Your Consultation
                </Link>
              </div>
          {/* Benefits below the booking buttons */}
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {perks.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-start gap-2"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0B56D9]">
                  <Icon size={13} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-bold">{title}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
            </div>
          </div>
        </div>
    </section>
  );
}
