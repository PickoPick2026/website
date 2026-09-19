import { Globe2, Link as LinkIcon, PackageCheck, PlaneTakeoff, Search, ShoppingBag, Warehouse } from "lucide-react";

const steps = [
  { step: "01", icon: Search, title: "Discover Product", desc: "Find what you love on any Indian store." },
  { step: "02", icon: LinkIcon, title: "Submit Link", desc: "Share the product URL with Pick O Pick." },
  { step: "03", icon: ShoppingBag, title: "We Purchase", desc: "Our team buys it locally for you." },
  { step: "04", icon: Warehouse, title: "Warehouse Check", desc: "Received, inspected, and securely consolidated." },
  { step: "05", icon: PlaneTakeoff, title: "Global Dispatch", desc: "Packed to international standards for transit." },
  { step: "06", icon: Globe2, title: "Live Tracking", desc: "Follow updates across international borders." },
  { step: "07", icon: PackageCheck, title: "Doorstep Arrival", desc: "Safely delivered to your home worldwide." },
];

function FlowNode({ item, className }: { item: (typeof steps)[number]; className: string }) {
  const Icon = item.icon;
  return (
    <div className={`absolute z-10 w-44 -translate-x-1/2 text-center ${className}`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0B56D9] bg-white text-[#0B56D9] shadow-[0_4px_14px_rgba(11,86,217,.16)]"><Icon className="h-5 w-5" /></span>
      <p className="mt-3 text-[10px] font-black uppercase tracking-[.16em] text-[#0B56D9]">Step {item.step}</p>
      <h3 className="mt-1 text-sm font-extrabold text-[#0A1931]">{item.title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.desc}</p>
    </div>
  );
}

export function StoryFlow() {
  const [one, two, three, four, five, six, seven] = steps;
  return (
    <section id="how-it-works" className="overflow-hidden border-y border-slate-100 bg-white py-16 sm:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#0B56D9]">How it works</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">Your package journey</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">One continuous route from India to your doorstep.</p>
        </div>

        <div className="relative mx-auto mt-14 hidden h-[430px] max-w-6xl lg:block">
          {/* The route: 01 → 02 → 03, straight down through 04 and 05, then 06 → 07 from right to left. */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 430" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="journey-line" x1="0" x2="1"><stop stopColor="#0B56D9" /><stop offset="1" stopColor="#0B56D9" stopOpacity=".55" /></linearGradient></defs>
            <path d="M140 58 H500 H860 V178 V300 H500 H140" fill="none" stroke="url(#journey-line)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M140 58 H500 H860 V178 V300 H500 H140" fill="none" stroke="#ffffff" strokeOpacity=".9" strokeWidth="3" strokeLinecap="round" strokeDasharray="18 120">
              <animate attributeName="stroke-dashoffset" from="138" to="0" dur="3.2s" repeatCount="indefinite" />
            </path>
            <path d="M850 58 l10 0 l-5 8 z M852 300 l8 -7 v14 z M150 300 l-10 0 l5 -8 z" fill="#0B56D9" />
          </svg>

          <FlowNode item={one} className="left-[14%] top-[34px]" />
          <FlowNode item={two} className="left-1/2 top-[34px]" />
          <FlowNode item={three} className="left-[86%] top-[34px]" />
          <FlowNode item={four} className="left-[86%] top-[154px]" />
          <FlowNode item={five} className="left-[86%] top-[276px]" />
          <FlowNode item={six} className="left-1/2 top-[276px]" />
          <FlowNode item={seven} className="left-[14%] top-[276px]" />
        </div>

        <div className="relative mx-auto mt-10 max-w-md lg:hidden">
          <div className="absolute bottom-5 left-6 top-5 w-px bg-[#0B56D9]/30" />
          <div className="space-y-7">
            {steps.map((item) => {
              const Icon = item.icon;
              return <div key={item.step} className="relative z-10 flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#0B56D9] bg-white text-[#0B56D9]"><Icon className="h-5 w-5" /></span><div className="pt-0.5"><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#0B56D9]">Step {item.step}</p><h3 className="mt-1 text-sm font-extrabold text-[#0A1931]">{item.title}</h3><p className="mt-1 text-xs leading-relaxed text-slate-600">{item.desc}</p></div></div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
