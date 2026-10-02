import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, type LucideIcon } from "lucide-react";

/* Shared building blocks for the service pages (Buy & Ship, Order & Send,
   Shipping Estimate). Light surfaces + brand blue #0B56D9; bold panels use the
   logistics background image under a blue overlay, matching the NRI hero. */

const HERO_BG = "url('/images/nri-hero-logistics-v2.webp')";

export function BluePanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#0B56D9] bg-cover bg-center text-white ${className}`}
      style={{ backgroundImage: HERO_BG }}
    >
      <div className="absolute inset-0 z-0 bg-[#0B56D9]/85 backdrop-blur-[0.5px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  actions,
  image,
  imageAlt,
  floatingChips = [],
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: ReactNode;
  actions?: ReactNode;
  image: string;
  imageAlt: string;
  floatingChips?: { icon: LucideIcon; label: string }[];
}) {
  return (
    <BluePanel className="border-b border-blue-100">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-24 pt-28 sm:px-8 sm:pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:pb-32 lg:pt-36">
        <div>
          <span className="inline-block rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest">
            {eyebrow}
          </span>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.06] tracking-tight">
            {title}
            {highlight && (
              <>
                {" "}
                <span className="text-blue-100">{highlight}</span>
              </>
            )}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-50 sm:text-lg">
            {description}
          </p>
          {actions && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="rounded-[32px] border border-white/30 bg-white p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]">
            <img
              src={image}
              alt={imageAlt}
              className="mx-auto aspect-square w-full max-w-sm object-contain"
            />
          </div>
          {floatingChips.map(({ icon: Icon, label }, index) => (
            <span
              key={label}
              className={`absolute hidden items-center gap-2 rounded-2xl border border-blue-100 bg-white px-3.5 py-2.5 text-xs font-extrabold text-[#0A1931] shadow-lg sm:inline-flex ${
                index === 0
                  ? "-left-4 top-8"
                  : index === 1
                    ? "-right-4 top-1/2"
                    : "bottom-6 left-8"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0B56D9]">
                <Icon size={14} />
              </span>
              {label}
            </span>
          ))}
        </div>
      </section>
    </BluePanel>
  );
}

export function HeroPrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  );
}

export function HeroSecondaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-white/20"
    >
      {children}
    </a>
  );
}

/** White stats bar that overlaps the bottom of the hero. */
export function StatsBar({
  stats,
}: {
  stats: { icon: LucideIcon; value: string; label: string }[];
}) {
  return (
    <div className="relative z-20 mx-auto -mt-14 max-w-6xl px-4 sm:px-8">
      <div
        className={`grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-blue-100 bg-blue-100 shadow-[0_24px_60px_-30px_rgba(11,86,217,0.45)] ${
          stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
        }`}
      >
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3 bg-white p-5 sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B56D9]">
              <Icon size={20} />
            </span>
            <span>
              <span className="block text-lg font-extrabold leading-tight text-[#0A1931] sm:text-xl">
                {value}
              </span>
              <span className="block text-[11px] font-semibold text-slate-500 sm:text-xs">
                {label}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={`mb-12 max-w-3xl sm:mb-14 ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0B56D9]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">
        {title}
        {highlight && (
          <>
            {" "}
            <span className="text-[#0B56D9]">{highlight}</span>
          </>
        )}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

/** Numbered process with a connecting line on desktop. */
export function StepsTimeline({
  steps,
}: {
  steps: { num: string; title: string; desc: string; icon: LucideIcon }[];
}) {
  return (
    <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      <div
        aria-hidden="true"
        className="absolute left-[12%] right-[12%] top-7 hidden border-t-2 border-dashed border-[#0B56D9]/25 lg:block"
      />
      {steps.map(({ num, title, desc, icon: Icon }) => (
        <li key={num} className="group relative">
          <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#0B56D9] bg-white text-[#0B56D9] transition-colors group-hover:bg-[#0B56D9] group-hover:text-white lg:mx-0">
            <Icon size={22} />
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0B56D9] text-[10px] font-black text-white ring-4 ring-white">
              {num}
            </span>
          </div>
          <div className="mt-5 text-center lg:text-left">
            <h3 className="text-base font-extrabold tracking-tight text-[#0A1931]">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Small numbered heading inside a long form. */
export function FormGroup({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B56D9] text-[11px] font-black text-white">
          {step}
        </span>
        <span className="text-sm font-extrabold text-[#0A1931]">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

export const fieldClass =
  "w-full h-12 px-4 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm font-medium text-[#0A1931] outline-none transition-all placeholder:text-slate-400 focus:border-[#0B56D9] focus:bg-white focus:ring-4 focus:ring-[#0B56D9]/10";

export function FieldLabel({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <FieldLabel label={label} required={required}>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={fieldClass}
      />
    </FieldLabel>
  );
}

export const COUNTRY_OPTIONS = [
  { value: "United States", label: "United States (USA)" },
  { value: "United Kingdom", label: "United Kingdom (UK)" },
  { value: "Canada", label: "Canada" },
  { value: "United Arab Emirates", label: "United Arab Emirates (UAE)" },
  { value: "Australia", label: "Australia" },
  { value: "Singapore", label: "Singapore" },
  { value: "Germany", label: "Germany" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "Other Country", label: "Other Country" },
];

export function FaqAccordion({
  faqs,
}: {
  faqs: { q: string; a: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.q}
            className={`rounded-2xl border bg-white transition-colors ${
              isOpen ? "border-[#0B56D9]/40" : "border-slate-200 hover:border-[#0B56D9]/30"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
            >
              <span className="text-sm font-extrabold text-[#0A1931] sm:text-base">
                {faq.q}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                  isOpen ? "rotate-180 bg-[#0B56D9] text-white" : "bg-blue-50 text-[#0B56D9]"
                }`}
              >
                <ChevronDown size={16} />
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-6 text-sm leading-relaxed text-slate-600 sm:px-6">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Closing blue banner that cross-links to the sister service. */
export function CrossLinkBanner({
  eyebrow,
  title,
  description,
  to,
  cta,
  image,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  to: string;
  cta: string;
  image: string;
}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <BluePanel className="rounded-[32px]">
          <div className="grid items-center gap-8 p-8 sm:p-12 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-100">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
                {title}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-blue-50 sm:text-base">
                {description}
              </p>
              <Link
                to={to}
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50"
              >
                {cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="hidden rounded-3xl bg-white p-4 md:block">
              <img
                src={image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="mx-auto aspect-square w-full max-w-[240px] object-contain"
              />
            </div>
          </div>
        </BluePanel>
      </div>
    </section>
  );
}
