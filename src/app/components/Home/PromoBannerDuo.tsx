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
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[2.7/1] min-h-[190px] sm:min-h-[230px] lg:min-h-[260px] flex items-center bg-[#1A73E8] border border-blue-200/50 shadow-xs cursor-pointer block"
            aria-label="Shop authentic Indian sweets, snacks and savories"
          >
            {/* High-Resolution Optimized WebP Background */}
            <img
              src="/images/promo-taste-of-india.webp"
              alt="Send the Taste of India Across the World"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />

            {/* Subtle soft gradient to guarantee razor-sharp text readability on all viewports */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D52BD]/35 via-transparent to-transparent pointer-events-none" />

            {/* Text & Button Content */}
            <div className="relative z-10 p-5 sm:p-7 md:p-6 lg:p-8 xl:p-10 max-w-[55%] sm:max-w-[52%]">
              <h3 className="text-lg sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-[1.15]">
                Send the <br />
                Taste <span className="text-[#FFC72C]">of India</span> <br />
                Across the World
              </h3>

              <div className="mt-3.5 sm:mt-5 md:mt-4 lg:mt-6">
                <span className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#073E96]/80 group-hover:bg-[#073E96] text-white text-[11px] sm:text-xs lg:text-sm font-bold border border-white/25 backdrop-blur-sm transition-all">
                  <span>Shop Sweets &amp; Snacks</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </div>
          </Link>

          {/* 2. Right Banner: Beautiful Indian Wear (Silk Sarees & Festive Wear -> Shop Dresses Category) */}
          <Link
            to="/shop?category=Dresses#shop-directory"
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[2.7/1] min-h-[190px] sm:min-h-[230px] lg:min-h-[260px] flex items-center bg-[#FDF5EB] border border-amber-200/50 shadow-xs cursor-pointer block"
            aria-label="Shop authentic Indian wear, sarees and ethnic apparel"
          >
            {/* High-Resolution Optimized WebP Background */}
            <img
              src="/images/promo-indian-wear.webp"
              alt="Beautiful Indian Wear for Every Occasion"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />

            {/* Subtle soft gradient to guarantee razor-sharp text readability on all viewports */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5EA]/35 via-transparent to-transparent pointer-events-none" />

            {/* Text & Button Content */}
            <div className="relative z-10 p-5 sm:p-7 md:p-6 lg:p-8 xl:p-10 max-w-[55%] sm:max-w-[52%]">
              <h3 className="text-lg sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-[#0A1931] tracking-tight leading-[1.15]">
                Beautiful <br />
                Indian Wear <br />
                <span className="font-semibold text-sm sm:text-lg md:text-base lg:text-xl text-[#0E2A5C]">
                  for Every Occasion
                </span>
              </h3>

              <div className="mt-3.5 sm:mt-5 md:mt-4 lg:mt-6">
                <span className="inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-white/95 group-hover:bg-white text-[#0A1931] text-[11px] sm:text-xs lg:text-sm font-bold border border-slate-200/90 transition-all shadow-xs">
                  <span>Shop Indian Wear</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
