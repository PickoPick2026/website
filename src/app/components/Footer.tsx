import { MapPin, Phone } from 'lucide-react';
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <a href="#" className="inline-block mb-6">
              <img
                src="/PICKLogo.png"
                alt="PickoPick"
                className="w-[150px] sm:w-[180px] object-contain"
              />
            </a>
            <p className="mb-6 max-w-sm text-sm leading-relaxed">
              Your premium global logistics partner. Buy from any Indian store and we'll ship it to your doorstep anywhere in the world.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-800 hover:text-white transition-colors" aria-label="Twitter">X</a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-800 hover:text-white transition-colors" aria-label="LinkedIn">in</a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-800 hover:text-white transition-colors" aria-label="Instagram">ig</a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-5">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Personal Shopper</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Package Consolidation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">International Shipping</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">B2B Logistics</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-5">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/prohibited" className="hover:text-blue-400 transition-colors">Prohibited Items</Link></li>
              <li><Link to="/refund" className="hover:text-blue-400 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Address & Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5">Contact</h4>
            <Link to="/contact" className="mb-4 inline-block text-sm font-semibold text-blue-400 transition-colors hover:text-white">Contact our team</Link>
            <p className="text-sm leading-relaxed mb-4">
              Pickopick Private Limited <br />
              No : 49 & 51, 2nd Sector <br />
              Thiru Vi Ka Industrial Estate, Guindy <br />
              Chennai - 600032
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-blue-400" />
                <span>Guindy, Chennai, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-blue-400" />
                <a href="tel:+919790361222" className="hover:text-blue-400 transition-colors">
                  +91 97903 61222
                </a>
              </li>
              <li className="flex items-center gap-2 pl-6">
                <a href="tel:+919003715617" className="hover:text-blue-400 transition-colors">
                  +91 90037 15617
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} PickoPick. All rights reserved.</p>
          <span>Made with precision for global commerce.</span>
        </div>
      </div>
    </footer>
  );
}
