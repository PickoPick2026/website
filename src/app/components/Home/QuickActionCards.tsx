import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Truck,
  Headset,
  Crown,
  ArrowRight,
  Plus,
} from "lucide-react";

// Swap `image` for each card's final creative — transparent/white-background
// illustrations blend best; photos are shown in a rounded frame instead.
const actions = [
  {
    id: "buy-and-ship",
    icon: ShoppingBag,
    eyebrow: "Buy & Ship",
    title: "We buy it for you in India",
    description:
      "Share any product link — our personal shopper purchases, verifies and ships it to your doorstep abroad.",
    cta: "Start Buy & Ship",
    to: "/buy-and-ship",
    image: "/images/nri-trust/shop-from-india.webp",
    photo: false,
  },
  {
    id: "order-and-send",
    icon: Truck,
    eyebrow: "Order & Send",
    title: "Send parcels from your Indian home",
    description:
      "Doorstep pickup anywhere in India, careful repacking and express courier to 200+ countries in 3–5 days.",
    cta: "Schedule a Pickup",
    to: "/order-and-send",
    image: "/images/nri-trust/international-shipping.webp",
    photo: false,
  },
  {
    id: "express-consultation",
    icon: Headset,
    eyebrow: "Express Courier Consultation",
    title: "Talk to a shipping expert — free",
    description:
      "Rates, timelines, customs, packaging — get answers immediately and book your slot with our concierge team.",
    cta: "Book Free Consultation",
    event: "pickopick:open-consultation",
    image: "/images/nri-consultation-concierge-v1.webp",
    photo: true,
  },
  {
    id: "premium-services",
    icon: Crown,
    eyebrow: "NRI Premium Services",
    title: "Premium picks for premium shipping",
    description:
      "Dedicated service team, priority handling, white-glove support — see what premium gets you.",
    cta: "Explore Premium",
    to: "/nri",
    image: "/images/nri-trust/professional-packing.webp",
    photo: false,
  },
];

type Action = (typeof actions)[number];

export function QuickActionCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const openAction = (action: Action) => {
    if (action.event) {
      window.dispatchEvent(new Event(action.event));
      return;
    }
    navigate(action.to!);
  };

  return (
    <section
      id="quick-actions"
      className="border-b border-slate-200/80 bg-white py-14 sm:py-20 scroll-mt-28"
      aria-label="Quick actions — Pick O Pick services"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0B56D9]">
            What will you do today?
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-5xl">
            One <span className="text-[#0B56D9]">box.</span> Every Pick O Pick
            service.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Choose a service — each one ships from India straight to your door,
            wherever you are.
          </p>
        </div>

        {/* Expanding cards */}
        <div className="flex flex-col gap-3 lg:h-[460px] lg:flex-row lg:gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const isActive = index === activeIndex;
            const num = String(index + 1).padStart(2, "0");

            return (
              <div
                key={action.id}
                className={`relative overflow-hidden rounded-[28px] border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-w-0 ${
                  isActive
                    ? "border-[#0B56D9]/40 bg-[#F4F8FF] lg:flex-[5]"
                    : "border-slate-200 bg-[#F8FAFC] hover:border-[#0B56D9]/40 hover:bg-[#F4F8FF] lg:flex-[1]"
                }`}
              >
                {/* ── Collapsed state ── */}
                {!isActive && (
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-expanded={false}
                    aria-label={`Open ${action.eyebrow}`}
                    className="group flex w-full items-center gap-4 p-4 text-left lg:h-full lg:flex-col lg:justify-between lg:p-6 lg:text-center"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B56D9] transition-colors group-hover:bg-[#0B56D9] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-base font-extrabold text-[#0A1931] lg:flex-none lg:rotate-180 lg:whitespace-nowrap lg:text-xl lg:[writing-mode:vertical-rl]">
                      {action.eyebrow}
                    </span>
                    <span className="flex items-center gap-2 text-xs font-black text-[#0B56D9]/60">
                      <Plus className="h-4 w-4 lg:hidden" />
                      {num}
                    </span>
                  </button>
                )}

                {/* ── Expanded state ── */}
                {isActive && (
                  <div
                    key={`open-${action.id}`}
                    className="animate-fade-in relative flex h-full flex-col p-6 sm:p-8 lg:p-10"
                  >
                    <div className="relative z-10 lg:max-w-[52%]">
                      <p className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0B56D9]">
                        <Icon className="h-4 w-4" />
                        {action.eyebrow}
                      </p>
                      <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-[#0A1931] sm:text-3xl">
                        {action.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {action.description}
                      </p>
                    </div>

                    {/* Creative image */}
                    {action.photo ? (
                      <div className="mt-6 overflow-hidden rounded-2xl border-4 border-white lg:absolute lg:bottom-8 lg:right-8 lg:mt-0 lg:h-[78%] lg:w-[40%]">
                        <img
                          src={action.image}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          className="h-56 w-full object-cover object-top lg:h-full"
                        />
                      </div>
                    ) : (
                      <img
                        src={action.image}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        className="mx-auto mt-4 h-56 w-auto object-contain mix-blend-multiply lg:absolute lg:bottom-4 lg:right-4 lg:mt-0 lg:h-[82%] lg:w-[46%] lg:object-right-bottom"
                      />
                    )}

                    <div className="relative z-10 mt-6 flex items-center gap-4 lg:mt-auto">
                      <button
                        type="button"
                        onClick={() => openAction(action)}
                        className="group inline-flex items-center gap-2 rounded-full bg-[#0B56D9] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#0B56D9]/25 transition-colors hover:bg-[#0849B7]"
                      >
                        {action.cta}
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </button>
                      <span className="text-xs font-black text-[#0B56D9]/50">
                        {num} / 0{actions.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
