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
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-lg flex items-center justify-center">
                <Package size={40} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                PickoPick
              </span>
              </Link>

              {/* Right */}
              <div className="flex items-center gap-4">
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

                {/* USER MENU */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
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
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2">
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
                 
                 {/* 
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                      >
                        <Package className="size-5" /> Orders
                      </Link>
                      */}

                      <Link
                        to="/addresses"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                      >
                        <MapPin className="size-5" /> Addresses
                      </Link>

                      <Link
                        to="/wallet"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                      >
                        <Wallet className="size-5" /> Wallet
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