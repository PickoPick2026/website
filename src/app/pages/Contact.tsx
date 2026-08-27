import { FormEvent, useState } from 'react';
import { Clock3, Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-[#F7F9FF] pt-[100px] sm:pt-[112px]">
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0B56D9]">Contact Pick O Pick</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0A1931] sm:text-5xl">We are here to help.</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">Talk to our India logistics team about shopping, pickup, consolidation, or international delivery.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <a href="tel:+919790361222" className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-200 hover:bg-blue-50">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B56D9]"><Phone className="h-5 w-5" /></div>
              <div><p className="text-sm font-extrabold text-[#0A1931]">Call our India desk</p><p className="mt-1 text-sm text-slate-600">+91 97903 61222</p><p className="text-sm text-slate-600">+91 90037 15617</p></div>
            </a>
            <a href="mailto:support@pickopick.com" className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-200 hover:bg-blue-50">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B56D9]"><Mail className="h-5 w-5" /></div>
              <div><p className="text-sm font-extrabold text-[#0A1931]">Email us</p><p className="mt-1 text-sm text-slate-600">support@pickopick.com</p></div>
            </a>
            <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B56D9]"><MapPin className="h-5 w-5" /></div>
              <div><p className="text-sm font-extrabold text-[#0A1931]">India office</p><p className="mt-1 text-sm leading-relaxed text-slate-600">Pickopick Private Limited, No. 49 &amp; 51, 2nd Sector, Thiru Vi Ka Industrial Estate, Guindy, Chennai – 600032.</p></div>
            </div>
            <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B56D9]"><Clock3 className="h-5 w-5" /></div>
              <div><p className="text-sm font-extrabold text-[#0A1931]">Response time</p><p className="mt-1 text-sm text-slate-600">Our team typically responds within one business day.</p></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
            <h2 className="text-xl font-extrabold text-[#0A1931]">Send us a message</h2>
            <p className="mt-2 text-sm text-slate-500">Share your question and our team will get back to you.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-slate-700">Full name<input required name="name" className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-[#0B56D9]" /></label>
              <label className="text-xs font-bold text-slate-700">Email address<input required type="email" name="email" className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-[#0B56D9]" /></label>
              <label className="text-xs font-bold text-slate-700">Phone number<input name="phone" type="tel" className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-[#0B56D9]" /></label>
              <label className="text-xs font-bold text-slate-700">How can we help?<select name="topic" className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#0B56D9]"><option>International shipping</option><option>Shop from India</option><option>NRI services</option><option>Other inquiry</option></select></label>
            </div>
            <label className="mt-4 block text-xs font-bold text-slate-700">Message<textarea required name="message" rows={5} className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-[#0B56D9]" /></label>
            {sent && <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-[#0B56D9]">Thanks — your message has been received. Our team will contact you shortly.</p>}
            <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0B56D9] px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7]"><Send className="h-4 w-4" />Send message</button>
          </form>
        </div>
      </section>
    </main>
  );
}
