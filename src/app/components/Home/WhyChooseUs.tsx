import React from "react";
import {
  Users,
  Package,
  ShieldCheck,
  Globe,
  HeartHandshake,
  Truck,
  Sparkles,
} from "lucide-react";

export function WhyChooseUs() {
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
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
            <Sparkles size={12} className="text-[#FF6321]" />
            Why Pick O Pick
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931] mt-3">
            Why Customers Choose{" "}
            <span className="text-[#0B56D9]">Pick O Pick</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-xl mx-auto">
            We focus on making international shopping simple, secure,
            transparent, and reliable.
          </p>
        </div>

        {/* Features 6-Card Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between hover:border-[#0B56D9]/50 hover:bg-white transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#0B56D9] flex items-center justify-center group-hover:bg-[#0B56D9] group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-slate-400 group-hover:text-[#0B56D9] transition-colors tracking-widest">
                      {item.num}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#0A1931] tracking-tight group-hover:text-[#0B56D9] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-[#0B56D9] transition-colors">
                  <span>PickoPick Guarantee</span>
                  <span>•</span>
                  <span>Verified</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
