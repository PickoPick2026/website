import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Filter, Globe2, Package, Plane, Rocket, Search, Ship } from 'lucide-react';

type Activity = { id: string; type?: string; status?: string; from?: string; to?: string; progress?: number; arrivalDate?: string };

export function TrackingExperience() {
  const [trackingId, setTrackingId] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await fetch('/api/shipments');
        const data = await response.json();
        setActivities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    void loadActivities();
  }, []);

  const handleTrack = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cargoId = trackingId.trim();
    if (cargoId) navigate(`/track-shipment?cargoId=${encodeURIComponent(cargoId)}`);
  };

  return (
    <section id="track-shipment" className="bg-white scroll-mt-24">
      <div className="relative overflow-hidden border-b border-blue-700 bg-[#0B56D9] px-4 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
        <img src="/images/nri-hero-logistics-v2.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#0B56D9]/25" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm"><Globe2 className="h-3.5 w-3.5" /> AI-powered real-time tracking</span>
          <h2 className="mt-6 text-[clamp(1.9rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-white">Real-time Global Tracking</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-blue-50 sm:text-lg">Monitor your shipment from our India hub to your overseas doorstep.</p>
          <form onSubmit={handleTrack} className="mx-auto mt-9 flex max-w-2xl flex-col items-center gap-3 sm:flex-row">
            <div className="relative flex w-full items-center rounded-full border border-white/30 bg-white/15 px-5 backdrop-blur-sm"><Search className="h-5 w-5 shrink-0 text-blue-100" /><input type="text" value={trackingId} onChange={(event) => setTrackingId(event.target.value)} placeholder="Enter Cargo ID (e.g. AA-845)" className="w-full bg-transparent px-3 py-4 text-left text-sm font-medium text-white outline-none placeholder:text-blue-100" /></div>
            <button type="submit" className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50 sm:w-auto">Track now <ArrowRight className="h-4 w-4" /></button>
          </form>
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/25 pt-5 text-xs text-blue-50"><span className="inline-flex items-center gap-2"><Plane className="h-4 w-4" /> 180+ global routes</span><span className="inline-flex items-center gap-2"><Package className="h-4 w-4" /> End-to-end visibility</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> WhatsApp event updates</span></div>
        </div>
      </div>

      <div className="bg-[#F7F9FF] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center"><span className="rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">Live Network Activity</span><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">Shipments in Motion, Right Now</h2><p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">Live updates from parcels currently travelling across our global network.</p></div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2"><div className="p-6 sm:p-8"><div className="mb-6 flex items-center justify-between"><h3 className="text-xl font-extrabold tracking-tight text-[#0A1931]">Live Activities</h3><div className="flex items-center gap-2"><span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Live</span><button type="button" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50" aria-label="Filter activities"><Filter size={20} /></button></div></div><div className="overflow-x-auto"><table className="w-full border-collapse"><thead><tr className="border-b border-slate-100 text-left"><th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Cargo ID</th><th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Destination</th><th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Arrival date</th><th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{activities.map((item, index) => <motion.tr key={item.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} onClick={() => navigate(`/track-shipment?cargoId=${encodeURIComponent(item.id)}`)} className="cursor-pointer transition-colors hover:bg-blue-50/50"><td className="py-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#0B56D9]">{item.type === 'air' ? <Plane size={18} /> : <Ship size={18} />}</div><span className="font-bold text-[#0A1931]">{item.id}</span></div></td><td className="py-5"><div className="min-w-[180px]"><div className="flex justify-between text-xs font-bold text-[#0A1931]"><span>{item.from}</span><span>{item.to}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#0B56D9]" style={{ width: `${item.progress || 0}%` }} /></div></div></td><td className="py-5 text-sm font-bold text-[#0A1931]">{item.arrivalDate}</td><td className="py-5"><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0B56D9]">{item.status}</span></td></motion.tr>)}</tbody></table></div></div></div>
            <div className="space-y-6"><div className="relative overflow-hidden rounded-2xl p-7 text-white"><img src="/images/nri-hero-logistics-v2.webp" alt="" className="absolute inset-0 h-full w-full object-cover brightness-[0.65]" /><div className="relative z-10"><h3 className="text-base font-extrabold tracking-tight">Network Statistics</h3><div className="mt-6 space-y-6"><Stat label="Monthly delivered" value="1021" progress="82%" /><div className="h-px bg-white/15" /><Stat label="Yearly delivered" value="4603" progress="64%" /></div></div></div><div className="relative overflow-hidden rounded-2xl bg-[#0B56D9] p-7 text-white" style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="relative z-10"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15"><Rocket className="h-5 w-5" /></div><h3 className="mt-4 text-lg font-extrabold tracking-tight">Plan Your Route with AI</h3><p className="mt-1.5 text-sm leading-relaxed text-blue-100">Get instant cost and time estimates for global shipments.</p><button type="button" onClick={() => navigate('/shipping-estimate')} className="mt-5 w-full rounded-full bg-white py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50">Get a verified quote</button></div></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, progress }: { label: string; value: string; progress: string }) {
  return <div><p className="text-[11px] font-bold uppercase tracking-wider text-blue-50">{label}</p><p className="mt-2 text-4xl font-extrabold tracking-tight">{value}</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{ width: progress }} /></div></div>;
}
