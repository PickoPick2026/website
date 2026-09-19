import { useState } from "react";
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  UserRound,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { CalculateShippingModal } from "./CalculateShippingModal";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";

export function CTA() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <section
      id="contact"
      className="bg-[#F7F9FF] px-4 py-16 sm:py-20 scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Main Conversion Banner */}
        <div
          className="relative overflow-hidden rounded-3xl bg-[#0B56D9] px-6 py-12 text-center text-white shadow-xl shadow-blue-900/15 sm:px-12 sm:py-16"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at top right, rgba(255, 99, 33, 0.22), transparent 50%), radial-gradient(ellipse at bottom left, rgba(14, 165, 233, 0.3), transparent 60%)",
          }}
        >
          {/* Subtle patterned overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Virtual Indian Address • Free Forever</span>
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Ready to shop from India?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
              Create your free PickoPick account today. Unlock your virtual
              Indian warehouse locker, consolidate multiple orders, and enjoy
              worldwide doorstep delivery to 200+ countries.
            </p>

            {/* Value Highlights */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 font-semibold text-white backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> 0
                Registration Fee
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 font-semibold text-white backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> Free
                Indian Locker
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 font-semibold text-white backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> 30
                Days Free Storage
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 font-semibold text-white backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> Safe
                Global Delivery
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] shadow-lg shadow-black/10 transition-all hover:bg-blue-50 hover:shadow-xl sm:w-auto"
              >
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white sm:w-auto"
              >
                <span>Login</span>
                <UserRound className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Reach Support & Contact Desk */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-start justify-between gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B56D9]">
                Global Support Hub
              </span>
              <h3 className="text-xl font-extrabold text-[#0A1931]">
                Need help or have custom requests?
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <Clock className="h-3.5 w-3.5" /> Support Desk Active
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Address */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30">
              <div className="flex items-center gap-2.5 text-[#0B56D9]">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Head Office
                </span>
              </div>
              <div className="mt-3">
                <p className="font-extrabold text-xs text-[#0A1931]">
                  Pickopick Private Limited
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  No: 49 &amp; 51, 2nd Sector, Thiru Vi Ka Industrial Estate,
                  Guindy, Chennai - 600032
                </p>
              </div>
            </div>

            {/* Direct Phone */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30">
              <div className="flex items-center gap-2.5 text-[#0B56D9]">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Direct Phone Desk
                </span>
              </div>
              <div className="mt-3 space-y-1">
                <a
                  href="tel:+919790361222"
                  className="block text-xs font-extrabold text-[#0A1931] hover:text-[#0B56D9]"
                >
                  +91 9790 361 222
                </a>
                <a
                  href="tel:+919003715617"
                  className="block text-xs font-semibold text-slate-500 hover:text-[#0B56D9]"
                >
                  +91 9003 715 617
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30">
              <div className="flex items-center gap-2.5 text-[#0B56D9]">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Email Inquiries
                </span>
              </div>
              <div className="mt-3">
                <a
                  href="mailto:sales@pickopick.com"
                  className="text-xs font-extrabold text-[#0A1931] hover:text-[#0B56D9] hover:underline"
                >
                  sales@pickopick.com
                </a>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  Verified &amp; responsive support
                </p>
              </div>
            </div>

            {/* WhatsApp Quick Chat */}
            <div className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                  WhatsApp Concierge
                </span>
              </div>
              <div className="mt-3">
                <a
                  href="https://wa.me/919790361222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 hover:underline"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <p className="mt-1 text-[11px] text-emerald-700">
                  Instant quotes &amp; order updates
                </p>
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
