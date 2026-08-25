import React, { useState } from 'react';
import { 
  Headphones, 
  MessageSquare, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Globe2, 
  User, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface FreeConsultationModuleProps {
  onSuccessBooked?: (id: string) => void;
}

export const FreeConsultationModule: React.FC<FreeConsultationModuleProps> = ({
  onSuccessBooked,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    currentCountry: 'USA',
    email: '',
    requirementHelp: '',
    preferredDate: '',
    preferredTime: 'Evening (IST)',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    consultationId: string;
    whatsappUrl: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.whatsappNumber.trim()) {
      setErrorMessage('Please provide your name and WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/nri-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: 'consultation', payload: formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit consultation');

      setSubmittedResult({
        consultationId: data.requestId,
        whatsappUrl: data.whatsappUrl,
      });

      if (onSuccessBooked) onSuccessBooked(data.requestId);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="consultation-section" className="py-16 sm:py-20 bg-[#0A1931] text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Concierge Value Proposition */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#FF6321] text-xs font-bold uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" />
              NRI Concierge Advisory Desk
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Not Sure What You Need?
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Tell us what you're planning to send or source. Our team will help you choose the right option before you book.
            </p>

            <div className="space-y-3 pt-3">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-[#FF6321]/20 text-[#FF6321] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Customs and restricted items guidance (spices, liquids, gold, medicines).</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-[#FF6321]/20 text-[#FF6321] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Volumetric packaging advice to save up to 70% freight charges.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-[#FF6321]/20 text-[#FF6321] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Sourcing coordination for Indian ethnic wear and regional sweets.</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-400 pt-2 italic">
              No commitment. Just clear guidance.
            </p>
          </div>

          {/* Right Column: Interactive Consultation Booking Card */}
          <div className="lg:col-span-7 bg-[#102342] rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
            {submittedResult ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Consultation Request Confirmed
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your reference ID is <span className="font-mono font-bold text-[#FF6321]">{submittedResult.consultationId}</span>. Our NRI coordinator will message or call you on WhatsApp.
                </p>
                <div className="pt-3">
                  <a
                    href={submittedResult.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Connect Immediately on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-extrabold text-white pb-2 border-b border-slate-700/80">
                  Schedule Free 1-on-1 Consultation Call
                </h3>

                {errorMessage && (
                  <p className="text-xs font-semibold text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                    {errorMessage}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Iyer"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0A1931] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      WhatsApp Number (with Country Code) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 408 555 0199"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0A1931] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Current Country of Residence
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. USA, UK, UAE, Canada, Australia"
                      value={formData.currentCountry}
                      onChange={(e) => setFormData({ ...formData, currentCountry: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0A1931] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0A1931] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    What do you need help with?
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Planning to ship 15kg sweets and bridal clothes from Bengaluru to London before Diwali..."
                    value={formData.requirementHelp}
                    onChange={(e) => setFormData({ ...formData, requirementHelp: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#0A1931] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#FF6321]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Preferred Consultation Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0A1931] border border-slate-700 text-white text-xs focus:outline-none focus:border-[#FF6321]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Preferred Time Window
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#0A1931] border border-slate-700 text-white text-xs focus:outline-none focus:border-[#FF6321]"
                    >
                      <option value="Morning (09:00 AM - 12:00 PM IST)">Morning (09:00 AM - 12:00 PM IST)</option>
                      <option value="Afternoon (12:00 PM - 04:00 PM IST)">Afternoon (12:00 PM - 04:00 PM IST)</option>
                      <option value="Evening (04:00 PM - 08:00 PM IST)">Evening (04:00 PM - 08:00 PM IST)</option>
                      <option value="US/Canada Evening Friendly (09:00 PM - 11:30 PM IST)">US/Canada Evening Friendly (09:00 PM - 11:30 PM IST)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3.5 px-6 rounded-full bg-[#FF6321] hover:bg-orange-600 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#FF6321]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Booking Consultation...</span>
                  ) : (
                    <>
                      <span>BOOK MY FREE CONSULTATION</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
