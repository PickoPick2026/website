import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calculator, ChevronDown, ContactRound, MapPinned, Menu, PackageCheck, ScanSearch, ShoppingBag, UserRound, X } from 'lucide-react';
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
  ] },
  { name: 'Company', links: [
    { name: 'About Pick O Pick', href: '#about', description: 'Learn about our India-to-world service.', icon: UserRound },
    { name: 'Contact Us', href: '/contact', description: 'Speak with our support team.', icon: ContactRound },
  ] },
];

const globalOffices = [
  { country: 'Singapore', location: 'Singapore Operations Desk' },
  { country: 'United Kingdom', location: 'London, United Kingdom' },
  { country: 'Dubai', location: 'Dubai, United Arab Emirates' },
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

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
    if (href.startsWith('/')) return navigate(href);
    if (location.pathname !== '/') return navigate(`/${href}`);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', href);
  };

  const handleEstimate = () => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
    navigate('/shipping-estimate');
  };

  const activeGroup = navGroups.find((group) => group.name === activeMenu);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <nav
          className="relative w-full border-b border-slate-200 bg-white"
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="flex h-[68px] items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-6">
            <a href="#home" onClick={(event) => handleNavigation(event, '#home')} className="flex shrink-0 items-center" aria-label="Pick O Pick home">
              <img src="/PICKLogo.png" alt="Pick O Pick" className="h-11 w-auto object-contain sm:h-12" />
            </a>

            <div className="hidden h-full items-center gap-1 lg:flex">
              <a href="#home" onClick={(event) => handleNavigation(event, '#home')} className="rounded-lg px-3 py-2 text-sm font-bold text-[#0A1931] transition-colors hover:bg-blue-50 hover:text-[#0B56D9]">Home</a>
              {navGroups.map((group) => (
                <button
                  key={group.name}
                  type="button"
                  onMouseEnter={() => setActiveMenu(group.name)}
                  onFocus={() => setActiveMenu(group.name)}
                  onClick={() => setActiveMenu((current) => current === group.name ? null : group.name)}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${activeMenu === group.name ? 'bg-blue-50 text-[#0B56D9]' : 'text-[#0A1931] hover:bg-blue-50 hover:text-[#0B56D9]'}`}
                  aria-expanded={activeMenu === group.name}
                >
                  {group.name}<ChevronDown className={`h-4 w-4 transition-transform ${activeMenu === group.name ? 'rotate-180' : ''}`} />
                </button>
              ))}
              <a href="/nri" onClick={(event) => handleNavigation(event, '/nri')} className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${location.pathname === '/nri' ? 'bg-[#0B56D9] text-white' : 'text-[#0A1931] hover:bg-blue-50 hover:text-[#0B56D9]'}`}>NRI Services</a>
              <button type="button" onMouseEnter={() => setActiveMenu('Global Offices')} onFocus={() => setActiveMenu('Global Offices')} onClick={() => setActiveMenu((current) => current === 'Global Offices' ? null : 'Global Offices')} className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${activeMenu === 'Global Offices' ? 'bg-blue-50 text-[#0B56D9]' : 'text-[#0A1931] hover:bg-blue-50 hover:text-[#0B56D9]'}`} aria-expanded={activeMenu === 'Global Offices'}>
                Global Offices <ChevronDown className={`h-4 w-4 transition-transform ${activeMenu === 'Global Offices' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <button onClick={handleEstimate} className="inline-flex items-center gap-1.5 rounded-full border border-[#0B56D9] px-3.5 py-2.5 text-[10px] font-extrabold uppercase tracking-wide text-[#0B56D9] transition-colors hover:bg-blue-50">
                <Calculator className="h-3.5 w-3.5" /> Get estimate
              </button>
              <button onClick={() => setIsLoginOpen(true)} className="rounded-full bg-[#0B56D9] px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7]">Log in</button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={handleEstimate} className="rounded-full border border-[#0B56D9] px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide text-[#0B56D9]">Estimate</button>
              <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-[#0A1931]" aria-expanded={isMobileMenuOpen} aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}>
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
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0B56D9]"><MapPinned className="h-4 w-4" /></div>
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
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-slate-200 bg-white lg:hidden">
                <div className="space-y-5 px-4 py-5 sm:px-6">
                  <a href="#home" onClick={(event) => handleNavigation(event, '#home')} className="block text-sm font-extrabold text-[#0A1931]">Home</a>
                  {navGroups.map((group) => <div key={group.name}>
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0B56D9]">{group.name}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.links.map((link) => <a key={link.name} href={link.href} onClick={(event) => handleNavigation(event, link.href)} className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs font-bold text-[#0A1931]">{link.name}</a>)}
                    </div>
                  </div>)}
                  <a href="/nri" onClick={(event) => handleNavigation(event, '/nri')} className="block rounded-lg bg-blue-50 px-3 py-3 text-sm font-extrabold text-[#0B56D9]">NRI Services</a>
                  <div>
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0B56D9]">Global offices</p>
                    <div className="grid grid-cols-3 gap-2">
                      {globalOffices.map((office) => <div key={office.country} className="rounded-lg bg-slate-50 p-2.5"><p className="text-[11px] font-extrabold text-[#0A1931]">{office.country}</p><p className="mt-0.5 text-[10px] leading-snug text-slate-500">{office.location}</p></div>)}
                    </div>
                  </div>
                  <button onClick={handleEstimate} className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#0B56D9] px-3 py-3 text-[10px] font-extrabold uppercase text-[#0B56D9]"><Calculator className="h-3.5 w-3.5" />Get estimate</button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { setIsMobileMenuOpen(false); setIsLoginOpen(true); }} className="rounded-full bg-[#0B56D9] px-4 py-3 text-xs font-extrabold text-white">Log in</button>
                    <button onClick={() => { setIsMobileMenuOpen(false); setIsRegisterOpen(true); }} className="rounded-full bg-[#0B56D9] px-4 py-3 text-xs font-extrabold text-white">Get started</button>
                  </div>
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
