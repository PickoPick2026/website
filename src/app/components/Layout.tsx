import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  MapPin,
  Package,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Wallet,
  Home,
  
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { supabase } from "@/src/lib/supabase";


export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<any>(null);
  
// ✅ AUTH CHECK
useEffect(() => {
  const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setIsLoggedIn(!!user);
    setUserData(user);
  };

  checkAuth();

  window.addEventListener("auth-change", checkAuth);

  return () => {
    window.removeEventListener("auth-change", checkAuth);
  };
}, []);


// ✅ FETCH CART COUNT
useEffect(() => {
  fetchCartCount();
}, []);


// ✅ LISTEN FOR CART UPDATES
useEffect(() => {
  const handleCartUpdate = () => {
    fetchCartCount();
  };

  window.addEventListener("cart-updated", handleCartUpdate);

  return () => {
    window.removeEventListener("cart-updated", handleCartUpdate);
  };
}, []);
 
  useEffect(() => {
  const checkAuth = () => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  };

 
  checkAuth();

 
  window.addEventListener('auth-change', checkAuth);

  return () => {
    window.removeEventListener('auth-change', checkAuth);
  };
}, []);
const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchCartCount = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user?.customerID) {
    setCartCount(0);
    return;
  }

  const { count, error } = await supabase
    .from("cart")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", user.customerID);

  if (!error) {
    setCartCount(count || 0);
  }
};

 useEffect(() => {
  fetchCartCount();
}, []);


  const handleLogout = () => {
   localStorage.removeItem("user");

   window.dispatchEvent(new Event('auth-change')); 

   navigate("/");
  };

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/*  HEADER SWITCH */}
      {isLoggedIn ? (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex shrink-0 items-center" aria-label="Pick O Pick products">
                <img
                  src="/PICKLogo.png"
                  alt="PickoPick"
                  className="h-9 w-auto object-contain sm:h-10"
                />
              </Link>

              <nav className="hidden items-center gap-1 md:flex" aria-label="Signed-in navigation">
                <Link
                  to="/"
                  className={`rounded-full px-3 py-2 text-sm font-bold transition-colors ${location.pathname === "/" ? "bg-blue-50 text-[#0B56D9]" : "text-slate-600 hover:bg-slate-50 hover:text-[#0B56D9]"}`}
                >
                  Shop
                </Link>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setServicesMenuOpen((open) => !open)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-bold transition-colors ${servicesMenuOpen || ["/nri", "/contact", "/shipping-estimate"].includes(location.pathname) ? "bg-blue-50 text-[#0B56D9]" : "text-slate-600 hover:bg-slate-50 hover:text-[#0B56D9]"}`}
                    aria-expanded={servicesMenuOpen}
                  >
                    Services <ChevronDown className={`size-4 transition-transform ${servicesMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {servicesMenuOpen && (
                    <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2">
                      <Link to="/#track-shipment" onClick={() => setServicesMenuOpen(false)} className="block rounded-xl px-3 py-3 transition-colors hover:bg-blue-50">
                        <span className="block text-sm font-extrabold text-[#0A1931]">Track a shipment</span>
                        <span className="mt-0.5 block text-xs text-slate-500">Check your cargo status in real time.</span>
                      </Link>
                      <Link to="/shipping-estimate" onClick={() => setServicesMenuOpen(false)} className="block rounded-xl px-3 py-3 transition-colors hover:bg-blue-50">
                        <span className="block text-sm font-extrabold text-[#0A1931]">Get shipping estimate</span>
                        <span className="mt-0.5 block text-xs text-slate-500">Send details and receive a verified quote.</span>
                      </Link>
                      <Link to="/nri" onClick={() => setServicesMenuOpen(false)} className="block rounded-xl px-3 py-3 transition-colors hover:bg-blue-50">
                        <span className="block text-sm font-extrabold text-[#0A1931]">NRI services</span>
                        <span className="mt-0.5 block text-xs text-slate-500">Shop, consolidate and ship from India.</span>
                      </Link>
                      <Link to="/contact" onClick={() => setServicesMenuOpen(false)} className="block rounded-xl px-3 py-3 transition-colors hover:bg-blue-50">
                        <span className="block text-sm font-extrabold text-[#0A1931]">Contact us</span>
                        <span className="mt-0.5 block text-xs text-slate-500">Speak to the Pick O Pick team.</span>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>

              {/* Right */}
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                >
                  <ShoppingCart className="size-6 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-50 md:hidden"
                  aria-label="Toggle navigation"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>

                {/* USER MENU */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50 sm:px-4"
                  >
                    <div className="size-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="size-5 text-white" />
                    </div>
                    <span className="hidden md:block font-medium">
                     Hi, {user?.firstName || "User"}
                    </span>
                    <ChevronDown className="size-4" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                      >
                        <User className="size-5" />My Profile
                      </Link>
                      <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                      >
                        <Home className="size-5" /> Products
                      </Link>
                 
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                      >
                        <Package className="size-5" /> Orders
                      </Link>

                      <Link
                        to="/addresses"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                      >
                        <MapPin className="size-5" /> Addresses
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="size-5" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {mobileMenuOpen && (
            <nav className="border-t border-slate-100 bg-white px-4 py-3 md:hidden" aria-label="Signed-in mobile navigation">
              <div className="mx-auto flex max-w-7xl flex-col gap-1">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`rounded-lg px-3 py-2.5 text-sm font-bold ${location.pathname === "/" ? "bg-blue-50 text-[#0B56D9]" : "text-slate-700 hover:bg-slate-50"}`}>Shop</Link>
                <p className="px-3 pt-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Services</p>
                <Link to="/#track-shipment" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Track a shipment</Link>
                <Link to="/shipping-estimate" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Get shipping estimate</Link>
                <Link to="/nri" onClick={() => setMobileMenuOpen(false)} className={`rounded-lg px-3 py-2.5 text-sm font-bold ${location.pathname === "/nri" ? "bg-blue-50 text-[#0B56D9]" : "text-slate-700 hover:bg-slate-50"}`}>NRI Services</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={`rounded-lg px-3 py-2.5 text-sm font-bold ${location.pathname === "/contact" ? "bg-blue-50 text-[#0B56D9]" : "text-slate-700 hover:bg-slate-50"}`}>Contact Us</Link>
              </div>
            </nav>
          )}
        </header>
      ) : (
        //  HERO NAVBAR
        <Navbar />
      )}

      {/* MAIN */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
