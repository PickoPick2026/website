import { Link } from "react-router-dom";
import {
  Globe,
  Package,
  ShieldCheck,
  Users,
  Truck,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowRight,
} from "lucide-react";

export function AboutUs() {
  const services = [
    "Product sourcing from India",
    "Personal shopping assistance",
    "International parcel shipping",
    "Secure packaging & parcel consolidation",
    "Worldwide delivery support",
    "Export assistance for businesses",
    "Shipment tracking & customer support",
  ];

  const features = [
    {
      num: "01",
      icon: Users,
      title: "Reliable Support",
      desc: "Our team assists customers throughout the shopping and shipping process with clear communication and responsive support.",
    },
    {
      num: "02",
      icon: Package,
      title: "Flexible Shopping",
      desc: "Purchase products from local stores, online marketplaces, regional sellers, and specialty shops across India.",
    },
    {
      num: "03",
      icon: ShieldCheck,
      title: "Secure Packaging",
      desc: "Every parcel is carefully packed to reduce transit damage and ensure safe international delivery.",
    },
    {
      num: "04",
      icon: Globe,
      title: "Global Reach",
      desc: "International shipping solutions for customers across multiple countries worldwide.",
    },
    {
      num: "05",
      icon: HeartHandshake,
      title: "Easy Communication",
      desc: "Connect with us via WhatsApp, email, and direct support channels for faster assistance.",
    },
    {
      num: "06",
      icon: Truck,
      title: "Reliable Delivery",
      desc: "Trusted logistics partners help us deliver parcels safely and efficiently worldwide.",
    },
  ];

  return (
    <section
      id="about"
      className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80 overflow-hidden scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
            <Sparkles size={12} className="text-[#FF6321]" />
            About Pick O Pick
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
            Connecting India to the World
          </h2>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
            Helping customers worldwide shop products from India and deliver
            them safely to their doorstep through one reliable platform.
          </p>
        </div>

        {/* Story & What We Do Grid */}
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch mb-16 sm:mb-20">
          {/* Left: Our Story (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 flex flex-col justify-between hover:border-[#0B56D9]/40 transition-colors duration-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#0B56D9] px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                  Our Story
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                  <MapPin size={13} className="text-[#0B56D9]" />
                  Chennai, India
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A1931] tracking-tight mb-4">
                Making Indian shopping accessible to everyone, anywhere.
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Pick O Pick was founded with a simple mission — making
                  products from India easily accessible to customers across the
                  world.
                </p>

                <p>
                  Many international customers faced challenges purchasing
                  products directly from Indian stores due to payment issues,
                  shipping limitations, communication barriers, and unreliable
                  delivery options.
                </p>

                <p>
                  We created Pick O Pick to simplify sourcing, shopping,
                  packaging, and international delivery through a secure and
                  dependable platform.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
              <span>Sourcing • Consolidation • Global Freight</span>
              <span className="text-[#0B56D9] font-bold">
                Trusted Worldwide
              </span>
            </div>
          </div>

          {/* Right: What We Do (5 cols) matching the global brand background image pattern */}
          <div
            className="lg:col-span-5 relative overflow-hidden rounded-2xl p-7 sm:p-9 text-white flex flex-col justify-between bg-[#0B56D9]"
            style={{
              backgroundImage: "url('/images/nri-hero-logistics-v2.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Global blue overlay matching Contact & Tracking sections */}
            <div className="absolute inset-0 bg-[#0B56D9]/85 backdrop-blur-[0.5px] z-0" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-white px-2.5 py-1 rounded-full bg-white/15 border border-white/25">
                  Capabilities
                </span>
                <span className="text-xs font-bold text-blue-100">
                  7 Core Services
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-4">
                What We Do
              </h4>

              <div className="space-y-2.5">
                {services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 text-xs sm:text-sm text-white font-medium hover:bg-white/25 transition-colors"
                  >
                    <CheckCircle2 size={15} className="text-white shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action button to NRI Services matching global brand button styling */}
            <div className="relative z-10 mt-6 pt-4 border-t border-white/20">
              <Link
                to="/nri"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white hover:bg-blue-50 text-[#0B56D9] text-xs sm:text-sm font-extrabold tracking-wide transition-colors cursor-pointer"
              >
                <span>Explore NRI Services</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Why Customers Choose Pick O Pick */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
              Why Pick O Pick
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A1931] mt-3">
              Why Customers Choose{" "}
              <span className="text-[#0B56D9]">Pick O Pick</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              We focus on making international shopping simple, secure,
              transparent, and reliable.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between hover:border-[#0B56D9]/50 transition-colors duration-200 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#0B56D9] flex items-center justify-center group-hover:bg-[#0B56D9] group-hover:text-white transition-colors duration-200">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black text-slate-300 group-hover:text-[#0B56D9] transition-colors tracking-widest">
                        {item.num}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-[#0A1931] tracking-tight group-hover:text-[#0B56D9] transition-colors">
                      {item.title}
                    </h4>

                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
