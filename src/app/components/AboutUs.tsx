import { Globe, Package, ShieldCheck, Users, Truck, HeartHandshake } from "lucide-react";

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
      icon: Users,
      title: "Reliable Support",
      desc: "Our team assists customers throughout the shopping and shipping process with clear communication and responsive support.",
    },
    {
      icon: Package,
      title: "Flexible Shopping",
      desc: "Purchase products from local stores, online marketplaces, regional sellers, and specialty shops across India.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Packaging",
      desc: "Every parcel is carefully packed to reduce transit damage and ensure safe international delivery.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      desc: "International shipping solutions for customers across multiple countries worldwide.",
    },
    {
      icon: HeartHandshake,
      title: "Easy Communication",
      desc: "Connect with us via WhatsApp, email, and direct support channels for faster assistance.",
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      desc: "Trusted logistics partners help us deliver parcels safely and efficiently worldwide.",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6">
            About Pick O Pick
          </span>

          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Connecting India to the World
          </h2>

          <p className="text-xl text-slate-600 leading-relaxed">
            Helping customers worldwide shop products from India and deliver
            them safely to their doorstep through one reliable platform.
          </p>
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-6">
              Our Story
            </h3>

            <p className="text-slate-600 leading-8 mb-6">
              Pick O Pick was founded with a simple mission — making products
              from India easily accessible to customers across the world.
            </p>

            <p className="text-slate-600 leading-8 mb-6">
              Many international customers faced challenges purchasing products
              directly from Indian stores due to payment issues, shipping
              limitations, communication barriers, and unreliable delivery
              options.
            </p>

            <p className="text-slate-600 leading-8">
              We created Pick O Pick to simplify sourcing, shopping, packaging,
              and international delivery through a secure and dependable
              platform.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-10 text-white">
            <h4 className="text-2xl font-bold mb-6">
              What We Do
            </h4>

            <ul className="space-y-4">
              {services.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-3"
                >
                  <span className="text-green-300 font-bold">✓</span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-24">
          <div className="text-center mb-14">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Why Customers Choose Pick O Pick
            </h3>

            <p className="text-slate-600 max-w-3xl mx-auto">
              We focus on making international shopping simple, secure,
              transparent, and reliable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:-translate-y-1 transition-all"
              >
                <item.icon className="w-12 h-12 text-blue-600 mb-5" />

                <h4 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h4>

                <p className="text-slate-600 leading-7">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="bg-blue-50 rounded-3xl p-10">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">
              Our Vision
            </h3>

            <p className="text-slate-700 leading-8">
              To become a trusted global platform that makes shopping from India
              simple, reliable, and accessible for customers worldwide.
            </p>
          </div>

          <div className="bg-indigo-50 rounded-3xl p-10">
            <h3 className="text-3xl font-bold text-indigo-900 mb-4">
              Our Mission
            </h3>

            <p className="text-slate-700 leading-8">
              To help customers around the world purchase and receive Indian
              products through transparent logistics, secure shipping, and
              dependable customer support.
            </p>
          </div>
        </div>

        {/* Commitment */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-16 text-white mb-20">
          <h3 className="text-4xl font-bold mb-6">
            Our Commitment
          </h3>

          <p className="text-slate-300 leading-8 text-lg max-w-5xl">
            At Pick O Pick, we believe international shopping should feel
            simple and trustworthy. We continuously improve our logistics
            process, customer support, packaging standards, and global delivery
            capabilities to provide customers with a seamless experience from
            purchase to delivery.
          </p>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-lg">
          <h3 className="text-3xl font-bold text-slate-900 mb-8">
            Company Information
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="font-bold text-xl text-slate-900 mb-3">
                Pick O Pick
              </p>

              <div className="space-y-3 text-slate-600">
                <p>📍 Chennai, Tamil Nadu, India</p>
                <p>📦 International Shopping & Shipping Services</p>
                <p>🌍 Worldwide Delivery Support</p>
              </div>
            </div>

            <div>
              <div className="space-y-3 text-slate-600">
                <p>📞 +91 99449 11122</p>
                <p>📧 support@pickopick.com</p>
                <p>🌐 www.pickopick.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <h3 className="text-4xl font-bold text-slate-900 mb-6">
            Need Something From India?
          </h3>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Whether you're shopping for personal products, gifts, groceries,
            fashion items, or business requirements, Pick O Pick is ready to
            help you source, pack, and ship with confidence.
          </p>

          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold hover:scale-105 transition-all">
            Start Shopping Today
          </button>
        </div>

      </div>
    </section>
  );
}