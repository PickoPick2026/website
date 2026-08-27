import { motion } from 'motion/react';
import { ShoppingCart, Box, Truck, ShieldCheck, Clock, CreditCard } from 'lucide-react';

const services = [
  {
    icon: ShoppingCart,
    title: "Personal Shopper",
    desc: "We buy on your behalf from any Indian store, handling local payments and communications."
  },
  {
    icon: Box,
    title: "Package Consolidation",
    desc: "Combine multiple orders into one shipment to save up to 80% on international shipping costs."
  },
  {
    icon: Truck,
    title: "Global Forwarding",
    desc: "Partnered with DHL, FedEx, and Aramex for reliable, fast delivery to over 200 countries."
  },
  {
    icon: ShieldCheck,
    title: "Quality Inspection",
    desc: "We verify your items upon arrival at our warehouse, providing photos before shipping."
  },
  {
    icon: Clock,
    title: "Free Storage",
    desc: "Store your items securely in our warehouse for up to 30 days at no additional cost."
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    desc: "Pay easily in your local currency using international credit cards or PayPal."
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-24 bg-[#F1F5F9] scroll-mt-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-xs font-bold uppercase tracking-widest text-[#0A1931]">
            Premium Services
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
            Everything you need to shop <span className="text-[#0B56D9]">from India</span> seamlessly.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Shop, consolidate, inspect, store, and ship — all under one trusted roof.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 hover:border-[#0B56D9]/40 transition-colors duration-200"
            >
              <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#0B56D9]/10 text-[#0B56D9]">
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold tracking-tight text-[#0A1931]">{service.title}</h3>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
