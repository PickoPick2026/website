import React, { useState } from 'react';
import { 
  Clock4, 
  Calendar, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { POPULAR_NRI_COUNTRIES } from './data/mockData';

export const BlockSlotModule: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    destinationCountry: 'USA',
    preferredDate: '',
    preferredTimeSlot: '11:00 AM â€“ 01:00 PM (Midday Slot B)',
    whatsappNumber: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultNotice, setResultNotice] = useState<{
    id: string;
    notice: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.preferredDate || !formData.whatsappNumber.trim()) {
      setError('Please select a preferred date and provide your WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/nri-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: 'slot_reservation', payload: formData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit slot reservation.');

      setResultNotice({
        id: data.requestId,
        notice: data.noticeText || 'Slot Request Received â€” Our team will confirm availability shortly.',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to reserve slot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="block-slot-section" className="py-16 sm:py-20 bg-[#F1F5F9] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Header */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-[#FF6321] text-xs font-bold uppercase tracking-wider">
                <Clock4 className="w-3.5 h-3.5 text-[#FF6321]" />
                Priority Dispatch Reservation
              </div>

              <h2 className="text-3xl font-extrabold text-[#0A1931] tracking-tight">
                Planning Ahead? Block Your Slot.
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Reserve your preferred pickup window while you finalise your package. We hold your priority dispatch slot for 48 hours without upfront payment.
              </p>

              <div className="pt-2 text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free cancellation or rescheduling anytime on WhatsApp.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Doorstep pickup vans equipped with calibrated weighing scales.</span>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-7">
              {resultNotice ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF6321] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0A1931]">
                    {resultNotice.notice}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Reservation Reference: <span className="font-mono font-bold text-[#0A1931]">{resultNotice.id}</span>. Our Indian dispatch hub will review vehicle routes and send slot confirmation via WhatsApp.
                  </p>
                  <button
                    onClick={() => setResultNotice(null)}
                    className="mt-3 px-5 py-2 rounded-full text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    Block Another Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Your Name (or Sender's Name):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Anjali Deshmukh"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Destination Country *
                      </label>
                      <select
                        value={formData.destinationCountry}
                        onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                      >
                        {POPULAR_NRI_COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Preferred Pickup Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Preferred Time Slot *
                      </label>
                      <select
                        value={formData.preferredTimeSlot}
                        onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                      >
                        <option value="09:00 AM â€“ 11:00 AM (Morning Slot A)">09:00 AM â€“ 11:00 AM (Morning Slot A)</option>
                        <option value="11:00 AM â€“ 01:00 PM (Midday Slot B)">11:00 AM â€“ 01:00 PM (Midday Slot B)</option>
                        <option value="01:00 PM â€“ 03:00 PM (Afternoon Slot C)">01:00 PM â€“ 03:00 PM (Afternoon Slot C)</option>
                        <option value="03:00 PM â€“ 05:00 PM (Evening Slot D)">03:00 PM â€“ 05:00 PM (Evening Slot D)</option>
                        <option value="05:00 PM â€“ 07:00 PM (Late Evening Slot E)">05:00 PM â€“ 07:00 PM (Late Evening Slot E)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      WhatsApp Number for Instant Confirmation *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 408 555 0199 or +91 98450 12345"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-full bg-[#FF6321] hover:bg-orange-600 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md shadow-[#FF6321]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Reserving Slot...</span>
                    ) : (
                      <>
                        <span>BLOCK MY SLOT</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
