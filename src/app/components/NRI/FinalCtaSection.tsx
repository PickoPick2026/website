import React from 'react';
import { 
  ArrowRight, 
  CalendarCheck2, 
  MessageSquare, 
  Phone, 
  Mail
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
    <section className="bg-[#F7F9FF] px-4 py-12 text-white sm:py-16">
      <div
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#0B56D9] bg-cover bg-center px-5 py-10 text-center sm:px-10 sm:py-14"
        style={{ backgroundImage: "url('/images/nri-cta-closer-v1.png')" }}
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            India is closer than you think.
          </h2>

          <p className="mx-auto max-w-xl text-base font-normal leading-relaxed text-blue-50 sm:text-lg">
            Tell us what you need from India. We'll take care of the rest.
          </p>

          {/* Primary and Secondary CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 pt-3 sm:flex-row">
          <button
            onClick={onOpenConsultation}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50 sm:w-auto"
          >
            <span>BOOK FREE CONSULTATION</span>
            <ArrowRight className="w-4 h-4 text-[#FF6321]" />
          </button>

          <button
            onClick={onStartBooking}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white bg-[#0B56D9] px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#0849B7] sm:w-auto"
          >
            <span>SCHEDULE YOUR PICKUP</span>
            <CalendarCheck2 className="w-4 h-4" />
          </button>
          </div>

          {/* Contact Channels: WhatsApp, Call, Email */}
          <div className="mt-10 grid grid-cols-1 gap-4 border-t border-white/30 pt-10 text-xs sm:grid-cols-3">
          
          <a
            href="https://wa.me/919876543210?text=Hello%20Pick%20O%20Pick!%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 p-4 text-white transition-colors hover:bg-white/20"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-bold uppercase text-white">WhatsApp Concierge</span>
              <span className="font-bold">+91 98765 43210</span>
            </div>
          </a>

          <a
            href="tel:+919876543210"
            className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 p-4 text-white transition-colors hover:bg-white/20"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-bold uppercase text-white">Direct Phone Desk</span>
              <span className="font-bold">+91 (80) 4123-8899</span>
            </div>
          </a>

          <a
            href="mailto:support@pickopick.com"
            className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 p-4 text-white transition-colors hover:bg-white/20"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white">
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-bold uppercase text-white">Email Inquiries</span>
              <span className="font-bold">nri@pickopick.com</span>
            </div>
          </a>

          </div>
        </div>

      </div>
    </section>
  );
};
