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
} from "lucide-react";
import { RegisterModal } from "./RegisterModal";
import { LoginModal } from "./LoginModal";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/src/lib/supabase";

const companyLinks = [
  {
    name: "About Pick O Pick",
    href: "#about",
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
  {
    name: "How It Works",
    href: "#how-it-works",
    description: "Your package journey from India",
    icon: HelpCircle,
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
            ?.scrollIntoView({ behavior: "smooth" }),
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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
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
    navigate("/shop");
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <nav className="relative w-full border-b border-[#DE4D17] bg-[#FF6321]">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:h-[68px] sm:px-6 lg:px-8">
            {/* Logo navigates to Home / scrolls to top */}
            <a
              href="/"
              onClick={handleLogoClick}
              className="flex shrink-0 items-center rounded-xl bg-white px-2 py-1"
              aria-label="Pick O Pick home"
            >
              <img
                src="/PICKLogo.png"
                alt="Pick O Pick"
                className="h-9 w-auto object-contain sm:h-10"
              />
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden h-full items-center gap-1.5 lg:flex">
              <a
                href="/track-shipment"
                onClick={(event) => handleNavigation(event, "/track-shipment")}
                className="rounded-lg px-3 py-2 text-sm font-extrabold text-white transition-colors hover:bg-white/15"
              >
                Tracking
              </a>

              <a
                href="/nri"
                onClick={(event) => handleNavigation(event, "/nri")}
                className="rounded-full bg-[#0B56D9] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:bg-[#0B56D9]/90"
              >
                NRI Services
              </a>

              <button
                type="button"
                onClick={openBuyAndShip}
                className="relative isolate overflow-hidden rounded-full bg-white px-3.5 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-[#0B56D9] transition-transform hover:-translate-y-0.5"
                aria-label="Start Buy and Ship"
              >
                <span
                  aria-hidden="true"
                  className="buy-ship-shine pointer-events-none absolute inset-y-0 -left-10 w-7 bg-gradient-to-r from-transparent via-white/90 to-transparent"
                />
                <span className="relative">Buy &amp; Ship</span>
              </button>

              {/* Company Compact Dropdown Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("Company")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenu((cur) =>
                      cur === "Company" ? null : "Company",
                    )
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                    activeMenu === "Company"
                      ? "bg-white text-[#0B56D9]"
                      : "text-white hover:bg-white/15"
                  }`}
                  aria-expanded={activeMenu === "Company"}
                >
                  Company
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeMenu === "Company" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeMenu === "Company" && (
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
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Global Offices Direct Dropdown Menu */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("Global Offices")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenu((cur) =>
                      cur === "Global Offices" ? null : "Global Offices",
                    )
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                    activeMenu === "Global Offices"
                      ? "bg-white text-[#0B56D9]"
                      : "text-white hover:bg-white/15"
                  }`}
                  aria-expanded={activeMenu === "Global Offices"}
                >
                  Global Offices
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeMenu === "Global Offices" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeMenu === "Global Offices" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50"
                    >
                      <div className="space-y-1">
                        {globalOffices.map((office) => (
                          <div
                            key={office.country}
                            className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50"
                          >
                            <div className="flex h-7 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white shadow-xs">
                              <img
                                src={office.flag}
                                alt={`${office.country} flag`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-[#0A1931]">
                                {office.country}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {office.location}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop Auth Area: Clearly Visible in the Top Navbar */}
            <div className="hidden items-center gap-2 lg:flex">
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
                        className={`h-3.5 w-3.5 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
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
            <div className="flex items-center gap-2 lg:hidden">
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
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsLoginOpen(true)}
                    className="rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold uppercase text-white hover:bg-white/15"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(true)}
                    className="rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#0B56D9]"
                  >
                    Create Account
                  </button>
                </div>
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
                className="overflow-hidden border-t border-white/30 bg-[#FF6321] lg:hidden"
              >
                <div className="space-y-4 px-4 py-5 sm:px-6">
                  {/* Primary Mobile Links */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="/track-shipment"
                      onClick={(event) =>
                        handleNavigation(event, "/track-shipment")
                      }
                      className="flex items-center justify-center rounded-xl bg-white/15 py-2.5 text-xs font-extrabold text-white transition-colors hover:bg-white/20"
                    >
                      Tracking
                    </a>
                    <a
                      href="/nri"
                      onClick={(event) => handleNavigation(event, "/nri")}
                      className="flex items-center justify-center rounded-xl bg-white py-2.5 text-xs font-extrabold text-[#0B56D9] shadow-xs"
                    >
                      NRI Services
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={openBuyAndShip}
                    className="relative isolate w-full overflow-hidden rounded-xl bg-white py-2.5 text-xs font-extrabold text-[#0B56D9] shadow-xs"
                  >
                    <span
                      aria-hidden="true"
                      className="buy-ship-shine pointer-events-none absolute inset-y-0 -left-10 w-7 bg-gradient-to-r from-transparent via-blue-100 to-transparent"
                    />
                    <span className="relative">Buy &amp; Ship From India</span>
                  </button>

                  {/* Mobile Company Section */}
                  <div>
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/90">
                      Company
                    </p>
                    <div className="space-y-1 rounded-2xl bg-white/10 p-2">
                      {companyLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <a
                            key={link.name}
                            href={link.href}
                            onClick={(event) =>
                              handleNavigation(event, link.href)
                            }
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-white/15"
                          >
                            <Icon className="h-4 w-4 shrink-0 text-white/80" />
                            <span>{link.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile Global Offices Section */}
                  <div>
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/90">
                      Global Offices
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {globalOffices.map((office) => (
                        <div
                          key={office.country}
                          className="flex flex-col items-center rounded-xl bg-white p-2.5 text-center shadow-xs"
                        >
                          <div className="h-4 w-6 overflow-hidden rounded-[2px] border border-slate-200">
                            <img
                              src={office.flag}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="mt-1.5 text-[11px] font-extrabold text-[#0A1931] leading-tight">
                            {office.country}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Profile / Auth Section */}
                  {isLoggedIn ? (
                    <div className="rounded-2xl bg-white p-2 text-[#0A1931]">
                      <div className="flex items-center gap-2 px-2 py-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B56D9] text-white">
                          <UserRound className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-extrabold">
                          {customerName}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2">
                        <button
                          type="button"
                          onClick={() => openAccountPage("/profile")}
                          className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-[#0A1931]"
                        >
                          My profile
                        </button>
                        <button
                          type="button"
                          onClick={() => openAccountPage("/shop")}
                          className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-[#0A1931]"
                        >
                          Products
                        </button>
                        <button
                          type="button"
                          onClick={() => openAccountPage("/orders")}
                          className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-[#0A1931]"
                        >
                          Orders
                        </button>
                        <button
                          type="button"
                          onClick={() => openAccountPage("/addresses")}
                          className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-[#0A1931]"
                        >
                          Addresses
                        </button>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="col-span-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsLoginOpen(true);
                        }}
                        className="w-full rounded-xl border border-white/60 bg-white/10 py-2.5 text-xs font-extrabold uppercase text-white transition-colors hover:bg-white/20"
                      >
                        Login
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsRegisterOpen(true);
                        }}
                        className="w-full rounded-xl bg-white py-2.5 text-xs font-extrabold uppercase text-[#0B56D9] transition-colors hover:bg-blue-50"
                      >
                        Create Account
                      </button>
                    </div>
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
        onLoginClick={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onRegisterClick={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
    </>
  );
}
