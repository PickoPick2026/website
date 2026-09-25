import {
  ArrowRight,
  BadgeCheck,
  ShoppingBag,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";

interface ShoppingCtaSectionProps {
  variant?: "home" | "nri";
  onOpenConsultation?: () => void;
  onStartBooking?: () => void;
}

const partnerStores = [
  { name: "Amazon India", src: "/partners/Amazon_logo.webp", category: "/buy-and-ship" },
  { name: "Flipkart", src: "/partners/Flipkart.webp", category: "/buy-and-ship" },
  { name: "Myntra", src: "/partners/Myntra.webp", category: "/shop?category=Dresses" },
  { name: "Best Terracotta", src: "/partners/BestTerracotta.webp", category: "/shop?category=Home+Decorations" },
  { name: "Mambalam Iyers", src: "/partners/mambalamiyers.webp", category: "/shop?category=Sweets+and+Savories" },
  { name: "Nandri Masala", src: "/partners/nandrimasala.webp", category: "/shop?category=Groceries" },
];

export function ShoppingCtaSection({
  variant = "home",
  onOpenConsultation,
  onStartBooking,
}: ShoppingCtaSectionProps) {
  const isNri = variant === "nri";
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-[#F7F9FF] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-[1.15fr_0.85fr]">
        <div className="p-6 sm:p-9 lg:p-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0B56D9]">
            <ShoppingBag className="h-3.5 w-3.5" />
            {isNri ? "Your India-side shopping team" : "Shopping Across India"}
          </span>

          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-[#0A1931] sm:text-4xl lg:text-[2.7rem]">
            {isNri ? (
              <>Your India, <span className="text-[#0B56D9]">delivered to you.</span></>
            ) : (
              <>Shop India&apos;s top stores. <span className="text-[#0B56D9]">Delivered worldwide.</span></>
            )}
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {isNri
              ? "Shop and ship from India with a dedicated team ready to help at every step."
              : "Shop Amazon, Flipkart, Myntra, and trusted regional stores with help from our India-side team."}
          </p>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            {isNri ? (
              <button
                type="button"
                onClick={onOpenConsultation}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B56D9] px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7]"
              >
                Talk to a concierge <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B56D9] px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7]"
              >
                Browse marketplace <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {isNri ? (
              <button
                type="button"
                onClick={onStartBooking}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#0A1931] transition-colors hover:bg-slate-50"
              >
                Plan your shipment <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                to="/buy-and-ship"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#0A1931] transition-colors hover:bg-slate-50"
              >
                Use a personal shopper <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="mb-2.5 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
              <BadgeCheck className="h-3.5 w-3.5 text-[#0B56D9]" />
              Trusted Indian stores
            </p>
            <div className="relative overflow-hidden">
              <motion.div
                className="flex w-max items-center gap-2.5"
                initial={{ x: 0 }}
                animate={{ x: shouldReduceMotion ? 0 : "-50%" }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 24, ease: "linear", repeat: Infinity }}
              >
              {[...partnerStores, ...partnerStores].map((store, index) => (
                <Link
                  key={`${store.name}-${index}`}
                  to={store.category}
                  aria-label={`Shop ${store.name}`}
                  className="flex h-12 w-28 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-2 transition-colors hover:border-[#0B56D9] hover:bg-blue-50/40 sm:w-32"
                >
                  <img src={store.src} alt={store.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                </Link>
              ))}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex h-[320px] items-end justify-center overflow-hidden bg-[#EEF4FF] sm:h-[420px] md:h-full md:min-h-[480px]">
          <img
            src="/images/nri-cta-closer-v1.webp"
            alt="Pick O Pick team member ready to help shop, pack, and ship your order"
            className="block h-full w-full object-contain object-bottom"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
