import { useEffect, useState } from "react";
import Lenis from "lenis";



import { StoryFlow } from "../components/StoryFlow";
import { Hero } from "../components/Hero";
import { ImageSearch } from "../components/ImageSearch";
import { TrustMetrics } from "../components/TrustMetrics";
import { Services } from "../components/Services";
import { ShoppingDirectory } from "../components/ShoppingDirectory";
import { TrackingExperience } from "../components/TrackingExperience";
import { Testimonials } from "../components/Testimonials";
import { ShopBanner } from "../components/ShopBanner";
import { CTA } from "../components/CTA";
import { LiveActivity } from "../components/LiveActivity";
import Products from "./Products";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔐 CHECK LOGIN STATE
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

  // 🎯 CONDITIONAL RENDER
  if (isLoggedIn) {
    return <Products />; // SHOW PRODUCTS AFTER LOGIN
  }

  return (
    <main className="bg-white text-slate-900">
      <Hero />
      <ImageSearch />
      <TrustMetrics />
      <StoryFlow />
      <Services />
      <ShoppingDirectory />
      <TrackingExperience />
      <Testimonials />
      <ShopBanner />
      <CTA />
      <LiveActivity />
    </main>
  );
}