import { useEffect, useState, useRef, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  ContactRound,
  LogOut,
  MapPin,
  Menu,
  Package,
  ShoppingBag,
  ShoppingCart,
  UserRound,
  X,
  Calculator,
  Building2,
  Info,
  ArrowLeft,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { AuthModal } from "./AuthModal";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/src/lib/supabase";

const globalOffices = [
  {
    country: "Singapore",
    location: "Singapore Operations Desk",
    flag: "/images/flags/sg.svg",
  },
  {
    country: "United Kingdom",
    location: "London, United Kingdom",
    flag: "/images/flags/gb.svg",
  },
  {
    country: "Dubai",
    location: "Dubai, United Arab Emirates",
    flag: "/images/flags/ae.svg",
  },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (location.hash) {
      window.setTimeout(
        () =>
          document
            .querySelector(location.hash)
            ?.scrollIntoView(),
        80,
      );
    }
  }, [location]);

  useEffect(() => {
    const openRegister = () => setIsAuthOpen(true);
    const openLogin = () => setIsAuthOpen(true);
    window.addEventListener("pickopick:open-register", openRegister);
    window.addEventListener("pickopick:open-login", openLogin);
    return () => {
      window.removeEventListener("pickopick:open-register", openRegister);
      window.removeEventListener("pickopick:open-login", openLogin);
    };
  }, []);

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };
    syncUser();
    window.addEventListener("auth-change", syncUser);
    return () => window.removeEventListener("auth-change", syncUser);
  }, []);

  useEffect(() => {
    const refreshCartCount = async () => {
      const customerId = user?.customerID ?? user?.customerId ?? user?.id;
      if (!customerId) {
        setCartCount(0);
        return;
      }
      const { data } = await supabase
        .from("cart")
        .select("quantity")
        .eq("customer_id", customerId);
      setCartCount(
        (data || []).reduce(
          (total, item) => total + (Number(item.quantity) || 1),
          0,
        ),
      );
    };
    void refreshCartCount();
    window.addEventListener("cart-updated", refreshCartCount);
    return () => window.removeEventListener("cart-updated", refreshCartCount);
  }, [user]);

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
    setIsProfileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
    setIsProfileOpen(false);
    if (href.startsWith("/")) return navigate(href);
    if (location.pathname !== "/") return navigate(`/${href}`);
    document.querySelector(href)?.scrollIntoView();
    window.history.pushState(null, "", href);
  };

  const handleMouseEnter = (name: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(name);
  };

  const handleMouseLeave = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const isLoggedIn = Boolean(user);
  const customerName =
    user?.firstName || user?.name || user?.fullName || "My account";

  const closeMenus = () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  };

  const isRouteActive = (path: string) => location.pathname === path;
  const isHashActive = (hash: string) =>
    location.pathname === "/" && location.hash === hash;

  const openAccountPage = (path: string) => {
    closeMenus();
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    closeMenus();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  // Login is only required for the Shop Directory. Buy & Ship / Order & Send
  // open directly for everyone.
  const openShopDirectory = () => {
    if (!isLoggedIn) {
      closeMenus();
      setIsAuthOpen(true);
      return;
    }
    closeMenus();
    navigate("/shop#shop-directory");
  };

  const openBuyAndShip = () => {
    closeMenus();
    navigate("/buy-and-ship");
  };
  const openOrderAndSend = () => {
    closeMenus();
    navigate("/order-and-send");
  };

  const linkClass = (active: boolean) =>
    `whitespace-nowrap rounded-lg px-3 py-2 text-[12.5px] font-extrabold transition-colors ${
      active
        ? "bg-[#0B56D9] text-white shadow-xs"
        : "text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
    }`;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Always-visible Special Offers strip */}
        <a
          href="https://wa.me/919790361222?text=Hello%20Pick%20O%20Pick!%20I%20saw%20the%20special%20offers%20on%20your%20website.%20Please%20share%20the%20details."
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-8 items-center justify-center gap-2 bg-[#0B56D9] px-4 text-white transition-colors hover:bg-[#0B56D9]"
          aria-label="Special price and special offers are available. Chat with us on WhatsApp"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
          </span>
          <span className="truncate text-[10.5px] font-extrabold uppercase tracking-[0.14em] sm:text-[11px]">
            Special Price · Special Offers Are Available — Chat with us
          </span>
        </a>

        <nav className="relative w-full border-b border-slate-200 bg-white shadow-[0_2px_14px_rgba(10,25,49,0.08)]">
          <div className="mx-auto flex h-[64px] max-w-[1440px] items-center gap-2 px-4 sm:h-[68px] sm:gap-3 sm:px-6 lg:px-8">
            {/* Header Back Button */}
            {location.pathname !== "/" && (
              <button
                type="button"
                onClick={() =>
                  window.history.length > 1 ? navigate(-1) : navigate("/")
                }
                className="flex h-9 items-center gap-1.5 shrink-0 rounded-full border border-slate-200 px-2.5 text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
                aria-label="Go back"
                title="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-bold">Back</span>
              </button>
            )}

            {/* Logo navigates to Home / scrolls to top */}
            <a
              href="/"
              onClick={handleLogoClick}
              className="flex shrink-0 items-center"
              aria-label="Pick O Pick home"
            >
              <img
                src="/PICKLogo.png"
                alt="Pick O Pick"
                className="h-12 w-auto object-contain sm:h-14"
              />
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
              {/* 1. Buy & Ship */}
              <button
                type="button"
                onClick={openBuyAndShip}
                className={`relative isolate overflow-hidden whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] font-extrabold uppercase tracking-wide transition-transform hover:-translate-y-0.5 cursor-pointer shadow-xs ${
                  isRouteActive("/buy-and-ship")
                    ? "bg-[#0849B7] text-white ring-2 ring-[#0B56D9]/30"
                    : "bg-[#0B56D9] text-white hover:bg-[#0B56D9]"
                }`}
                aria-label="Start Buy and Ship"
              >
                Buy &amp; Ship
              </button>

              {/* 2. Order & Send */}
              <button
                type="button"
                onClick={openOrderAndSend}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-[12.5px] font-extrabold transition-colors cursor-pointer ${
                  isRouteActive("/order-and-send")
                    ? "bg-[#0B56D9] text-white shadow-xs"
                    : "text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
                }`}
                aria-label="Order and Send"
              >
                Order &amp; Send
              </button>

              {/* 3. Premium Services (NRI) */}
              <a
                href="/nri"
                onClick={(event) => handleNavigation(event, "/nri")}
                className={linkClass(isRouteActive("/nri"))}
              >
                NRI Premium Services
              </a>

              {/* 4. Shop Directory (login required — this is the only gated area) */}
              <a
                href="/shop#shop-directory"
                onClick={(event) => {
                  event.preventDefault();
                  setIsMobileMenuOpen(false);
                  setActiveMenu(null);
                  openShopDirectory();
                }}
                className={linkClass(isRouteActive("/shop"))}
              >
                Shop Directory
              </a>

              {/* 5. Tracking */}
              <a
                href="/track-shipment"
                onClick={(event) => handleNavigation(event, "/track-shipment")}
                className={linkClass(isRouteActive("/track-shipment"))}
              >
                Tracking
              </a>

              {/* 6. Shipment Estimation dropdown — also holds Global Offices,
                  About Us and Contact so the bar stays uncluttered */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("Estimation")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenu((cur) =>
                      cur === "Estimation" ? null : "Estimation",
                    )
                  }
                  className={`inline-flex whitespace-nowrap items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-extrabold transition-colors ${
                    activeMenu === "Estimation" ||
                    isRouteActive("/shipping-estimate")
                      ? "bg-[#0B56D9] text-white shadow-xs"
                      : "text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
                  }`}
                  aria-expanded={activeMenu === "Estimation"}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  Company
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      activeMenu === "Estimation" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeMenu === "Estimation" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50"
                    >
                      {/* Estimation */}
                      <a
                        href="/shipping-estimate"
                        onClick={(event) =>
                          handleNavigation(event, "/shipping-estimate")
                        }
                        className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-blue-50/70"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0B56D9] transition-colors group-hover:bg-white group-hover:shadow-sm">
                          <Calculator className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-xs font-extrabold text-[#0A1931] group-hover:text-[#0B56D9]">
                            Shipment Estimation
                          </span>
                          <span className="block text-[11px] leading-snug text-slate-500">
                            Calculate international shipping rates
                          </span>
                        </span>
                      </a>

                      {/* Global Offices */}
                      <div className="border-t border-slate-100 px-1 pb-1 pt-2">
                        <p className="px-1.5 pb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                          Global Offices
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {globalOffices.map((office) => (
                            <div
                              key={office.country}
                              className="rounded-xl bg-slate-50 p-2 text-center"
                              title={office.location}
                            >
                              <div className="mx-auto h-4 w-6 overflow-hidden rounded-[2px] border border-slate-200 bg-white">
                                <img
                                  src={office.flag}
                                  alt={`${office.country} flag`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <p className="mt-1 text-[10px] font-bold leading-tight text-[#0A1931]">
                                {office.country}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* About Us */}
                      <a
                        href="/#about"
                        onClick={(event) => handleNavigation(event, "/#about")}
                        className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-blue-50/70"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0B56D9] transition-colors group-hover:bg-white group-hover:shadow-sm">
                          <Info className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-xs font-extrabold text-[#0A1931] group-hover:text-[#0B56D9]">
                            About Us
                          </span>
                          <span className="block text-[11px] leading-snug text-slate-500">
                            Full company profile
                          </span>
                        </span>
                      </a>

                      {/* Contact Us */}
                      <a
                        href="/contact"
                        onClick={(event) => handleNavigation(event, "/contact")}
                        className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-blue-50/70"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0B56D9] transition-colors group-hover:bg-white group-hover:shadow-sm">
                          <ContactRound className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-xs font-extrabold text-[#0A1931] group-hover:text-[#0B56D9]">
                            Contact Us
                          </span>
                          <span className="block text-[11px] leading-snug text-slate-500">
                            Speak with our support team
                          </span>
                        </span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop Auth Area */}
            <div className="hidden items-center gap-2 xl:flex">
              <a
                href="https://wa.me/919790361222?text=Hello%20Pick%20O%20Pick%2C%20I%20need%20help%20shopping%20from%20India."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Pick O Pick on WhatsApp"
                title="Chat on WhatsApp"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#1DA851] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B56D9]"
              >
                <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
              </a>
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#0B56D9]"
                    aria-label="Open cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0B56D9] px-1 text-[10px] font-extrabold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen((open) => !open)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 pr-3 text-xs font-extrabold text-[#0A1931] transition-colors hover:bg-blue-50"
                      aria-expanded={isProfileOpen}
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B56D9] text-white">
                        <UserRound className="h-4 w-4" />
                      </span>
                      <span className="max-w-28 truncate">{customerName}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${
                          isProfileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
                        <button
                          type="button"
                          onClick={() => openAccountPage("/profile")}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#0A1931] hover:bg-blue-50"
                        >
                          <UserRound className="h-4 w-4 text-[#0B56D9]" />
                          My profile
                        </button>
                        <button
                          type="button"
                          onClick={() => openAccountPage("/shop")}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#0A1931] hover:bg-blue-50"
                        >
                          <ShoppingBag className="h-4 w-4 text-[#0B56D9]" />
                          Products
                        </button>
                        <button
                          type="button"
                          onClick={() => openAccountPage("/orders")}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#0A1931] hover:bg-blue-50"
                        >
                          <Package className="h-4 w-4 text-[#0B56D9]" />
                          My Orders &amp; Tracking
                        </button>
                        <button
                          type="button"
                          onClick={() => openAccountPage("/addresses")}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#0A1931] hover:bg-blue-50"
                        >
                          <MapPin className="h-4 w-4 text-[#0B56D9]" />
                          Addresses
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="rounded-full bg-[#0B56D9] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-[#0849B7]"
                >
                  Sign in / Sign up
                </button>
              )}
            </div>

            {/* Mobile Header Actions */}
            <div className="ml-auto flex shrink-0 items-center gap-1.5 xl:hidden">
              <a
                href="https://wa.me/919790361222?text=Hello%20Pick%20O%20Pick%2C%20I%20need%20help%20shopping%20from%20India."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Pick O Pick on WhatsApp"
                title="Chat on WhatsApp"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#1DA851] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B56D9]"
              >
                <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
              </a>
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700"
                  aria-label="Open cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0B56D9] px-1 text-[10px] font-extrabold text-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="shrink-0 rounded-full bg-[#0B56D9] px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-[#0849B7] sm:text-[11px]"
                >
                  Sign in / Sign up
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
                aria-expanded={isMobileMenuOpen}
                aria-label={
                  isMobileMenuOpen ? "Close navigation" : "Open navigation"
                }
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-slate-100 bg-white xl:hidden"
              >
                <div className="space-y-4 px-4 py-5 sm:px-6">
                  {/* Primary Service Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={openBuyAndShip}
                      className={`relative isolate w-full overflow-hidden rounded-xl py-2.5 text-xs font-extrabold shadow-xs cursor-pointer ${
                        isRouteActive("/buy-and-ship")
                          ? "bg-[#0849B7] text-white"
                          : "bg-[#0B56D9] text-white hover:bg-[#0B56D9]"
                      }`}
                    >
                      Buy &amp; Ship
                    </button>

                    <button
                      type="button"
                      onClick={openOrderAndSend}
                      className={`w-full rounded-xl border py-2.5 text-xs font-extrabold transition-colors cursor-pointer ${
                        isRouteActive("/order-and-send")
                          ? "border-[#0B56D9] bg-blue-50 text-[#0B56D9]"
                          : "border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
                      }`}
                    >
                      Order &amp; Send
                    </button>
                  </div>

                  {/* Secondary Links */}
                  <div className="space-y-1 rounded-2xl bg-slate-50 p-2">
                    <a
                      href="/nri"
                      onClick={(event) => handleNavigation(event, "/nri")}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isRouteActive("/nri")
                          ? "bg-white text-[#0B56D9]"
                          : "text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                      NRI Premium Services
                    </a>

                    <a
                      href="/shop#shop-directory"
                      onClick={(event) => {
                        event.preventDefault();
                        setIsMobileMenuOpen(false);
                        setActiveMenu(null);
                        openShopDirectory();
                      }}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isRouteActive("/shop")
                          ? "bg-white text-[#0B56D9]"
                          : "text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Shop Directory
                    </a>

                    <a
                      href="/track-shipment"
                      onClick={(event) =>
                        handleNavigation(event, "/track-shipment")
                      }
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isRouteActive("/track-shipment")
                          ? "bg-white text-[#0B56D9]"
                          : "text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
                      }`}
                    >
                      <Package className="h-4 w-4" />
                      Tracking
                    </a>

                    <a
                      href="/shipping-estimate"
                      onClick={(event) =>
                        handleNavigation(event, "/shipping-estimate")
                      }
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isRouteActive("/shipping-estimate")
                          ? "bg-white text-[#0B56D9]"
                          : "text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
                      }`}
                    >
                      <Calculator className="h-4 w-4" />
                      Shipment Estimation
                    </a>

                    <a
                      href="/#how-it-works"
                      onClick={(event) =>
                        handleNavigation(event, "/#how-it-works")
                      }
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isHashActive("#how-it-works")
                          ? "bg-white text-[#0B56D9]"
                          : "text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
                      }`}
                    >
                      <Info className="h-4 w-4" />
                      How It Works
                    </a>

                    <a
                      href="/#about"
                      onClick={(event) => handleNavigation(event, "/#about")}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isHashActive("#about")
                          ? "bg-white text-[#0B56D9]"
                          : "text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
                      }`}
                    >
                      <Info className="h-4 w-4" />
                      About Us — Company Profile
                    </a>

                    <a
                      href="/contact"
                      onClick={(event) => handleNavigation(event, "/contact")}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isRouteActive("/contact")
                          ? "bg-white text-[#0B56D9]"
                          : "text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
                      }`}
                    >
                      <ContactRound className="h-4 w-4" />
                      Contact Us
                    </a>
                  </div>

                  {/* Auth Actions in Mobile */}
                  {!isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="w-full rounded-xl bg-[#0B56D9] py-2.5 text-center text-xs font-extrabold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-[#0849B7]"
                    >
                      Sign in / Sign up
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600/90 py-2.5 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
