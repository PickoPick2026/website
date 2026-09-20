import { useEffect, useState } from "react";
import Lenis from "lenis";

import {
  Hero,
  HeroMobile,
  ImageSearch,
  PlanShipmentSection,
  AboutUs,
  WhyChooseUs,
  StoryFlow,
  Services,
  ShoppingDirectoryMarquee,
  PromoBannerDuo,
  Testimonials,
  ShopBanner,
} from "../components/Home";
import { CompanyVision } from "../components/CompanyVision";
import { ConsultationModal } from "../components/NRI/ConsultationModal";
import { WelcomePopup } from "../components/WelcomePopup";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // 🔑 CHECK LOGIN STATE
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    };

    checkAuth();

    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  // 🚀 LENIS ONLY FOR HERO PAGE (optional but better)
  useEffect(() => {
    if (isLoggedIn) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [isLoggedIn]);

  useEffect(() => {
    const openConsultation = () => setIsConsultationOpen(true);
    window.addEventListener("pickopick:open-consultation", openConsultation);
    return () =>
      window.removeEventListener(
        "pickopick:open-consultation",
        openConsultation,
      );
  }, []);

  // 🎯 CONDITIONAL RENDER
  return (
    <main className="bg-white text-slate-900">
      <WelcomePopup />

      {/* MOBILE HERO */}
      <div className="block sm:hidden">
        <HeroMobile />
      </div>

      {/* DESKTOP HERO */}
      <div className="hidden sm:block ">
        <Hero />
      </div>

      {/* UNIVERSAL BUY & SHIP SEARCH */}
      <ImageSearch />

      {/* PLAN YOUR SHIPMENT & DIRECT WHATSAPP QUOTE */}
      <PlanShipmentSection />

      <PromoBannerDuo />
      {/* ABOUT US: OUR STORY & CAPABILITIES */}
      <AboutUs />

      

      {/* 7-STEP JOURNEY */}
      <StoryFlow />

      {/* SERVICES WITH 3D VISUALS */}
      <Services />

      {/* SHOPPING DIRECTORY MARQUEE */}
      <ShoppingDirectoryMarquee />

      {/* SIDE-BY-SIDE PROMO BANNERS: TASTE OF INDIA & BEAUTIFUL INDIAN WEAR */}

      {/* CUSTOMER TESTIMONIALS */}
      <Testimonials />

      {/* SHOP BANNER & BRAND PARTNERS */}
      <ShopBanner />

      {/* Bottom Section: Vision, Mission, Commitment & Company Info */}
      <CompanyVision />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  );
}
