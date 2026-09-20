import {
  Search,
  Link as LinkIcon,
  ShoppingBag,
  Warehouse,
  PlaneTakeoff,
  Globe2,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    num: "1",
    icon: Search,
    title: "Discover Product",
    desc: "Find what you love on any Indian store.",
  },
  {
    num: "2",
    icon: LinkIcon,
    title: "Submit Link",
    desc: "Share the product URL with Pick O Pick.",
  },
  {
    num: "3",
    icon: ShoppingBag,
    title: "We Purchase",
    desc: "Our team buys it locally for you.",
  },
  {
    num: "4",
    icon: Warehouse,
    title: "Warehouse Hub",
    desc: "Received, inspected & consolidated.",
  },
  {
    num: "5",
    icon: PlaneTakeoff,
    title: "Global Dispatch",
    desc: "Packed for international air transit.",
  },
  {
    num: "6",
    icon: Globe2,
    title: "Live Tracking",
    desc: "Follow updates across borders.",
  },
  {
    num: "7",
    numDone: true,
    icon: PackageCheck,
    title: "Doorstep Arrival",
    desc: "Safely delivered to your home.",
  },
];

export function StoryFlow() {
  return (
    <section
      id="how-it-works"
      className="py-14 sm:py-18 bg-white border-y border-slate-100 relative overflow-hidden scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#0B56D9]">
            How it works
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
            Your Package Journey
          </h2>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
            From the streets of India to your doorstep, follow the seamless path
            of your order.
          </p>
        </div>

        {/* Single-Line Flow (Desktop & Tablet) */}
        <div className="relative">
          {/* Continuous Connecting Line behind the icons on desktop */}
          <div className="hidden lg:block absolute top-6 left-[6%] right-[6%] h-0.5 bg-slate-200 -z-0" />
          <div className="hidden lg:block absolute top-6 left-[6%] right-[6%] h-0.5 bg-gradient-to-r from-[#0B56D9] via-[#0B56D9] to-emerald-500 -z-0 opacity-40" />

          {/* 7-Step Grid on desktop, horizontal scroll rail on mobile */}
          <div className="flex lg:grid lg:grid-cols-7 gap-3 lg:gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === steps.length - 1;
              return (
                <div
                  key={item.num}
                  className="min-w-[170px] sm:min-w-[190px] lg:min-w-0 shrink-0 snap-start flex flex-col items-center text-center relative group"
                >
                  {/* Icon Node with Number Badge */}
                  <div className="relative z-10 mb-3.5">
                    <div
                      className={`w-12 h-12 rounded-full border-2 bg-white flex items-center justify-center transition-all duration-200 ${
                        item.numDone
                          ? "border-emerald-500 text-emerald-600 group-hover:bg-emerald-50"
                          : "border-[#0B56D9] text-[#0B56D9] group-hover:bg-[#0B56D9] group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Clean Number Badge - '1', '2', etc. (NO 'Step' word) */}
                    <span
                      className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center text-white ${
                        item.numDone ? "bg-emerald-600" : "bg-[#0B56D9]"
                      }`}
                    >
                      {item.num}
                    </span>
                  </div>

                  {/* Connecting Arrow between steps on desktop */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute top-4 -right-2.5 z-10 w-5 h-5 items-center justify-center text-[#0B56D9]/70">
                      <ArrowRight size={13} strokeWidth={2.5} />
                    </div>
                  )}

                  {/* Content Container (Cleanly below the line, zero overlap) */}
                  <div className="w-full px-1">
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0A1931] group-hover:text-[#0B56D9] transition-colors leading-tight">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-[11px] text-slate-500 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Swipe Indicator */}
          <div className="lg:hidden flex items-center justify-center gap-1.5 mt-2 text-[11px] text-slate-400 font-semibold">
            <span>Swipe to follow journey</span>
            <ArrowRight size={12} className="text-[#0B56D9]" />
          </div>
        </div>
      </div>
    </section>
  );
}
