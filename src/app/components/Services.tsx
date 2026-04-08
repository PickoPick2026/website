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
    <section id="services" className="py-32 bg-slate-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Premium Services
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to shop from India seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-3xl shadow-sm border border-blue-500 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:text-blue-600 transition-all duration-300">
                <motion.div
                  animate={{ 
                    y: [0, -4, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2 + index * 0.2, 
                    ease: "easeInOut" 
                  }}
                >
                  <service.icon size={28} />
                </motion.div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
              <p className="text-blue-50 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
