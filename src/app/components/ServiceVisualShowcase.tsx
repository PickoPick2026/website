import { ArrowRight } from "lucide-react";

interface ServiceVisualItem {
  title: string;
  description: string;
  image: string;
  alt: string;
}

interface ServiceVisualShowcaseProps {
  eyebrow: string;
  title: string;
  description: string;
  items: ServiceVisualItem[];
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  targetId: string;
}

export function ServiceVisualShowcase({
  eyebrow,
  title,
  description,
  items,
  ctaTitle,
  ctaDescription,
  ctaLabel,
  targetId,
}: ServiceVisualShowcaseProps) {
  return (
    <section className="border-b border-slate-200/80 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mx-auto mb-9 max-w-3xl text-center sm:mb-11">
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0B56D9]">
            {eyebrow}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#0A1931] sm:text-3xl">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {items.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] transition-colors hover:border-blue-200"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="aspect-[16/10] w-full bg-[#F8FAFC] p-2 object-contain sm:p-3"
                loading="lazy"
              />
              <div className="p-4 sm:p-5">
                <h3 className="text-sm font-extrabold text-[#0A1931] sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-[#0B56D9] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight sm:text-xl">
              {ctaTitle}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-blue-50">
              {ctaDescription}
            </p>
          </div>
          <a
            href={`#${targetId}`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-[#0B56D9] transition-colors hover:bg-blue-50"
          >
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
