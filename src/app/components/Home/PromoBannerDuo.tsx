import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function PromoBannerDuo() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-full mx-auto px-4 sm:px-8">
        {/* 2-Banner Side-by-Side Responsive Grid */}
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {/* 1. Left Banner: Taste of India (Food, Sweets & Snacks -> Shop Sweets & Savories Category) */}
          <Link
            to="/shop?category=Sweets+and+Savories"
            className="group relative block aspect-[2.5/1] overflow-hidden rounded-2xl border border-blue-200/50 bg-[#1A73E8] shadow-xs sm:aspect-[2.7/1] sm:min-h-[230px] sm:rounded-3xl lg:min-h-[260px]"
            aria-label="Shop authentic Indian sweets, snacks and savories"
          >
            {/* High-Resolution Optimized WebP Background */}
            <img
              src="/images/promo-taste-of-india.webp"
              alt="Send the Taste of India Across the World"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />

            <div className="absolute inset-0 flex items-end p-3 sm:p-6 lg:p-8">
              <span className="relative z-10 inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#073E96]/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition-colors group-hover:bg-[#073E96] sm:px-5 sm:py-2.5 sm:text-sm">
                <span>Shop Sweets &amp; Snacks</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* 2. Right Banner: Beautiful Indian Wear (Silk Sarees & Festive Wear -> Shop Dresses Category) */}
          <Link
            to="/shop?category=Dresses#shop-directory"
            className="group relative block aspect-[2.5/1] overflow-hidden rounded-2xl border border-amber-200/50 bg-[#FDF5EB] shadow-xs sm:aspect-[2.7/1] sm:min-h-[230px] sm:rounded-3xl lg:min-h-[260px]"
            aria-label="Shop authentic Indian wear, sarees and ethnic apparel"
          >
            {/* High-Resolution Optimized WebP Background */}
            <img
              src="/images/promo-indian-wear.webp"
              alt="Beautiful Indian Wear for Every Occasion"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />

            <div className="absolute inset-0 flex items-end p-3 sm:p-6 lg:p-8">
              <span className="relative z-10 inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2 text-xs font-bold text-[#0A1931] shadow-lg backdrop-blur-sm transition-colors group-hover:bg-white sm:px-5 sm:py-2.5 sm:text-sm">
                <span>Shop Indian Wear</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
