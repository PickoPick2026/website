import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const services = [
  {
    num: "01",
    image: "/images/nri-trust/shop-from-india.webp",
    title: "Personal Shopper",
    desc: "We buy on your behalf from any Indian store, handling local payments and communications.",
    to: "/buy-and-ship",
  },
  {
    num: "02",
    image: "/images/nri-trust/consolidate-purchases.webp",
    title: "Package Consolidation",
    desc: "Combine multiple orders into one shipment to save up to 80% on international shipping costs.",
    to: "/order-and-send",
  },
  {
    num: "03",
    image: "/images/nri-trust/international-shipping.webp",
    title: "Global Forwarding",
    desc: "Partnered with DHL, FedEx, and Aramex for reliable, fast delivery to over 200 countries.",
    to: "/nri",
  },
  {
    num: "04",
    image: "/images/nri-trust/source-with-confidence.webp",
    title: "Quality Inspection",
    desc: "We verify your items upon arrival at our warehouse, providing photos before shipping.",
    to: "/nri",
  },
  {
    num: "05",
    image: "/images/nri-trust/free-storage.webp",
    title: "Free Storage",
    desc: "Store your items securely in our warehouse for up to 30 days at no additional cost.",
    to: "/nri",
  },
  {
    num: "06",
    image: "/images/nri-trust/secure-payments.webp",
    title: "Secure Payments",
    desc: "Pay easily in your local currency using international credit cards or PayPal.",
    to: "/nri",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="py-16 sm:py-20 bg-[#F8FAFC] scroll-mt-24 border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
            Premium Services
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
            Everything you need to shop{" "}
            <span className="text-[#0B56D9]">from India</span> seamlessly.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Shop, consolidate, inspect, store, and ship — all under one trusted
            roof.
          </p>
        </div>

        {/* 6 Illustrated Service Cards — each opens its service page */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map((service) => (
            <Link
              key={service.num}
              to={service.to}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between hover:border-[#0B56D9]/50 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
            >
              <div>
                {/* Top: 3D Illustration & Service Index */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-1 rounded-xl bg-slate-50/70 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/40 transition-colors">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs font-black text-slate-300 group-hover:text-[#0B56D9] transition-colors tracking-widest">
                    {service.num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold tracking-tight text-[#0A1931] group-hover:text-[#0B56D9] transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[#0B56D9] opacity-0 transition-opacity group-hover:opacity-100">
                Explore service <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
