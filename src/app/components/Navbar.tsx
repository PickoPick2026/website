import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { RegisterModal } from './RegisterModal';
import { LoginModal } from './LoginModal';
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Shop Directory', href: '#shop-directory' },
  { name: 'Track Shipment', href: '#track-shipment' },
  { name: 'Search by Image', href: '#search-by-image' },
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
  { name: 'Exclusive', href: '#shop-directory', highlight: true },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();
const navigate = useNavigate();

const handleHomeClick = () => {
  if (location.pathname !== "/") {
    navigate("/#home"); // go to home + scroll
  } else {
    const section = document.querySelector("#home");
    section?.scrollIntoView({ behavior: "smooth" });
  }
};

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <nav className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-gradient-to-r from-blue-600/95 to-indigo-800/95 backdrop-blur-md py-3'
            : 'bg-gradient-to-r from-blue-600 to-indigo-800 py-5'
        }`}>
          <div className="px-6 flex items-center justify-between">

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              <button
  onClick={handleHomeClick}
  className="text-white font-semibold"
>
  Home
</button>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`font-semibold ${
                    link.highlight
                      ? 'text-yellow-300 animate-pulse'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-6">
              <button onClick={() => setIsLoginOpen(true)} className="text-white">
                Login
              </button>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="bg-white px-6 py-2 rounded-full font-bold"
              >
                Register
              </button>
            </div>

            {/* ✅ MOBILE NAV (UPDATED) */}
            <div className="lg:hidden flex items-center gap-3">

              {/* Hamburger */}
              {/* <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button> */}

              {/* Show important links */}
              <button
                onClick={handleHomeClick}
                className="text-white text-sm font-semibold"
              >
                Home
              </button>
              <a
                href="#track-shipment"
                onClick={(e) => handleScrollTo(e, "#track-shipment")}
                className="text-white text-sm font-semibold"
              >
                Track
              </a>

              <a
                href="#shop-directory"
                onClick={(e) => handleScrollTo(e, "#shop-directory")}
                className="text-white text-sm font-semibold"
              >
                Shop
              </a>

              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-white text-sm font-semibold"
              >
                Login
              </button>

              <button
                onClick={() => setIsRegisterOpen(true)}
                className="text-white text-sm font-semibold"
              >
                Register
              </button>

            </div>
          </div>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="lg:hidden px-6 py-4"
              >
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="block py-2 text-white"
                  >
                    {link.name}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      <RegisterModal
  isOpen={isRegisterOpen}
  onClose={() => setIsRegisterOpen(false)}
  onLoginClick={() => {
    setIsRegisterOpen(false);   // close register
    setIsLoginOpen(true);       // open login
  }}
/>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}  onRegisterClick={() => {
          setIsLoginOpen(false);     // close login modal
          setIsRegisterOpen(true);   // open register modal
        }}/>
    </>
  );
}