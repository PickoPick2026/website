import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function PromoBannerDuo() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-full mx-auto px-4 sm:px-8">
        {/* 2-Banner Side-by-Side Responsive Grid */}
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {/* 1. Left Banner: Taste of India (Food, Sweets & Pickles -> NRI Services) */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[2.7/1] min-h-[190px] sm:min-h-[230px] lg:min-h-[260px] flex items-center bg-[#1A73E8] group border border-blue-200/50 shadow-xs">
            {/* User High-Resolution PNG Background */}
            <img
              src="/images/promo-taste-of-india.png"
              alt="Send the Taste of India Across the World"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
              loading="lazy"
            />

            {/* Subtle soft gradient to guarantee razor-sharp text readability on all viewports */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D52BD]/30 via-transparent to-transparent pointer-events-none" />

            {/* Text & Button Content (Aligned in the open left area) */}
            <div className="relative z-10 p-5 sm:p-7 md:p-6 lg:p-8 xl:p-10 max-w-[55%] sm:max-w-[52%]">
              <h3 className="text-lg sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-[1.15]">
                Send the <br />
                Taste <span className="text-[#FFC72C]">of India</span> <br />
                Across the World
              </h3>

              <div className="mt-3.5 sm:mt-5 md:mt-4 lg:mt-6">
                <Link
                  to="/nri"
                  className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#073E96]/80 hover:bg-[#073E96] text-white text-[11px] sm:text-xs lg:text-sm font-bold border border-white/25 backdrop-blur-sm transition-all cursor-pointer group/btn"
                >
                  <span>Shop Food & Snacks</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover/btn:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Right Banner: Beautiful Indian Wear (Silk Sarees & Festive Wear -> Shop Page) */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[2.7/1] min-h-[190px] sm:min-h-[230px] lg:min-h-[260px] flex items-center bg-[#FDF5EB] group border border-amber-200/50 shadow-xs">
            {/* User High-Resolution PNG Background */}
            <img
              src="/images/promo-indian-wear.png"
              alt="Beautiful Indian Wear for Every Occasion"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
              loading="lazy"
            />

            {/* Subtle soft gradient to guarantee razor-sharp text readability on all viewports */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5EA]/30 via-transparent to-transparent pointer-events-none" />

            {/* Text & Button Content (Aligned in the open left area) */}
            <div className="relative z-10 p-5 sm:p-7 md:p-6 lg:p-8 xl:p-10 max-w-[55%] sm:max-w-[52%]">
              <h3 className="text-lg sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl font-extrabold text-[#0A1931] tracking-tight leading-[1.15]">
                Beautiful <br />
                Indian Wear <br />
                <span className="font-semibold text-sm sm:text-lg md:text-base lg:text-xl text-[#0E2A5C]">
                  for Every Occasion
                </span>
              </h3>

              <div className="mt-3.5 sm:mt-5 md:mt-4 lg:mt-6">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-white/95 hover:bg-white text-[#0A1931] text-[11px] sm:text-xs lg:text-sm font-bold border border-slate-200/90 transition-all cursor-pointer group/btn"
                >
                  <span>Shop Now</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover/btn:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
