import React from 'react';
import { 
  Package, 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  Globe2,
  Lock
} from 'lucide-react';

interface FooterProps {
  onOpenConsultation: () => void;
  onOpenEstimator: () => void;
  onScrollToSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenConsultation,
  onOpenEstimator,
  onScrollToSection,
}) => {
  return (
    <footer className="bg-[#0A1931] text-slate-400 text-xs border-t border-slate-800">
      
      {/* Upper Brand Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6321] text-white flex items-center justify-center font-black text-xl shadow-md">
              P
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-tight">PICK O PICK</span>
              <p className="text-[11px] text-[#FF6321] font-semibold">To Home From Your Home Town</p>
            </div>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
            Dedicated NRI shopping, sourcing, consolidation, heavy-duty packing, and door-to-door international express courier platform connecting global Indians to their hometowns.
          </p>

          <div className="pt-2 flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              FSSAI & Air Cargo Compliant
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-[11px]">
              <Lock className="w-4 h-4 text-[#FF6321]" />
              Secure Hub Storage
            </span>
          </div>
        </div>

        {/* NRI Services */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            NRI Services
          </h4>
          <ul className="space-y-2 text-slate-300">
            <li>
              <button onClick={() => onScrollToSection('services')} className="hover:text-[#FF6321] transition-colors cursor-pointer">
                Personal Shopping Concierge
              </button>
            </li>
            <li>
              <button onClick={() => onScrollToSection('services')} className="hover:text-[#FF6321] transition-colors cursor-pointer">
                Food & Homemade Snacks
              </button>
            </li>
            <li>
              <button onClick={() => onScrollToSection('services')} className="hover:text-[#FF6321] transition-colors cursor-pointer">
                Smart Multi-Seller Consolidation
              </button>
            </li>
            <li>
              <button onClick={() => onScrollToSection('services')} className="hover:text-[#FF6321] transition-colors cursor-pointer">
                Festive Sweets & Gifts
              </button>
            </li>
            <li>
              <button onClick={() => onScrollToSection('services')} className="hover:text-[#FF6321] transition-colors cursor-pointer">
                Personal Relocation & Luggage
              </button>
            </li>
            <li>
              <button onClick={() => onScrollToSection('services')} className="hover:text-[#FF6321] transition-colors cursor-pointer">
                B2B Bulk Export Cargo
              </button>
            </li>
          </ul>
        </div>

        {/* Major Destinations */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Express Corridors
          </h4>
          <ul className="space-y-2 text-slate-300">
            <li>India to USA (Dallas, Bay Area, NYC, NJ)</li>
            <li>India to United Kingdom (London, Midlands)</li>
            <li>India to UAE (Dubai, Abu Dhabi, Sharjah)</li>
            <li>India to Canada (Toronto, Vancouver, Calgary)</li>
            <li>India to Australia (Sydney, Melbourne)</li>
            <li>India to Singapore & Southeast Asia</li>
            <li>India to Germany & European Union</li>
          </ul>
        </div>

        {/* Indian Operations Hub */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Headquarters & Hub
          </h4>
          <div className="space-y-2 text-slate-300 text-xs leading-relaxed">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#FF6321] shrink-0 mt-0.5" />
              <span>
                Pick O Pick International Consolidation Hub, Logistics Park, Bengaluru & Mumbai, India
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>+91 98765 43210</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>nri@pickopick.com</span>
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-slate-800/80 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} PICK O PICK Logistics Private Limited. All rights reserved. “To Home From Your Home Town”</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Customs & Dangerous Goods Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
