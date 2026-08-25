import React, { useState } from 'react';
import { Check, Info, X } from 'lucide-react';
import { NRI_SERVICES } from './data/mockData';
import { ServiceTypeId } from './types';

interface ServiceCardsProps {
  selectedServices: ServiceTypeId[];
  onToggleService: (id: ServiceTypeId) => void;
}

export const ServiceCards: React.FC<ServiceCardsProps> = ({ selectedServices, onToggleService }) => {
  const [infoService, setInfoService] = useState<ServiceTypeId | null>(null);
  const service = NRI_SERVICES.find((item) => item.id === infoService);

  return <>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {NRI_SERVICES.map((item) => {
        const selected = selectedServices.includes(item.id);
        return <div key={item.id} className={`relative overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors ${selected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
          <button type="button" onClick={() => onToggleService(item.id)} className="block w-full p-2 text-center">
            <img src={item.imagePath} alt={item.title} className="h-24 w-full rounded-lg object-cover sm:h-28" />
            <span className="block truncate px-1 pt-2 text-xs font-bold text-[#0A1931] sm:text-sm">{item.title}</span>
          </button>
          <button type="button" aria-label={`More information about ${item.title}`} onClick={() => setInfoService(item.id)} className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-slate-700 transition-colors hover:bg-[#0A1931] hover:text-white"><Info className="h-3.5 w-3.5" /></button>
          {selected && <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0B56D9] text-white"><Check className="h-4 w-4 stroke-[3]" /></span>}
        </div>;
      })}
    </div>

    {service && <div className="fixed inset-0 z-[70] flex items-end bg-slate-950/55 p-0 sm:items-center sm:justify-center sm:p-4" onClick={() => setInfoService(null)}>
      <div role="dialog" aria-modal="true" className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="relative"><img src={service.imagePath} alt="" className="h-48 w-full object-cover" /><button onClick={() => setInfoService(null)} className="absolute right-3 top-3 rounded-full bg-white p-2 text-slate-700 shadow hover:bg-slate-100"><X className="h-4 w-4" /></button></div>
        <div className="p-5"><h3 className="text-xl font-extrabold text-[#0A1931]">{service.title}</h3><p className="mt-1 text-xs font-bold text-[#FF6321]">{service.tagline}</p><p className="mt-3 text-sm leading-relaxed text-slate-600">{service.shortDesc}</p><p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Typical items</p><div className="mt-2 flex flex-wrap gap-2">{service.popularItems.map((item) => <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{item}</span>)}</div><button onClick={() => { onToggleService(service.id); setInfoService(null); }} className="mt-6 w-full rounded-xl bg-[#0A1931] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">{selectedServices.includes(service.id) ? 'Remove this service' : 'Add this service'}</button></div>
      </div>
    </div>}
  </>;
};
