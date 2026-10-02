import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Truck,
  Headset,
  Crown,
  ArrowRight,
  Package,
} from "lucide-react";

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
    accent: "from-[#0B56D9] to-[#0849B7]",
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
    accent: "from-[#0A1931] to-[#0B56D9]",
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
    accent: "from-[#087f5b] to-[#0B56D9]",
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
    accent: "from-[#0B56D9] to-[#0849B7]",
  },
];

export function QuickActionCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % actions.length),
      3000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    const action = actions[index];

    if (action.event) {
      window.dispatchEvent(new Event(action.event));
      return;
    }

    navigate(action.to!);
  };

  const active = actions[activeIndex];
  const ActiveIcon = active.icon;

  return (
    <section
      id="quick-actions"
      className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-28"
      aria-label="Quick actions — pickup box"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#0B56D9]">
            <Package size={12} />
            What will you do today?
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A1931]">
            One box. Every Pick O Pick service.
          </h2>
        </div>

        {/* The rotating "pickup box" card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* Rotating detail card */}
            <div
              key={active.id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${active.accent} p-6 text-white sm:p-8 animate-fade-in`}
            >
              <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-white/10" />
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs">
                    <ActiveIcon className="h-5 w-5" />
                  </span>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/85">
                    {active.eyebrow}
                  </p>
                </div>
                <h3 className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl">
                  {active.title}
                </h3>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-white/85 sm:text-sm">
                  {active.description}
                </p>
                <button
                  type="button"
                  onClick={() => handleSelect(activeIndex)}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-extrabold uppercase tracking-wide text-[#0A1931] transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  {active.cta}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Service selector tabs */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {actions.map((action, index) => {
                const Icon = action.icon;
                const isActive = index === activeIndex;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleSelect(index)}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                      isActive
                        ? "border-[#0B56D9] bg-blue-50 shadow-sm ring-2 ring-[#0B56D9]/20"
                        : "border-slate-200 bg-white hover:border-[#0B56D9]/40 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isActive
                          ? "bg-[#0B56D9] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs font-extrabold leading-tight text-[#0A1931]">
                        {action.eyebrow}
                      </span>
                      <span className="mt-0.5 block text-[10px] font-semibold text-slate-500">
                        Changes every 3s · tap to open
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
