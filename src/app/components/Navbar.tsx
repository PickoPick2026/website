import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  ChevronDown,
  ContactRound,
  Crown,
  Info,
  LogOut,
  MapPin,
  Menu,
  Package,
  ShoppingBag,
  ShoppingCart,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { AuthModal } from "./AuthModal";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/src/lib/supabase";

const WHATSAPP_HELP_URL =
  "https://wa.me/919790361222?text=Hello%20Pick%20O%20Pick%2C%20I%20need%20help%20shopping%20from%20India.";
const WHATSAPP_OFFERS_URL =
  "https://wa.me/919790361222?text=Hello%20Pick%20O%20Pick!%20I%20saw%20the%20special%20offers%20on%20your%20website.%20Please%20share%20the%20details.";

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

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  hint?: string;
};

// Links shown in the mobile panel (and mirrored in the desktop bar/dropdown).
const MOBILE_LINKS: NavItem[] = [
  { label: "NRI Premium Services", href: "/nri", icon: Crown },
  { label: "Shop Directory", href: "/shop#shop-directory", icon: ShoppingBag },
  { label: "Tracking", href: "/track-shipment", icon: Package },
  { label: "Shipment Estimation", href: "/shipping-estimate", icon: Calculator },
  { label: "How It Works", href: "/#how-it-works", icon: Info },
  { label: "About Us", href: "/#about", icon: Building2 },
  { label: "Contact Us", href: "/contact", icon: ContactRound },
];

const COMPANY_LINKS: NavItem[] = [
  {
    label: "Shipment Estimation",
    href: "/shipping-estimate",
    icon: Calculator,
    hint: "Calculate international shipping rates",
  },
  {
    label: "About Us",
    href: "/#about",
    icon: Info,
    hint: "Full company profile",
  },
  {
    label: "Contact Us",
    href: "/contact",
    icon: ContactRound,
    hint: "Speak with our support team",
  },
];

