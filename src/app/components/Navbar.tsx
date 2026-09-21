import { useEffect, useState, useRef } from "react";
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
  HelpCircle,
  Info,
  ArrowLeft,
} from "lucide-react";
import { RegisterModal } from "./RegisterModal";
import { LoginModal } from "./LoginModal";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/src/lib/supabase";

const companyLinks = [
  {
    name: "About Pick O Pick",
    href: "/#about",
    description: "Learn about our India-to-world service",
    icon: Info,
  },
  {
    name: "Contact Us",
    href: "/contact",
    description: "Speak with our support team",
    icon: ContactRound,
  },
  {
    name: "Shipment Estimation",
    href: "/shipping-estimate",
    description: "Calculate international shipping rates",
    icon: Calculator,
  },
];

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
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
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
    const openRegister = () => setIsRegisterOpen(true);
    const openLogin = () => setIsLoginOpen(true);
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
  const isAboutActive =
    location.pathname === "/contact" ||
    location.pathname === "/shipping-estimate" ||
    (location.pathname === "/" && location.hash === "#about");

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

  const openBuyAndShip = () => {
    closeMenus();
    navigate("/buy-and-ship#assisted-buy-form");
  };

  const openOrderAndSend = () => {
    closeMenus();
    navigate("/order-and-send#order-and-send-form");
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <nav className="relative w-full border-b border-[#D94F18] bg-[#FF6321] shadow-[0_2px_14px_rgba(10,25,49,0.12)]">
          <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-2 px-4 sm:h-[74px] sm:gap-3 sm:px-6 lg:px-8">
            {/* Header Back Button */}
            {location.pathname !== "/" && (
              <button
                type="button"
                onClick={() =>
                  window.history.length > 1 ? navigate(-1) : navigate("/")
                }
                className="flex h-9 items-center gap-1.5 shrink-0 rounded-full border border-white/70 px-2.5 text-white transition-colors hover:bg-white/15 cursor-pointer shadow-xs"
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
              className="flex shrink-0 items-center rounded-xl border border-white/40 bg-white px-2 py-1 shadow-sm"
              aria-label="Pick O Pick home"
            >
              <img
                src="/PICKLogo.png"
                alt="Pick O Pick"
                className="h-9 w-auto object-contain sm:h-10"
              />
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
              {/* 1. Buy & Ship */}
              <button
                type="button"
                onClick={openBuyAndShip}
                className={`relative isolate overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-extrabold uppercase tracking-wide transition-transform hover:-translate-y-0.5 cursor-pointer shadow-xs ${
                  isRouteActive("/buy-and-ship")
                    ? "bg-[#0849B7] text-white ring-2 ring-white/90"
                    : "bg-white text-[#0B56D9] hover:bg-blue-50"
                }`}
                aria-label="Start Buy and Ship"
              >
                <span
                  aria-hidden="true"
                  className="buy-ship-shine pointer-events-none absolute inset-y-0 -left-10 w-7 bg-gradient-to-r from-transparent via-white/90 to-transparent"
                />
                <span className="relative">Buy &amp; Ship</span>
              </button>

              {/* 2. Order & Send (Placed right next to Buy & Ship) */}
              <button
                type="button"
                onClick={openOrderAndSend}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-extrabold transition-colors cursor-pointer ${
                  isRouteActive("/order-and-send")
                    ? "bg-white text-[#0B56D9] shadow-xs"
                    : "text-white hover:bg-white/15"
                }`}
                aria-label="Order and Send"
              >
                Order &amp; Send
              </button>

              {/* 3. Shop Directory */}
              <a
                href="/shop#shop-directory"
                onClick={(event) =>
                  handleNavigation(event, "/shop#shop-directory")
                }
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-extrabold transition-colors ${
                  isRouteActive("/shop")
                    ? "bg-white text-[#0B56D9] shadow-xs"
                    : "text-white hover:bg-white/15"
                }`}
              >
                Shop Directory
              </a>

              {/* 4. Tracking */}
              <a
                href="/track-shipment"
                onClick={(event) => handleNavigation(event, "/track-shipment")}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-extrabold transition-colors ${
                  isRouteActive("/track-shipment")
                    ? "bg-white text-[#0B56D9] shadow-xs"
                    : "text-white hover:bg-white/15"
                }`}
              >
                Tracking
              </a>

              {/* 5. NRI Services */}
              <a
                href="/nri"
                onClick={(event) => handleNavigation(event, "/nri")}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-extrabold transition-colors ${
                  isRouteActive("/nri")
                    ? "bg-[#0B56D9] text-white ring-2 ring-white/70 shadow-xs"
                    : "text-white hover:bg-white/15"
                }`}
              >
                NRI Services
              </a>

              {/* 6. How It Works (Separate top-level link) */}
              <a
                href="/#how-it-works"
                onClick={(event) => handleNavigation(event, "/#how-it-works")}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-extrabold transition-colors ${
                  isHashActive("#how-it-works")
                    ? "bg-white text-[#0B56D9] shadow-xs"
                    : "text-white hover:bg-white/15"
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                How It Works
              </a>

              {/* 7. About Us Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("AboutUs")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenu((cur) =>
                      cur === "AboutUs" ? null : "AboutUs",
                    )
                  }
                  className={`inline-flex whitespace-nowrap items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-extrabold transition-colors ${
                    activeMenu === "AboutUs" || isAboutActive
                      ? "bg-white text-[#0B56D9] shadow-xs"
                      : "text-white hover:bg-white/15"
                  }`}
                  aria-expanded={activeMenu === "AboutUs"}
                >
                  About Us
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeMenu === "AboutUs" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeMenu === "AboutUs" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50"
                    >
                      <div className="space-y-1">
                        {companyLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <a
                              key={link.name}
                              href={link.href}
                              onClick={(event) =>
                                handleNavigation(event, link.href)
                              }
                              className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-blue-50/70"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0B56D9] transition-colors group-hover:bg-white group-hover:shadow-sm">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs font-extrabold text-[#0A1931] group-hover:text-[#0B56D9]">
                                  {link.name}
                                </p>
                                <p className="text-[11px] text-slate-500 leading-snug">
                                  {link.description}
                                </p>
                              </div>
                            </a>
                          );
                        })}
                        <div className="my-2 border-t border-slate-100 pt-2">
                          <p className="px-2.5 pb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                            Global Offices
                          </p>
                          <div className="grid grid-cols-3 gap-1.5">
                            {globalOffices.map((office) => (
                              <div
                                key={office.country}
                                className="rounded-xl bg-slate-50 p-2 text-center"
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
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop Auth Area */}
            <div className="hidden items-center gap-2 xl:flex">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white transition-colors hover:bg-white/20"
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
                      className="inline-flex items-center gap-2 rounded-full bg-white px-2 py-1.5 pr-3 text-xs font-extrabold text-[#0A1931] transition-colors hover:bg-blue-50"
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
                          Orders
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLoginOpen(true)}
                    className="rounded-full px-3.5 py-2 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-white/15"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(true)}
                    className="rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#0B56D9] shadow-sm transition-colors hover:bg-blue-50"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Header Actions */}
            <div className="ml-auto flex shrink-0 items-center gap-1.5 xl:hidden">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-white"
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
                <>
                  <button
                    type="button"
                    onClick={() => setIsLoginOpen(true)}
                    className="shrink-0 rounded-lg px-1.5 py-2 text-[10px] font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-white/15 sm:px-2.5 sm:text-[11px]"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(true)}
                    className="shrink-0 rounded-full bg-white px-2.5 py-2 text-[10px] font-extrabold uppercase tracking-wide text-[#0B56D9] shadow-sm transition-colors hover:bg-blue-50 sm:px-3.5 sm:text-[11px]"
                  >
                    Create Account
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/70 text-white"
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
                className="overflow-hidden border-t border-white/30 bg-[#FF6321] xl:hidden"
              >
                <div className="space-y-4 px-4 py-5 sm:px-6">
                  {/* Primary Service Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={openBuyAndShip}
                      className={`relative isolate w-full overflow-hidden rounded-xl py-2.5 text-xs font-extrabold shadow-xs cursor-pointer ${
                        isRouteActive("/buy-and-ship")
                          ? "bg-[#0A3E9B] text-white"
                          : "bg-white text-[#0B56D9]"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="buy-ship-shine pointer-events-none absolute inset-y-0 -left-10 w-7 bg-gradient-to-r from-transparent via-blue-100 to-transparent"
                      />
                      <span className="relative">Buy &amp; Ship</span>
                    </button>

                    <button
                      type="button"
                      onClick={openOrderAndSend}
                      className={`w-full rounded-xl border border-white/40 py-2.5 text-xs font-extrabold transition-colors hover:bg-white/20 cursor-pointer ${
                        isRouteActive("/order-and-send")
                          ? "bg-white text-[#0B56D9]"
                          : "bg-white/15 text-white"
                      }`}
                    >
                      Order &amp; Send
                    </button>
                  </div>

                  {/* Secondary Links */}
                  <div className="space-y-1 rounded-2xl bg-white/10 p-2">
                    <a
                      href="/shop#shop-directory"
                      onClick={(event) =>
                        handleNavigation(event, "/shop#shop-directory")
                      }
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isRouteActive("/shop")
                          ? "bg-white text-[#0B56D9]"
                          : "text-white hover:bg-white/15"
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
                          : "text-white hover:bg-white/15"
                      }`}
                    >
                      <Package className="h-4 w-4" />
                      Tracking
                    </a>

                    <a
                      href="/nri"
                      onClick={(event) => handleNavigation(event, "/nri")}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isRouteActive("/nri")
                          ? "bg-white text-[#0B56D9]"
                          : "text-white hover:bg-white/15"
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                      NRI Services
                    </a>

                    <a
                      href="/#how-it-works"
                      onClick={(event) =>
                        handleNavigation(event, "/#how-it-works")
                      }
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isHashActive("#how-it-works")
                          ? "bg-white text-[#0B56D9]"
                          : "text-white hover:bg-white/15"
                      }`}
                    >
                      <HelpCircle className="h-4 w-4" />
                      How It Works
                    </a>

                    <a
                      href="/#about"
                      onClick={(event) => handleNavigation(event, "/#about")}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-white/15"
                    >
                      <Info className="h-4 w-4" />
                      About Pick O Pick
                    </a>

                    <a
                      href="/contact"
                      onClick={(event) => handleNavigation(event, "/contact")}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isRouteActive("/contact")
                          ? "bg-white text-[#0B56D9]"
                          : "text-white hover:bg-white/15"
                      }`}
                    >
                      <ContactRound className="h-4 w-4" />
                      Contact Us
                    </a>

                    <a
                      href="/shipping-estimate"
                      onClick={(event) =>
                        handleNavigation(event, "/shipping-estimate")
                      }
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                        isRouteActive("/shipping-estimate")
                          ? "bg-white text-[#0B56D9]"
                          : "text-white hover:bg-white/15"
                      }`}
                    >
                      <Calculator className="h-4 w-4" />
                      Shipment Estimation
                    </a>
                  </div>

                  {/* Auth Actions in Mobile */}
                  {!isLoggedIn ? (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsLoginOpen(true);
                        }}
                        className="rounded-xl border border-white/40 py-2.5 text-center text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-white/15"
                      >
                        Login
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsRegisterOpen(true);
                        }}
                        className="rounded-xl bg-white py-2.5 text-center text-xs font-extrabold uppercase tracking-wide text-[#0B56D9] shadow-sm transition-colors hover:bg-blue-50"
                      >
                        Sign Up
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600/80 py-2.5 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-red-600"
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

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
    </>
  );
}
