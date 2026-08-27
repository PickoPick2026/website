import { useState } from 'react';
import { ArrowRight, MapPin, Phone, Mail, UserRound, ShieldCheck } from 'lucide-react';
import { CalculateShippingModal } from './CalculateShippingModal';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

export function CTA() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <section id="contact" className="bg-[#F7F9FF] px-4 py-12 sm:py-16">
      <div
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#0B56D9] bg-cover bg-center px-5 py-10 text-center sm:px-10 sm:py-14"
        style={{ backgroundImage: "url('/images/nri-cta-closer-v1.png')" }}
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Ready to shop globally?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base font-normal leading-relaxed text-blue-50 sm:text-lg">
            Create your free PickoPick account today and get your virtual Indian shipping address instantly.
          </p>

          {/* Primary and Secondary CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50 sm:w-auto"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsLoginOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white bg-[#0B56D9] px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#0849B7] sm:w-auto"
            >
              <span>Login</span>
              <UserRound className="h-4 w-4" />
            </button>
          </div>

          {/* Contact Channels: Address, Phone, Email */}
          <div className="mt-10 grid grid-cols-1 gap-4 border-t border-white/30 pt-10 text-xs sm:grid-cols-3">
            <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 p-4 text-left text-white">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-white">Head Office</span>
                <span className="font-bold">Pickopick Private Limited</span>
                <span className="block text-blue-100">
                  No : 49 &amp; 51, 2nd Sector, Thiru Vi Ka Industrial Estate, Guindy, Chennai - 600032
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 p-4 text-left text-white">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-white">Direct Phone Desk</span>
                <span className="block font-bold">9790 361 222</span>
                <span className="block text-blue-100">9003 715 617</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/10 p-4 text-left text-white">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-white">Email Inquiries</span>
                <a href="mailto:sales@pickopick.com" className="font-bold hover:underline">sales@pickopick.com</a>
                <span className="block text-blue-100 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Secure &amp; responsive support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CalculateShippingModal 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />

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
    </section>
  );
}