import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calculator, ChevronDown, ContactRound, Menu, PackageCheck, ScanSearch, ShoppingBag, UserRound, X } from 'lucide-react';
import { RegisterModal } from './RegisterModal';
import { LoginModal } from './LoginModal';
import { useLocation, useNavigate } from 'react-router-dom';

type NavLink = { name: string; href: string; description: string; icon: typeof ShoppingBag };
type NavGroup = { name: string; links: NavLink[] };

const navGroups: NavGroup[] = [
  { name: 'Shop from India', links: [
    { name: 'Shop Directory', href: '/shop', description: 'Browse stores and categories from India.', icon: ShoppingBag },
    { name: 'Search Marketplace', href: '/shop#shop-search', description: 'Search products, brands, and categories.', icon: ScanSearch },
    { name: 'Exclusive Finds', href: '/shop#exclusive', description: 'Discover curated Indian products.', icon: PackageCheck },
    { name: 'Get Shipping Estimate', href: '/shipping-estimate', description: 'Request a verified shipping quote.', icon: Calculator },
  ] },
  { name: 'Company', links: [
    { name: 'About Pick O Pick', href: '#about', description: 'Learn about our India-to-world service.', icon: UserRound },
    { name: 'Contact Us', href: '/contact', description: 'Speak with our support team.', icon: ContactRound },
  ] },
];

