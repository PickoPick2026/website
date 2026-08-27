import { Globe, Package, ShieldCheck, Users, Truck, HeartHandshake, Eye, Target, MapPin, Phone, Mail, Compass, ArrowRight } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
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

          <div className="relative overflow-hidden rounded-3xl bg-[#0A1931] p-10 text-white" style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="relative z-10"><h4 className="text-2xl font-bold mb-6">
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
            </ul></div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-24 bg-[#F1F5F9] border border-slate-200 rounded-3xl p-8 sm:p-14">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-xs font-bold uppercase tracking-widest text-[#0A1931]">
              Why Pick O Pick
            </span>

            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931] mt-3">
              Why Customers Choose <span className="text-[#0B56D9]">Pick O Pick</span>
            </h3>

            <p className="text-sm sm:text-base text-slate-600 mt-3">
              We focus on making international shopping simple, secure,
              transparent, and reliable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 hover:border-[#0B56D9]/40 transition-colors duration-200"
              >
                <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#0B56D9]/10 text-[#0B56D9]">
                  <item.icon className="w-7 h-7" />
                </div>

                <h4 className="text-base font-extrabold text-[#0A1931] tracking-tight">
                  {item.title}
                </h4>

                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-24">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 hover:border-[#0B56D9]/40 transition-colors duration-200">
            <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#0B56D9]/10 text-[#0B56D9]">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-[#0A1931]">
              Our Vision
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              To become a trusted global platform that makes shopping from India
              simple, reliable, and accessible for customers worldwide.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 hover:border-[#0B56D9]/40 transition-colors duration-200">
            <div className="w-14 h-14 mb-5 flex items-center justify-center rounded-xl bg-[#0B56D9]/10 text-[#0B56D9]">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-[#0A1931]">
              Our Mission
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              To help customers around the world purchase and receive Indian
              products through transparent logistics, secure shipping, and
              dependable customer support.
            </p>
          </div>
        </div>

        {/* Commitment */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0B56D9] p-10 text-white mb-20 sm:p-14" style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest">
              <HeartHandshake className="h-3.5 w-3.5" />
              Our Commitment
            </span>
            <h3 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
              International shopping should feel simple and trustworthy.
            </h3>
            <p className="mt-4 text-base leading-relaxed text-blue-50">
              At Pick O Pick, we continuously improve our logistics process,
              customer support, packaging standards, and global delivery
              capabilities to provide customers with a seamless experience from
              purchase to delivery.
            </p>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-200 text-[#0B56D9]">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-[#0A1931]">
              Company Information
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
              <p className="text-base font-extrabold text-[#0A1931] mb-4">
                Pick O Pick
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0B56D9]"><MapPin className="h-4 w-4" /></span>
                  Chennai, Tamil Nadu, India
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0B56D9]"><Package className="h-4 w-4" /></span>
                  International Shopping &amp; Shipping Services
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0B56D9]"><Globe className="h-4 w-4" /></span>
                  Worldwide Delivery Support
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
              <p className="text-base font-extrabold text-[#0A1931] mb-4">
                Reach Us
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0B56D9]"><Phone className="h-4 w-4" /></span>
                  +91 97903 61222
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0B56D9]"><Mail className="h-4 w-4" /></span>
                  sales@pickopick.com
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0B56D9]"><Compass className="h-4 w-4" /></span>
                  www.pickopick.com
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 rounded-3xl border border-[#0B56D9]/30 bg-white p-8 sm:p-14 text-center">
          <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
            Get Started
          </span>
          <h3 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
            Need Something From India?
          </h3>

          <p className="mx-auto mt-3 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
            Whether you're shopping for personal products, gifts, groceries,
            fashion items, or business requirements, Pick O Pick is ready to
            help you source, pack, and ship with confidence.
          </p>

          <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0B56D9] px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#0849B7]">
            Start Shopping Today
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
