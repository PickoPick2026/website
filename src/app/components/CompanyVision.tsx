import {
  ArrowRight,
  Compass,
  Eye,
  Globe,
  HeartHandshake,
  Mail,
  MapPin,
  Package,
  Phone,
  Target,
} from "lucide-react";

const companyDetails = [
  { icon: MapPin, label: "Based in", value: "Chennai, Tamil Nadu, India" },
  {
    icon: Package,
    label: "What we do",
    value: "International shopping & shipping",
  },
  { icon: Globe, label: "Delivery", value: "Worldwide delivery support" },
];

const contactDetails = [
  {
    icon: Phone,
    label: "Call us",
    value: "+91 97903 61222",
    href: "tel:+919790361222",
  },
  {
    icon: Mail,
    label: "Email us",
    value: "sales@pickopick.com",
    href: "mailto:sales@pickopick.com",
  },
  {
    icon: Compass,
    label: "Visit us",
    value: "www.pickopick.com",
    href: "https://pickopick.com",
  },
];

export function CompanyVision() {
  return (
    <section className="overflow-hidden border-t border-slate-200/80 bg-[#F7F9FF] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[.9fr_1.1fr]">
          <div className="bg-[#0B56D9] p-8 text-white sm:p-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-100">
              <Compass className="h-3.5 w-3.5" /> Who we are
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Pick O Pick brings India closer to the world.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              We help customers discover, purchase, pack, and receive the things
              they love from India—with a reliable team guiding every step.
            </p>

            <div className="mt-9 space-y-4 border-t border-white/15 pt-7">
              {companyDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-white">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 border-t border-white/15 pt-7">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Reach us
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {contactDetails.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 text-sm text-slate-200 transition-colors hover:text-white"
                  >
                    <Icon className="h-4 w-4 text-blue-300" />
                    <span>{value}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#0B56D9]">
              Built around confidence
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">
              A simpler way to shop from India.
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <article className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0B56D9] shadow-sm">
                  <Eye className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-[#0A1931]">
                  Our vision
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  To become the trusted global platform that makes shopping from
                  India simple, reliable, and accessible worldwide.
                </p>
              </article>
              <article className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0B56D9] shadow-sm">
                  <Target className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-[#0A1931]">
                  Our mission
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  To connect customers with Indian products through transparent
                  logistics, secure shipping, and dependable support.
                </p>
              </article>
            </div>
            <p className="mt-7 border-t border-slate-100 pt-6 text-sm leading-relaxed text-slate-600">
              From a single gift to a consolidated business shipment, every
              request is handled with clear communication and thoughtful care.
            </p>
          </div>
        </div>

        <div
          className="relative mt-8 overflow-hidden rounded-3xl bg-[#0B56D9] px-7 py-10 text-white sm:px-12 sm:py-14"
          style={{
            backgroundImage:
              "url('/images/nri-hero-logistics-v2.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.25fr_.75fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest">
                <HeartHandshake className="h-3.5 w-3.5" /> Our commitment
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
                International shopping should feel simple and trustworthy.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-50 sm:text-base">
                We continuously improve our logistics process, packaging
                standards, support, and global delivery capabilities—so you can
                purchase from India with confidence.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 text-[#0A1931] shadow-xl sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#0B56D9]">
                Need something from India?
              </p>
              <p className="mt-3 text-lg font-extrabold leading-snug">
                Tell us what you need. We’ll help you source, pack, and ship it.
              </p>
              <a
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0B56D9] px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#0849B7]"
              >
                Start shopping today <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
