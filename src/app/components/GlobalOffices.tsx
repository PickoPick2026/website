import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const offices = [
  { name: 'Singapore', location: 'Singapore Operations Desk', flag: '/images/flags/sg.svg' },
  { name: 'United Kingdom', location: 'London, United Kingdom', flag: '/images/flags/gb.svg' },
  { name: 'Dubai / UAE', location: 'Dubai, United Arab Emirates', flag: '/images/flags/ae.svg' },
];

export function GlobalOffices() {
  return (
    <section id="global-offices" aria-labelledby="global-offices-heading" className="scroll-mt-28 border-y border-blue-100 bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <h2 id="global-offices-heading" className="text-2xl font-extrabold text-[#0A1931] sm:text-3xl">Our global offices</h2>
        <p className="mt-2 text-sm text-slate-600">An India-side team with overseas support closer to you.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {offices.map(office => (
            <div key={office.name} className="flex items-start gap-4 rounded-2xl border border-blue-100 p-5">
              <img src={office.flag} alt="" width={36} height={24} className="mt-1 h-6 w-9 rounded object-cover" loading="lazy" />
              <div><h3 className="font-bold text-[#0A1931]">{office.name}</h3><p className="mt-1 flex items-start gap-1 text-sm text-slate-600"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{office.location}</p></div>
            </div>
          ))}
        </div>
        <Link to="/contact" className="mt-5 inline-block text-sm font-bold text-[#0B56D9] hover:underline">Contact our team for office assistance</Link>
      </div>
    </section>
  );
}
