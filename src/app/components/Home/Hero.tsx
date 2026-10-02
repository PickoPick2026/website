import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/a11y";

const heroSlides = [
  {
    src: "/images/worldwide-shipping-and-south-indian-sweets-banner.webp",
    alt: "Pick O Pick worldwide delivery with Indian products",
    width: 1920,
    height: 1080,
  },
  {
    src: "/images/promo-buy-and-ship.webp",
    alt: "Shop from India with Pick O Pick's Buy and Ship service",
    width: 1664,
    height: 936,
  },
  {
    src: "/images/promo-buy-and-ship-v2.webp",
    alt: "Shop India, ship worldwide: personal shopping, packing, and delivery",
    width: 1810,
    height: 869,
  },
];

const controlClassName =
  "flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900";

export function Hero() {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;

    if (isPaused || prefersReducedMotion) {
      swiper.autoplay.stop();
    } else if (!swiper.autoplay.running) {
      swiper.autoplay.start();
    }
  }, [isPaused, prefersReducedMotion]);

  return (
    <section
      id="home"
      className="relative mt-24 w-full min-w-0 overflow-hidden bg-white scroll-mt-24 sm:mt-[100px]"
      aria-label="Homepage highlights"
      aria-roledescription="carousel"
      onFocusCapture={() => swiperRef.current?.autoplay.pause()}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget as Node | null) &&
          !isPaused &&
          !prefersReducedMotion
        ) {
          swiperRef.current?.autoplay.resume();
        }
      }}
    >
      <Swiper
        modules={[A11y, Autoplay, Keyboard]}
        slidesPerView={1}
        spaceBetween={0}
        initialSlide={0}
        loop
        autoHeight
        speed={prefersReducedMotion ? 0 : 600}
        grabCursor
        keyboard={{ enabled: true, onlyInViewport: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (isPaused || prefersReducedMotion) swiper.autoplay.stop();
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full bg-white"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.src}>
            <img
              src={slide.src}
              alt={slide.alt}
              width={slide.width}
              height={slide.height}
              className="block h-auto w-full"
              loading="eager"
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex h-10 items-center justify-center gap-1 bg-white sm:h-12 sm:gap-2">
        <button
          type="button"
          className={controlClassName}
          aria-label="Previous banner"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        {heroSlides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            className={controlClassName}
            aria-label={`Show banner ${index + 1} of ${heroSlides.length}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => swiperRef.current?.slideToLoop(index)}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-5 bg-slate-900"
                  : "w-1.5 bg-slate-300"
              }`}
            />
          </button>
        ))}

        <button
          type="button"
          className={controlClassName}
          aria-label="Next banner"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>

        {!prefersReducedMotion && (
          <button
            type="button"
            className={controlClassName}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            aria-pressed={isPaused}
            onClick={() => setIsPaused((paused) => !paused)}
          >
            {isPaused ? (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
