import React from 'react';
import { 
  ArrowRight, 
  CalendarCheck2, 
  MessageSquare, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Globe2, 
  Sparkles 
} from 'lucide-react';

interface FinalCtaSectionProps {
  onOpenConsultation: () => void;
  onStartBooking: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onOpenConsultation,
  onStartBooking,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#0A1931] text-white py-18 sm:py-24">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6321]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center relative z-10 space-y-7">
        
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#FF6321] text-xs font-bold uppercase tracking-wider border border-white/15">
          <Sparkles className="w-3.5 h-3.5" />
          Bringing India Closer To You
        </span>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          India Is Closer Than You Think.
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
          Tell us what you need from India. Weâ€™ll take care of the rest.
        </p>

        {/* Primary and Secondary CTA buttons */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#0A1931] hover:bg-slate-100 font-extrabold text-xs tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>BOOK FREE CONSULTATION</span>
            <ArrowRight className="w-4 h-4 text-[#FF6321]" />
          </button>

          <button
            onClick={onStartBooking}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF6321] hover:bg-orange-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-[#FF6321]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>SCHEDULE YOUR PICKUP</span>
            <CalendarCheck2 className="w-4 h-4" />
          </button>
        </div>

        {/* Contact Channels: WhatsApp, Call, Email */}
        <div className="pt-10 mt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          <a
            href="https://wa.me/919876543210?text=Hello%20Pick%20O%20Pick!%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-3 transition-colors text-slate-200 hover:text-white"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">WhatsApp Concierge</span>
              <span className="font-bold">+91 98765 43210</span>
            </div>
          </a>

          <a
            href="tel:+919876543210"
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-3 transition-colors text-slate-200 hover:text-white"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Direct Phone Desk</span>
              <span className="font-bold">+91 (80) 4123-8899</span>
            </div>
          </a>

          <a
            href="mailto:support@pickopick.com"
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-3 transition-colors text-slate-200 hover:text-white"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FF6321]/20 text-[#FF6321] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Email Inquiries</span>
              <span className="font-bold">nri@pickopick.com</span>
            </div>
          </a>

        </div>

      </div>
    </section>
  );
};
