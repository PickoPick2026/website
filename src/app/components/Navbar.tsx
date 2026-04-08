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
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav className={`pointer-events-auto w-full transition-all duration-300 ${isScrolled ? 'bg-gradient-to-r from-blue-600/95 to-indigo-800/95 backdrop-blur-md shadow-lg py-3 border-b border-white/10' : 'bg-gradient-to-r from-blue-600 to-indigo-800 py-5 shadow-xl'}`}>
          <div className="px-6 flex items-center justify-between">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={`relative font-semibold text-base whitespace-nowrap transition-all
                  ${link.highlight 
                    ? 'text-yellow-300 animate-pulse' 
                    : 'text-white/90 hover:text-white'
                  }`}
              >
               {link.name}
                {link.highlight && (
                  <>
                    <img src="/icons/fire.gif" className="w-4 h-4 inline ml-1" />
                    <span className="ml-1 text-xs bg-yellow-400 text-black px-1 rounded">
                      NEW
                    </span>
                  </>
                )}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-6 ml-auto">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-white font-bold text-sm">{user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-white/60 hover:text-white text-xs font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
                <button 
                  onClick={() => setIsRegisterOpen(true)}
                  className="relative overflow-hidden rounded-full bg-white px-8 py-3 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 text-base">
                      Register Now
                    </span>
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      className="inline-block text-indigo-600"
                    >
                      →
                    </motion.span>
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <span className="font-bold text-xl text-white">PickoPick</span>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-blue-600/95 backdrop-blur-md border-t border-white/10 overflow-hidden rounded-b-2xl"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="text-white/90 hover:text-white font-semibold py-2"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{user.name}</span>
                          <span className="text-white/60 text-xs">{user.email}</span>
                        </div>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="bg-white/10 text-white px-6 py-3 rounded-full font-bold text-center hover:bg-white/20 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setIsLoginOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 text-white/90 hover:text-white font-semibold py-2"
                      >
                        <LogIn size={18} />
                        <span>Login</span>
                      </button>
                      <button 
                        onClick={() => {
                          setIsRegisterOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="bg-white px-6 py-3 rounded-full font-bold text-center hover:scale-[1.02] transition-transform shadow-lg shadow-blue-900/20"
                      >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 text-base">
                          Register Now
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>

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
