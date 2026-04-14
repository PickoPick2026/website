import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Menu, X } from 'lucide-react';
import { RegisterModal } from './RegisterModal';
import { LoginModal } from './LoginModal';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Shop Directory', href: '#shop-directory' },
  { name: 'Track Shipment', href: '#track-shipment' },
  { name: 'Search by Image', href: '#search-by-image' },
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
  { name: 'Exclusive', href: '#shop-directory', highlight: true }, // ✅ NEW
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));

    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
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

            {/* ✅ LOGO */}
            {/* <div className="flex items-center">
              <img
                src="/PICKLogo.png"
                alt="PickoPick"
                className="h-10 sm:h-12 md:h-14 object-contain"
              />
            </div> */}

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
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
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-white"
              >
                Login
              </button>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="bg-white px-6 py-2 rounded-full font-bold"
              >
                Register
              </button>
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
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

      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
