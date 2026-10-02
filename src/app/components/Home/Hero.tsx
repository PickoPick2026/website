import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/a11y";

const heroSlides = [
  {
    src: "/images/Hero/hero-section.png",
    alt: "Pick O Pick worldwide delivery with Indian products",
    width: 1916,
    height: 821,
  },
  {
    src: "/images/Hero/hero-section-2.png",
    alt: "Pick O Pick personal shopper packing Indian products for overseas delivery",
    width: 1916,
    height: 821,
  },
  {
    src: "/images/Hero/hero-section-3.png",
    alt: "Pick O Pick service team handling parcels for worldwide delivery",
    width: 1916,
    height: 821,
  },
  {
    src: "/images/Hero/hero-section-4.png",
    alt: "Shop Indian stores with Pick O Pick, from personal shopping to doorstep delivery worldwide",
    width: 1916,
    height: 821,
  },
];

export function Hero() {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;

    if (prefersReducedMotion) {
      swiper.autoplay.stop();
    } else if (!swiper.autoplay.running) {
      swiper.autoplay.start();
    }
  }, [prefersReducedMotion]);

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
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (prefersReducedMotion) swiper.autoplay.stop();
        }}
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
    </section>
  );
}
