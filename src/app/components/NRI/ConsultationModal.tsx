import React, { useMemo, useState } from 'react';
import { CheckCircle2, Headphones, MessageSquare, X } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRY_CODES = [
  { value: '+1', label: 'USA / Canada (+1)' }, { value: '+44', label: 'United Kingdom (+44)' },
  { value: '+971', label: 'UAE (+971)' }, { value: '+65', label: 'Singapore (+65)' },
  { value: '+61', label: 'Australia (+61)' }, { value: '+91', label: 'India (+91)' },
  { value: '+41', label: 'Switzerland (+41)' }, { value: '+49', label: 'Germany (+49)' },
];

const TIME_ZONES = ['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Singapore', 'Australia/Sydney', 'Asia/Kolkata'];
const TIME_SLOTS = [
  { value: 'morning', label: 'Morning · 9:00 AM – 12:00 PM' },
  { value: 'afternoon', label: 'Afternoon · 12:00 PM – 3:00 PM' },
  { value: 'evening', label: 'Evening · 5:00 PM – 8:00 PM' },
];

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [formData, setFormData] = useState({
    fullName: '', mobileCountryCode: '', mobileNumber: '', whatsappCountryCode: '', whatsappNumber: '',
    currentCountry: '', preferredDate: '', preferredTime: '', timezone: detectedTimezone,
    email: '', requirementHelp: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ consultationId: string; whatsappUrl: string; emailSent: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timezones = useMemo(() => Array.from(new Set([...TIME_ZONES, detectedTimezone])).sort(), [detectedTimezone]);

  if (!isOpen) return null;

  const update = (key: keyof typeof formData, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));
  const selectedSlot = TIME_SLOTS.find((slot) => slot.value === formData.preferredTime);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.mobileCountryCode || !formData.whatsappCountryCode) {
      setError('Please select a country code for both mobile and WhatsApp numbers.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        mobileNumber: `${formData.mobileCountryCode}${formData.mobileNumber.trim()}`,
        whatsappNumber: `${formData.whatsappCountryCode}${formData.whatsappNumber.trim()}`,
        preferredTime: selectedSlot ? `${selectedSlot.label} (${formData.timezone})` : '',
      };
      const response = await fetch('/api/nri-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestType: 'consultation', payload }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to book your consultation.');
      setResult({ consultationId: data.requestId, whatsappUrl: data.whatsappUrl, emailSent: Boolean(data.emailSent) });
    } catch (submissionError: any) {
      setError(submissionError.message || 'We could not save your request. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white sm:rounded-3xl">
        <style>{`.input { width: 100%; border: 1px solid #cbd5e1; border-radius: .75rem; padding: .75rem; font-size: .75rem; font-weight: 500; color: #0A1931; outline: none; background: #fff; } .input:focus { border-color: #0B56D9; box-shadow: 0 0 0 3px rgb(11 86 217 / .12); }`}</style>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B56D9]"><Headphones className="h-5 w-5" /></div><div><h3 className="text-base font-extrabold text-[#0A1931]">Book Free Shipping Consultation</h3><p className="text-[11px] text-slate-500">Choose a time in your own timezone.</p></div></div>
          <button onClick={onClose} aria-label="Close consultation form" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 sm:p-6">
          {result ? <div className="space-y-4 py-6 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 className="h-7 w-7" /></div><h4 className="text-lg font-extrabold text-[#0A1931]">Consultation booked successfully</h4><p className="text-xs leading-relaxed text-slate-600">Reference ID: <span className="font-mono font-bold text-[#0B56D9]">{result.consultationId}</span>. {result.emailSent ? 'Your confirmation email is on its way.' : 'Our concierge team will confirm by WhatsApp.'}</p><a href={result.whatsappUrl} target="_blank" rel="noreferrer" className="mx-auto flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700"><MessageSquare className="h-4 w-4" />Open WhatsApp</a></div> :
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</p>}
              <Field label="Full name *"><input required value={formData.fullName} onChange={(e) => update('fullName', e.target.value)} className="input" autoComplete="name" /></Field>
              <Field label="Mobile number *"><PhoneInput code={formData.mobileCountryCode} number={formData.mobileNumber} onCode={(value) => update('mobileCountryCode', value)} onNumber={(value) => update('mobileNumber', value)} autoComplete="tel-national" /></Field>
              <Field label="WhatsApp number *"><PhoneInput code={formData.whatsappCountryCode} number={formData.whatsappNumber} onCode={(value) => update('whatsappCountryCode', value)} onNumber={(value) => update('whatsappNumber', value)} autoComplete="tel" /></Field>
              <Field label="Country of residence *"><input required value={formData.currentCountry} onChange={(e) => update('currentCountry', e.target.value)} className="input" autoComplete="country-name" /></Field>
              <Field label="Preferred date *"><input required type="date" min={new Date().toISOString().split('T')[0]} value={formData.preferredDate} onChange={(e) => update('preferredDate', e.target.value)} className="input" /></Field>
              <div className="grid gap-3 sm:grid-cols-2"><Field label="Your timezone *"><select required value={formData.timezone} onChange={(e) => update('timezone', e.target.value)} className="input">{timezones.map((timezone) => <option key={timezone} value={timezone}>{timezone.replace('_', ' ')}</option>)}</select></Field><Field label="Preferred time *"><select required value={formData.preferredTime} onChange={(e) => update('preferredTime', e.target.value)} className="input"><option value="">Select a time slot</option>{TIME_SLOTS.map((slot) => <option key={slot.value} value={slot.value}>{slot.label}</option>)}</select><p className="mt-1 text-[10px] text-slate-500">Times shown in {formData.timezone.replace('_', ' ')}.</p></Field></div>
              <Field label="Email ID *"><input required type="email" value={formData.email} onChange={(e) => update('email', e.target.value)} className="input" autoComplete="email" /></Field>
              <Field label="What would you like us to arrange from India?"><textarea rows={3} value={formData.requirementHelp} onChange={(e) => update('requirementHelp', e.target.value)} placeholder="For example: shopping links, homemade food, festive wear, documents or multiple packages." className="input resize-none" /></Field>
              <button disabled={isSubmitting} className="w-full rounded-full bg-[#0B56D9] px-5 py-3.5 text-xs font-extrabold tracking-wide text-white transition-colors hover:bg-[#0849B7] disabled:opacity-60">{isSubmitting ? 'Booking consultation…' : 'BOOK FREE CONSULTATION'}</button>
            </form>}
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700"><span className="mb-1.5 block">{label}</span>{children}</label>;
const PhoneInput: React.FC<{ code: string; number: string; onCode: (value: string) => void; onNumber: (value: string) => void; autoComplete: string }> = ({ code, number, onCode, onNumber, autoComplete }) => <div className="grid grid-cols-[minmax(145px,0.9fr)_1.1fr] gap-2"><select required value={code} onChange={(e) => onCode(e.target.value)} className="input"><option value="">Country code</option>{COUNTRY_CODES.map((country) => <option key={country.value} value={country.value}>{country.label}</option>)}</select><input required type="tel" inputMode="tel" value={number} onChange={(e) => onNumber(e.target.value)} className="input" autoComplete={autoComplete} /></div>;
