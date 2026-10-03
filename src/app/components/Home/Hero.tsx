import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/a11y";

const heroSlides = [
  {
    src: "/images/Hero/hero-section.webp",
    mobileSrc: "/images/Hero/mobile/hero-section-mobile.webp",
    alt: "Pick O Pick worldwide delivery with Indian products",
    width: 1916,
    height: 821,
    title: "India to your doorstep",
    text: "Shop Indian finds, delivered worldwide.",
    href: "/shop",
    button: "Explore the shop",
  },
  {
    src: "/images/Hero/hero-section-2.webp",
    mobileSrc: "/images/Hero/mobile/hero-section-2-mobile.webp",
    alt: "Pick O Pick personal shopper packing Indian products for overseas delivery",
    width: 1916,
    height: 821,
    title: "Buy & Ship",
    text: "You choose it. Our India team buys and ships it.",
    href: "/buy-and-ship",
    button: "Explore Buy & Ship",
  },
  {
    src: "/images/Hero/hero-section-3.webp",
    mobileSrc: "/images/Hero/mobile/hero-section-3-mobile.webp",
    alt: "Pick O Pick service team handling parcels for worldwide delivery",
    width: 1916,
    height: 821,
    title: "Order & Send",
    text: "Pickup in India. Delivery to your door abroad.",
    href: "/order-and-send",
    button: "Explore Order & Send",
  },
  {
    src: "/images/Hero/hero-section-4.webp",
    mobileSrc: "/images/Hero/mobile/hero-section-4-mobile.webp",
    alt: "Shop Indian stores with Pick O Pick, from personal shopping to doorstep delivery worldwide",
    width: 1916,
    height: 821,
    title: "NRI Premium Services",
    text: "Your dedicated team for shopping and shipping from India.",
    href: "/nri",
    button: "Explore premium services",
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
            {/* The whole slide is one link — clicking the image or the button
                opens the slide's page. Button sits centered, just above the
                bottom edge. */}
            <Link
              to={slide.href}
              className="group relative block"
              aria-label={`${slide.button} — ${slide.alt}`}
            >
              <picture>
                <source
                  media="(max-width: 639px)"
                  srcSet={slide.mobileSrc}
                  width={1120}
                  height={1400}
                  type="image/webp"
                />
                <img
                  src={slide.src}
                  alt={slide.alt}
                  width={slide.width}
                  height={slide.height}
                  className="block aspect-[4/5] h-auto w-full object-cover sm:aspect-auto"
                  loading="eager"
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding="async"
                  draggable={false}
                />
              </picture>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#0B56D9] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-colors group-hover:bg-[#0849B7] lg:bottom-7">
                {slide.button}
              </span>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