const globalOffices = [
  { country: 'Singapore', location: 'Singapore Operations Desk', flag: '/images/flags/sg.svg' },
  { country: 'United Kingdom', location: 'London, United Kingdom', flag: '/images/flags/gb.svg' },
  { country: 'Dubai', location: 'Dubai, United Arab Emirates', flag: '/images/flags/ae.svg' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' }), 80);
    }
  }, [location]);

  useEffect(() => {
    const openRegister = () => setIsRegisterOpen(true);
    window.addEventListener('pickopick:open-register', openRegister);
    return () => window.removeEventListener('pickopick:open-register', openRegister);
  }, []);

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
    if (href.startsWith('/')) return navigate(href);
    if (location.pathname !== '/') return navigate(`/${href}`);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', href);
  };

  const activeGroup = navGroups.find((group) => group.name === activeMenu);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <nav
          className="relative w-full border-b border-[#DE4D17] bg-[#FF6321]"
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-6">
            <a href="#home" onClick={(event) => handleNavigation(event, '#home')} className="flex shrink-0 items-center rounded-xl bg-white px-2 py-1" aria-label="Pick O Pick home">
              <img src="/PICKLogo.png" alt="Pick O Pick" className="h-9 w-auto object-contain sm:h-10" />
            </a>

            <div className="hidden h-full items-center gap-1 lg:flex">
              <a href="#home" onClick={(event) => handleNavigation(event, '#home')} className="rounded-lg px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white/15">Home</a>
              <a href="#track-shipment" onClick={(event) => handleNavigation(event, '#track-shipment')} className="rounded-lg px-3 py-2 text-sm font-extrabold text-white transition-colors hover:bg-white/15">Tracking</a>
              <a href="/nri" onClick={(event) => handleNavigation(event, '/nri')} className="rounded-full bg-[#0B56D9] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:bg-[#0B56D9]/90">NRI Services</a>
              <button type="button" onClick={() => setIsRegisterOpen(true)} className="group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#FF9F1C] via-[#FFD15A] to-[#FF9F1C] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-[#083B91] shadow-[0_4px_16px_rgba(255,193,61,0.35)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_7px_20px_rgba(255,193,61,0.5)]">
                <span className="buy-ship-shine pointer-events-none absolute inset-y-0 -left-12 w-8 -skew-x-12 bg-white/65 blur-sm group-hover:bg-white/85" />
                <span className="relative">Buy &amp; Ship</span>
              </button>
              <button type="button" onClick={() => navigate('/nri#booking-portal')} className="inline-flex items-center justify-center rounded-full  border-white/65 bg-white/10 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-[#0B56D9]">
                Order &amp; Send
              </button>
              {navGroups.map((group) => (
                <button
                  key={group.name}
                  type="button"
                  onMouseEnter={() => setActiveMenu(group.name)}
                  onFocus={() => setActiveMenu(group.name)}
                  onClick={() => setActiveMenu((current) => current === group.name ? null : group.name)}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${activeMenu === group.name ? 'bg-white text-[#0B56D9]' : 'text-white hover:bg-white/15'}`}
                  aria-expanded={activeMenu === group.name}
                >
                  {group.name}<ChevronDown className={`h-4 w-4 transition-transform ${activeMenu === group.name ? 'rotate-180' : ''}`} />
                </button>
              ))}
              <button type="button" onMouseEnter={() => setActiveMenu('Global Offices')} onFocus={() => setActiveMenu('Global Offices')} onClick={() => setActiveMenu((current) => current === 'Global Offices' ? null : 'Global Offices')} className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${activeMenu === 'Global Offices' ? 'bg-white text-[#0B56D9]' : 'text-white hover:bg-white/15'}`} aria-expanded={activeMenu === 'Global Offices'}>
                Global Offices <ChevronDown className={`h-4 w-4 transition-transform ${activeMenu === 'Global Offices' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <button onClick={() => setIsRegisterOpen(true)} className="rounded-full bg-white px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-[#0B56D9] transition-colors hover:bg-blue-50">Register</button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={() => setIsRegisterOpen(true)} className="rounded-full bg-white px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide text-[#0B56D9]">Register</button>
              <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/70 text-white" aria-expanded={isMobileMenuOpen} aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {(activeGroup || activeMenu === 'Global Offices') && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.16 }} className="absolute inset-x-0 top-full hidden border-b border-slate-200 bg-white lg:block">
                {activeMenu === 'Global Offices' ? (
                  <div className="mx-auto grid max-w-6xl grid-cols-[0.85fr_2fr] gap-8 px-8 py-7">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0B56D9]">Our global offices</p>
                      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A1931]">Local support, globally connected.</h2>
                      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">Connect with the Pick O Pick team from our international service locations.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {globalOffices.map((office) => <div key={office.country} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex h-9 w-11 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white"><img src={office.flag} alt={`${office.country} flag`} className="h-full w-full object-cover" /></div>
                        <p className="mt-4 text-sm font-extrabold text-[#0A1931]">{office.country}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{office.location}</p>
                      </div>)}
                    </div>
                  </div>
                ) : activeGroup && <div className="mx-auto grid max-w-6xl grid-cols-[0.85fr_2fr] gap-8 px-8 py-7">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0B56D9]">Explore</p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A1931]">{activeGroup.name}</h2>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">Everything you need to shop, ship, and receive from India with confidence.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {activeGroup.links.map((link) => {
                      const Icon = link.icon;
                      return <a key={link.name} href={link.href} onClick={(event) => handleNavigation(event, link.href)} className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-blue-50">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0B56D9] group-hover:bg-white"><Icon className="h-4 w-4" /></div>
                        <p className="mt-4 text-sm font-extrabold text-[#0A1931]">{link.name}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{link.description}</p>
                      </a>;
                    })}
                  </div>
                </div>}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-white/30 bg-[#FF6321] lg:hidden">
                <div className="space-y-5 px-4 py-5 sm:px-6">
                  <a href="#home" onClick={(event) => handleNavigation(event, '#home')} className="block text-sm font-extrabold text-white">Home</a>
                  <a href="#track-shipment" onClick={(event) => handleNavigation(event, '#track-shipment')} className="block text-sm font-extrabold text-white">Tracking</a>
                  {navGroups.map((group) => <div key={group.name}>
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">{group.name}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.links.map((link) => <a key={link.name} href={link.href} onClick={(event) => handleNavigation(event, link.href)} className="rounded-lg bg-white/15 px-3 py-2.5 text-xs font-bold text-white">{link.name}</a>)}
                    </div>
                  </div>)}
                  <a href="/nri" onClick={(event) => handleNavigation(event, '/nri')} className="block rounded-lg bg-white px-3 py-3 text-sm font-extrabold text-[#0B56D9]">NRI Services</a>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => { setIsMobileMenuOpen(false); setIsRegisterOpen(true); }} className="rounded-lg bg-white px-3 py-3 text-xs font-extrabold text-[#0B56D9]">Buy &amp; Ship</button>
                    <button type="button" onClick={() => { setIsMobileMenuOpen(false); navigate('/nri#booking-portal'); }} className="rounded-lg border border-white/60 px-3 py-3 text-xs font-extrabold text-white">Order &amp; Send</button>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">Global offices</p>
                    <div className="grid grid-cols-3 gap-2">
                      {globalOffices.map((office) => <div key={office.country} className="rounded-lg bg-slate-50 p-2.5"><div className="flex items-center gap-1.5"><img src={office.flag} alt="" className="h-3.5 w-5 rounded-[2px] border border-slate-200 object-cover" /><p className="text-[11px] font-extrabold text-[#0A1931]">{office.country}</p></div><p className="mt-1 text-[10px] leading-snug text-slate-500">{office.location}</p></div>)}
                    </div>
                  </div>
                  <button onClick={() => { setIsMobileMenuOpen(false); setIsRegisterOpen(true); }} className="w-full rounded-full bg-white px-4 py-3 text-xs font-extrabold text-[#0B56D9]">Register</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onLoginClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onRegisterClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} />
    </>
  );
}
