import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  cityDestination: string;
  country: string;
  serviceUsed: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sarah Jenkins',
    cityDestination: 'New York',
    country: 'USA',
    serviceUsed: 'Wedding Outfits & Consolidation',
    quote: 'PickoPick made it incredibly easy to buy traditional Indian wear for my wedding. The consolidation saved me a fortune on shipping!',
  },
  {
    id: 't-2',
    name: 'David Chen',
    cityDestination: 'Sydney',
    country: 'Australia',
    serviceUsed: 'Personal Items & Documents',
    quote: 'Fast, reliable, and transparent. The photos they send when items arrive at their warehouse give me total peace of mind.',
  },
  {
    id: 't-3',
    name: 'Priya Patel',
    cityDestination: 'London',
    country: 'UK',
    serviceUsed: 'Food & Groceries',
    quote: 'I missed my favorite Indian snacks and brands. Now I just order them online and PickoPick delivers them to London in days.',
  },
];

export function Testimonials() {
  const stories = [...testimonials, ...testimonials];
  return (
    <section className="overflow-hidden border-b border-slate-200 bg-[#F1F5F9] py-14 sm:py-16">
      <style>{`@keyframes nri-story-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } .nri-story-marquee { animation: nri-story-marquee 38s linear infinite; animation-iteration-count: infinite; } .nri-story-marquee:hover { animation-play-state: paused; } @media (prefers-reduced-motion: reduce) { .nri-story-marquee { animation: none; } }`}</style>
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
            Loved Globally
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">
            Trusted by Happy Customers Worldwide
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Join thousands of happy customers shipping from India to the world.
          </p>
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="nri-story-marquee flex w-max gap-4 px-4 sm:gap-5 sm:px-8">
          {stories.map((item, index) => (
            <article key={`${item.id}-${index}`} className="flex aspect-square w-64 shrink-0 flex-col rounded-2xl bg-white p-5 sm:w-72 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-[#0A1931]">{item.cityDestination}, {item.country}</span>
                <div className="flex shrink-0 gap-0.5 text-amber-500">
                  {[0, 1, 2, 3, 4].map((star) => <Star key={star} className="h-3 w-3 fill-current" />)}
                </div>
              </div>
              <p className="mt-4 line-clamp-6 text-xs leading-relaxed text-slate-700 italic">“{item.quote}”</p>
              <div className="mt-auto border-t border-slate-100 pt-3">
                <h3 className="text-xs font-bold text-[#0A1931]">{item.name}</h3>
                <p className="mt-1 truncate text-[11px] text-slate-500">{item.serviceUsed}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
