import { motion } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Plane,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

interface PartnerStore {
  name: string;
  src: string;
  alt: string;
  tag: string;
  url: string;
  actionText: string;
}

const PARTNERS: PartnerStore[] = [
  {
    name: "Amazon India",
    src: "/partners/Amazon_logo.webp",
    alt: "Amazon India",
    tag: "Mega Marketplace",
    url: "/buy-and-ship",
    actionText: "Assisted Buy",
  },
  {
    name: "Flipkart",
    src: "/partners/Flipkart.webp",
    alt: "Flipkart",
    tag: "E-Commerce",
    url: "/buy-and-ship",
    actionText: "Assisted Buy",
  },
  {
    name: "Myntra",
    src: "/partners/Myntra.webp",
    alt: "Myntra",
    tag: "Ethnic and Fashion",
    url: "/shop?category=Dresses",
    actionText: "Shop Ethnic Wear",
  },
  {
    name: "Best Terracotta",
    src: "/partners/BestTerracotta.webp",
    alt: "Best Terracotta",
    tag: "Authentic Handicrafts",
    url: "/shop?category=Home+Decorations",
    actionText: "Shop Home Decor",
  },
  {
    name: "Mambalam Iyers",
    src: "/partners/mambalamiyers.webp",
    alt: "Mambalam Iyers",
    tag: "Pickles and Sweets",
    url: "/shop?category=Sweets+and+Savories",
    actionText: "Shop Sweets & Snacks",
  },
  {
    name: "Nandri Masala",
    src: "/partners/nandrimasala.webp",
    alt: "Nandri Masala",
    tag: "Traditional Spices",
    url: "/shop?category=Groceries",
    actionText: "Shop Groceries",
  },
];

const MARQUEE_ITEMS = [...PARTNERS, ...PARTNERS, ...PARTNERS];

export function ShopBanner() {
  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white via-slate-50/60 to-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Top Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
            <Sparkles size={13} className="text-[#FF6321]" />
            Shopping Across India
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A1931] leading-tight">
            Shop India&apos;s Top Stores. <br className="hidden sm:inline" />
            <span className="text-[#0B56D9]">Delivered Anywhere on Earth.</span>
          </h2>

          <p className="mt-3.5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Order from Amazon, Flipkart, Myntra, or regional specialty brands.
            Use our <strong>Buy &amp; Ship</strong> personal shopper service or
            explore curated products in our marketplace.
          </p>

          {/* Targeted Action CTAs with Distinct Destinations */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/buy-and-ship"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0B56D9] hover:bg-[#0945AD] text-white font-bold text-sm transition-all cursor-pointer group shadow-xs"
            >
              <ShoppingBag size={18} />
              <span>How Buy &amp; Ship Works</span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0A1931] font-bold text-sm border border-slate-200 transition-all cursor-pointer shadow-xs"
            >
              <span>Browse Marketplace Catalog</span>
              <ArrowRight size={15} />
            </Link>

            <a
              href="https://wa.me/919790361222?text=Hello%20PickoPick%20team%2C%20I%20would%20like%20assistance%20with%20shopping%20from%20Indian%20stores."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm transition-all cursor-pointer shadow-xs"
            >
              <FaWhatsapp size={19} />
              <span>WhatsApp Personal Shopper</span>
            </a>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-14">
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0B56D9] flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0A1931]">
                Free Indian Locker
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Get your own virtual Indian address to receive packages from any
                website.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <PackageCheck size={22} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0A1931]">
                Smart Consolidation
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                We combine multiple parcels into one box to save up to 80% on
                shipping costs.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#FF6321] flex items-center justify-center shrink-0">
              <Plane size={22} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0A1931]">
                3–5 Days Global Air
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Fast, insured door-to-door express delivery with end-to-end live
                tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Marquee Header */}
        <div className="text-center mb-5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            Click Any Store to Shop That Category or Request Assisted Buying
          </span>
        </div>
      </div>

      {/* Full-Bleed Infinite Logo Marquee with Relevant Category Destinations */}
      <div className="relative w-full overflow-hidden py-4">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex w-max items-center gap-4 sm:gap-6 px-4"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 26,
          }}
        >
          {MARQUEE_ITEMS.map((partner, i) => (
            <Link
              key={i}
              to={partner.url}
              className="flex items-center gap-3.5 bg-white border border-slate-200/80 hover:border-[#0B56D9] hover:shadow-md rounded-2xl px-5 py-3.5 shadow-xs transition-all duration-300 min-w-[230px] sm:min-w-[260px] group cursor-pointer block"
            >
              <div className="w-14 h-10 flex items-center justify-center shrink-0 bg-slate-50 rounded-lg p-1">
                <img
                  src={partner.src}
                  alt={partner.alt}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="truncate">
                <p className="text-xs sm:text-sm font-bold text-[#0A1931] group-hover:text-[#0B56D9] transition-colors truncate">
                  {partner.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] font-medium text-slate-400">
                    {partner.tag}
                  </span>
                  <span className="text-[10px] font-extrabold text-[#0B56D9] inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {partner.actionText} <ExternalLink size={9} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