const ACCOUNT_LINKS: NavItem[] = [
  { label: "My profile", href: "/profile", icon: UserRound },
  { label: "Products", href: "/shop", icon: ShoppingBag },
  { label: "My Orders & Tracking", href: "/orders", icon: Package },
  { label: "Addresses", href: "/addresses", icon: MapPin },
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
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = Boolean(user);
  const customerName =
    user?.firstName || user?.name || user?.fullName || "My account";

  const closeMenus = () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  };

  // The cart is a drawer on the Shop page (the /cart page was removed).
  const openCart = () => {
    closeMenus();
    if (location.pathname === "/shop") {
      window.dispatchEvent(new Event("pickopick:open-cart"));
    } else {
      navigate("/shop?cart=open");
    }
  };

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

  // Close every menu whenever the page changes.
  useEffect(() => {
    closeMenus();
  }, [location.pathname]);

  // Lock page scroll + Escape to close while the mobile panel is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setIsMobileMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMobileMenuOpen]);

  // Close the profile dropdown on outside click.
  useEffect(() => {
    if (!isProfileOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isProfileOpen]);

  useEffect(() => {
    const openAuth = () => setIsAuthOpen(true);
    window.addEventListener("pickopick:open-register", openAuth);
    window.addEventListener("pickopick:open-login", openAuth);
    return () => {
      window.removeEventListener("pickopick:open-register", openAuth);
      window.removeEventListener("pickopick:open-login", openAuth);
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

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMenus();
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo(0, 0);
    }
  };

  const goTo = (href: string) => {
    closeMenus();
    // Login is only required for the Shop Directory.
    if (href.startsWith("/shop#") && !isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }
    if (href.startsWith("/")) return navigate(href);
    if (location.pathname !== "/") return navigate(`/${href}`);
    document.querySelector(href)?.scrollIntoView();
    window.history.pushState(null, "", href);
  };

  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    goTo(href);
  };

  const handleMouseEnter = (name: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(name);
  };

  const handleMouseLeave = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  const isLinkActive = (href: string) => {
    const [path, hash] = href.split("#");
    if (hash && path === "/") {
      return location.pathname === "/" && location.hash === `#${hash}`;
    }
    return location.pathname === (path || "/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    closeMenus();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const linkClass = (active: boolean) =>
    `whitespace-nowrap rounded-full px-3.5 py-2 text-[12.5px] font-extrabold transition-colors ${
      active
        ? "bg-blue-50 text-[#0B56D9]"
        : "text-slate-700 hover:bg-blue-50 hover:text-[#0B56D9]"
    }`;

  const cartButton = (
    <button
      type="button"
      onClick={openCart}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-[#0B56D9]/40 hover:text-[#0B56D9]"
      aria-label={`Open cart${cartCount ? `, ${cartCount} items` : ""}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0B56D9] px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
          {cartCount}
        </span>
      )}
    </button>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Special offers strip (32px — page offsets depend on it) */}
        <a
          href={WHATSAPP_OFFERS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 items-center justify-center gap-2 bg-[#0B56D9] px-4 text-white"
          aria-label="Special price and special offers are available. Chat with us on WhatsApp"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="truncate text-[10.5px] font-extrabold uppercase tracking-[0.14em] sm:text-[11px]">
            Special Price · Special Offers Are Available — Chat with us
          </span>
        </a>

        <nav className="relative w-full border-b border-slate-200/80 bg-white">
          <div className="mx-auto flex h-[64px] max-w-[1440px] items-center gap-2 px-4 sm:h-[68px] sm:gap-3 sm:px-6 lg:px-8">
            {location.pathname !== "/" && (
              <button
                type="button"
                onClick={() =>
                  window.history.length > 1 ? navigate(-1) : navigate("/")
                }
                className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-2.5 text-slate-700 transition-colors hover:bg-slate-50"
                aria-label="Go back"
                title="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden text-xs font-bold sm:inline">Back</span>
              </button>
            )}

            <a
              href="/"
              onClick={handleLogoClick}
              className="flex shrink-0 items-center bg-white"
              aria-label="Pick O Pick home"
            >
              <img
                src="/PICKLogo.png"
                alt="Pick O Pick"
                className="h-11 w-auto object-contain sm:h-14"
              />
            </a>

            {/* ── Desktop links ── */}
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
              <button
                type="button"
                onClick={() => goTo("/buy-and-ship")}
                className={`brand-shine-button whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-extrabold uppercase tracking-wide text-white transition-colors ${
                  isLinkActive("/buy-and-ship")
                    ? "bg-[#0849B7] ring-2 ring-[#0B56D9]/30"
                    : "bg-[#0B56D9] hover:bg-[#0849B7]"
                }`}
              >
                Buy &amp; Ship
              </button>
              <button
                type="button"
                onClick={() => goTo("/order-and-send")}
                className={linkClass(isLinkActive("/order-and-send"))}
              >
                Order &amp; Send
              </button>
              {MOBILE_LINKS.slice(0, 3).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => handleNavigation(event, item.href)}
                  className={linkClass(isLinkActive(item.href))}
                >
                  <span className={item.href === "/nri" ? "brand-shine-text" : undefined}>
                    {item.label}
                  </span>
                </a>
              ))}

              {/* Company dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("Company")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenu((cur) => (cur === "Company" ? null : "Company"))
                  }
                  className={`inline-flex items-center gap-1.5 ${linkClass(
                    activeMenu === "Company" ||
                      COMPANY_LINKS.some((item) => isLinkActive(item.href)),
                  )}`}
                  aria-expanded={activeMenu === "Company"}
                >
                  Company
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      activeMenu === "Company" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeMenu === "Company" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2"
                    >
                      {COMPANY_LINKS.map(({ label, href, icon: Icon, hint }) => (
                        <a
                          key={href}
                          href={href}
                          onClick={(event) => handleNavigation(event, href)}
                          className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-blue-50/70"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0B56D9] group-hover:bg-white">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block text-xs font-extrabold text-[#0A1931] group-hover:text-[#0B56D9]">
                              {label}
                            </span>
                            <span className="block text-[11px] leading-snug text-slate-500">
                              {hint}
                            </span>
                          </span>
                        </a>
                      ))}
                      <div className="mt-1 border-t border-slate-100 px-1 pt-2">
                        <p className="px-1.5 pb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                          Global Offices
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {globalOffices.map((office) => (
                            <div
                              key={office.country}
                              className="rounded-xl bg-[#F7F9FF] p-2 text-center"
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Desktop actions ── */}
            <div className="hidden items-center gap-2 xl:flex">
              <a
                href={WHATSAPP_HELP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Pick O Pick on WhatsApp"
                title="Chat on WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#1DA851]"
              >
                <FaWhatsapp size={20} aria-hidden="true" />
              </a>
              {isLoggedIn ? (
                <>
                  {cartButton}
                  <div className="relative" ref={profileRef}>
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen((open) => !open)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-xs font-extrabold text-[#0A1931] transition-colors hover:border-[#0B56D9]/40"
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
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5"
                        >
                          {ACCOUNT_LINKS.map(({ label, href, icon: Icon }) => (
                            <button
                              key={href}
                              type="button"
                              onClick={() => goTo(href)}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-[#0A1931] hover:bg-blue-50"
                            >
                              <Icon className="h-4 w-4 text-[#0B56D9]" />
                              {label}
                            </button>
                          ))}
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="rounded-full bg-[#0B56D9] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7]"
                >
                  Sign in / Sign up
                </button>
              )}
            </div>

            {/* ── Mobile actions: compact icons only ── */}
            <div className="ml-auto flex shrink-0 items-center gap-1.5 xl:hidden">
              <a
                href={WHATSAPP_HELP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Pick O Pick on WhatsApp"
                className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white sm:inline-flex"
              >
                <FaWhatsapp size={20} aria-hidden="true" />
              </a>
              {isLoggedIn ? (
                cartButton
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="flex h-10 items-center gap-1.5 rounded-full bg-[#0B56D9] px-3.5 text-xs font-extrabold text-white"
                  aria-label="Sign in or sign up"
                >
                  <UserRound className="h-4 w-4" />
                  <span className="hidden min-[380px]:inline">Sign in</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700"
                aria-expanded={isMobileMenuOpen}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ───────── Mobile slide-in panel ───────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-[2px] xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-[61] flex w-[86%] max-w-sm flex-col bg-white xl:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
                <img src="/PICKLogo.png" alt="Pick O Pick" className="h-10 w-auto" />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-700"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                {/* Primary services */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => goTo("/buy-and-ship")}
                    className="brand-shine-button flex flex-col items-start gap-3 rounded-2xl bg-[#0B56D9] p-4 text-left text-white"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span className="text-sm font-extrabold">Buy &amp; Ship</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo("/order-and-send")}
                    className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left ${
                      isLinkActive("/order-and-send")
                        ? "border-[#0B56D9] bg-blue-50 text-[#0B56D9]"
                        : "border-slate-200 text-[#0A1931]"
                    }`}
                  >
                    <Truck className="h-5 w-5 text-[#0B56D9]" />
                    <span className="text-sm font-extrabold">Order &amp; Send</span>
                  </button>
                </div>

                {/* Links */}
                <nav className="mt-5 space-y-1" aria-label="Site">
                  {MOBILE_LINKS.map(({ label, href, icon: Icon }) => {
                    const active = isLinkActive(href);
                    return (
                      <a
                        key={href}
                        href={href}
                        onClick={(event) => handleNavigation(event, href)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-colors ${
                          active
                            ? "bg-blue-50 text-[#0B56D9]"
                            : "text-slate-700 active:bg-blue-50"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            active ? "bg-white" : "bg-[#F7F9FF]"
                          } text-[#0B56D9]`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1">
                          <span className={href === "/nri" ? "brand-shine-text" : undefined}>
                            {label}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-300" />
                      </a>
                    );
                  })}
                </nav>

                {/* Account */}
                {isLoggedIn && (
                  <div className="mt-5 rounded-2xl bg-[#F7F9FF] p-2">
                    <p className="px-3 pb-1 pt-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      {customerName}
                    </p>
                    {ACCOUNT_LINKS.map(({ label, href, icon: Icon }) => (
                      <button
                        key={href}
                        type="button"
                        onClick={() => goTo(href)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 active:bg-white"
                      >
                        <Icon className="h-4 w-4 text-[#0B56D9]" />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="space-y-2 border-t border-slate-100 p-5">
                <a
                  href={WHATSAPP_HELP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-sm font-extrabold text-white"
                >
                  <FaWhatsapp size={18} aria-hidden="true" />
                  Chat on WhatsApp
                </a>
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 text-sm font-extrabold text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthOpen(true);
                    }}
                    className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#0B56D9] text-sm font-extrabold text-white"
                  >
                    Sign in / Sign up
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
