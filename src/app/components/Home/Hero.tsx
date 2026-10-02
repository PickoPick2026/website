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
    src: "/images/Hero/hero-section.png",
    alt: "Pick O Pick worldwide delivery with Indian products",
    width: 1916,
    height: 821,
    title: "India to your doorstep",
    text: "Shop Indian finds, delivered worldwide.",
    href: "/shop",
    button: "Explore the shop",
  },
  {
    src: "/images/Hero/hero-section-2.png",
    alt: "Pick O Pick personal shopper packing Indian products for overseas delivery",
    width: 1916,
    height: 821,
    title: "Buy & Ship",
    text: "You choose it. Our India team buys and ships it.",
    href: "/buy-and-ship",
    button: "Explore Buy & Ship",
  },
  {
    src: "/images/Hero/hero-section-3.png",
    alt: "Pick O Pick service team handling parcels for worldwide delivery",
    width: 1916,
    height: 821,
    title: "Order & Send",
    text: "Pickup in India. Delivery to your door abroad.",
    href: "/order-and-send",
    button: "Explore Order & Send",
  },
  {
    src: "/images/Hero/hero-section-4.png",
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
            <div className="relative">
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
            <div className="bg-white px-5 py-4 sm:absolute sm:bottom-5 sm:left-6 sm:max-w-sm sm:rounded-2xl sm:border sm:border-blue-100 sm:bg-white/95 sm:p-5 lg:bottom-8 lg:left-10 lg:max-w-md">
              <h2 className="text-xl font-extrabold tracking-tight text-[#0A1931] sm:text-2xl lg:text-3xl">{slide.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{slide.text}</p>
              <Link to={slide.href} className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full bg-[#0B56D9] px-5 py-2 text-xs font-bold text-white hover:bg-[#0849B7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B56D9]">{slide.button}</Link>
            </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
