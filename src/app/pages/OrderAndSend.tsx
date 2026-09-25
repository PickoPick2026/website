import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Plane,
  AlertTriangle,
  HelpCircle,
  Scale,
  FileText,
  Clock,
  Check,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { submitServiceRequest } from "../../lib/serviceRequests";
import { ServiceVisualShowcase } from "../components/ServiceVisualShowcase";

function FormInput({
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
    <div>
      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-3.5 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-[#0A1931] outline-none transition-colors focus:border-[#0B56D9] focus:bg-white"
      />
    </div>
  );
}

const POPULAR_PICKUP_CITIES = [
  "Chennai",
  "Bengaluru",
  "Hyderabad",
  "Mumbai",
  "Delhi-NCR",
  "Coimbatore",
  "Madurai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
];

const WEIGHT_TIERS = ["1–2 kg", "3–5 kg", "5–10 kg", "10–20 kg", "20+ kg"];

const PARCEL_CATEGORIES = [
  "Homemade Food & Sweets",
  "Sarees & Traditional Clothes",
  "Documents & Certificates",
  "Books & Religious Items",
  "Luggage & Excess Baggage",
  "Commercial / Artisan Samples",
];

const STEPS = [
  {
    num: "01",
    title: "Schedule Pickup Online",
    desc: "Enter the pickup address in India and destination details abroad. Choose your preferred pickup time slot.",
  },
  {
    num: "02",
    title: "Doorstep Collection in India",
    desc: "Our courier executive visits the Indian address, hands over an instant receipt, and safely collects the parcel.",
  },
  {
    num: "03",
    title: "Box Trimming & Repacking",
    desc: "At our central hub, we inspect, trim empty dead space, custom repack, and share WhatsApp photo/video proof.",
  },
  {
    num: "04",
    title: "Express Air Delivery Abroad",
    desc: "Dispatched via DHL, FedEx, or Aramex with customs clearance and handed over at your foreign doorstep in 3–5 days.",
  },
];

const ALLOWED_ITEMS = [
  "Homemade traditional sweets, savouries & dry snacks",
  "Sealed regional spices, podis, masalas & curry pastes",
  "Commercial sealed pickles in certified leak-proof packaging",
  "Silk sarees, festive lehengas, kurtas & ethnic garments",
  "Educational degrees, transcripts, passports & legal papers",
  "Temple prasadam, brass pooja lamps, idols & spiritual books",
  "Handcrafted terracotta, clay pots & Indian home decor",
  "Personal luggage, books, cookware & non-perishable essentials",
];

const PROHIBITED_ITEMS = [
  "Liquids containing alcohol, flammable chemicals & deodorants",
  "Perfumes, nail polish & aerosol spray canisters",
  "Lithium battery power banks, loose cells & explosives",
  "Currency, bullion, precious jewelry without export clearance",
  "Raw dairy, unpreserved perishable meat, fresh vegetables",
  "Medicines requiring special import narcotics licenses",
];

const FAQS = [
  {
    q: "How does doorstep pickup work across India?",
    a: "Once you submit your booking details or message us on WhatsApp, our logistics network assigns a local courier partner to visit the Indian address at your scheduled slot. Your family receives an official pickup receipt and airway bill barcode right at the door.",
  },
  {
    q: "Can my parents in India send homemade snacks and sweets?",
    a: "Yes! Homemade food parcels are our most popular shipment. We provide food-safe repackaging, vacuum sealing if required, and complete the necessary foreign customs commercial invoices to ensure smooth clearance abroad.",
  },
  {
    q: "How does Pick O Pick reduce volumetric weight?",
    a: "International airlines charge based on the greater of actual gross weight or volumetric weight (L × W × H / 5000). Many boxes sent by families contain empty void space. Our packaging specialists resize and custom-pack your cartons, cutting dead weight and saving you up to 40% on shipping charges.",
  },
  {
    q: "How can I track my shipment once collected?",
    a: "You receive an official Pick O Pick tracking ID immediately. You can track progress 24/7 on our Track Shipment page and receive live WhatsApp milestones from pickup in India to final signature abroad.",
  },
  {
    q: "What if I need custom wooden crating for delicate brass or clay items?",
    a: "We provide multi-layer bubble wrap, foam corner guards, and optional heavy-duty wooden crating for fragile terracotta and brass idols to guarantee zero transit damage.",
  },
];

export default function OrderAndSendPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [productLinks, setProductLinks] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("United States");
  const [mobileNumber, setMobileNumber] = useState("");
  const [approxWeight, setApproxWeight] = useState("3–5 kg");
  const [parcelType, setParcelType] = useState("Homemade Food & Sweets");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#order-and-send-form") {
      window.setTimeout(
        () =>
          document
            .getElementById("order-and-send-form")
            ?.scrollIntoView(),
        80,
      );
    }
  }, []);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pickupCity.trim()) {
      toast.error("Please enter your Indian pickup city or town.");
      return;
    }

    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !mobileNumber.trim() ||
      !destinationLocation.trim() ||
      !productLinks.trim()
    ) {
      toast.error(
        "Please complete your name, phone, email, item details / product links, and delivery location.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitServiceRequest("order_and_send", {
        customerName,
        phone: mobileNumber,
        email: customerEmail,
        location: destinationLocation,
        pickupCity,
        productLinks,
        destinationCountry,
        approxWeight,
        parcelType,
      });
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      toast.success(
        result.emailSent
          ? "Pickup request submitted to WhatsApp and email confirmation sent!"
          : "Pickup request submitted! Opening WhatsApp to schedule dispatch.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit your request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#0A1931]">
      {/* Hero Section: Consistent with NRI Hero & About Us pattern */}
      <section
        className="relative overflow-hidden border-b border-blue-100 bg-[#0B56D9] bg-cover bg-bottom pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 text-white"
        style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.webp')" }}
      >
        {/* Solid brand blue overlay matching AboutUs & HeroSection pattern */}
        <div className="absolute inset-0 bg-[#0B56D9]/85 backdrop-blur-[0.5px] z-0" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-8 text-center">
          {/* Header pill badge */}
          <span className="inline-block text-[11px] font-black uppercase tracking-widest text-white px-3 py-1 rounded-full bg-white/15 border border-white/25">
            Order &amp; Send • Doorstep Pickup &amp; Courier
          </span>

          <h1 className="mt-4 text-[clamp(1.75rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight">
            Doorstep Pickup in India. Express Delivery Worldwide.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-white/85">
            Have homemade delicacies, sweets, garments, documents, or personal
            gifts at home in India? We collect directly from your Indian
            doorstep across 25,000+ pincodes, repack to trim volumetric dead
            weight, and express-courier to 200+ countries.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="#order-and-send-form"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-extrabold tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50 cursor-pointer"
            >
              <span>SCHEDULE DOORSTEP PICKUP</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="https://wa.me/919790361222?text=Hello%20PickoPick%20Courier%2C%20I%20want%20to%20schedule%20a%20doorstep%20pickup%20in%20India."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-xs font-extrabold tracking-wider text-white transition-colors hover:bg-white/20 cursor-pointer"
            >
              <FaWhatsapp className="h-4 w-4" />
              <span>CHAT ON WHATSAPP</span>
            </a>
          </div>

          {/* Trust points */}
          <div className="mx-auto mt-9 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/35 pt-5 text-xs text-white/80">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#FF6321]" />
              Free Doorstep Collection
            </span>
            <span className="inline-flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#FF6321]" />
              Volumetric Box Trimming
            </span>
            <span className="inline-flex items-center gap-2">
              <Plane className="h-4 w-4 text-[#FF6321]" />
              3–5 Days Express Delivery
            </span>
          </div>
        </div>
      </section>

      {/* Pickup Hub Quick Links Bar */}
      <section className="bg-[#F8FAFC] border-b border-slate-200/80 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
          <span className="font-extrabold text-[#0A1931] uppercase tracking-wider text-[11px] mr-1">
            Major Pickup Hubs:
          </span>
          {POPULAR_PICKUP_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setPickupCity(city);
                document
                  .getElementById("order-and-send-form")
                  ?.scrollIntoView();
              }}
              className="px-3 py-1 rounded-full bg-white border border-slate-200/80 text-slate-700 hover:border-[#0B56D9]/40 hover:text-[#0B56D9] transition-colors cursor-pointer text-xs font-medium"
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* How Order & Send Works (4-Step Section) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
              <Sparkles size={12} className="text-[#FF6321]" />
              End-to-End Reliability
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
              How Order &amp; Send <span className="text-[#0B56D9]">Works</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Effortless doorstep collection from your family or suppliers in
              India to your home overseas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between hover:border-[#0B56D9]/40 transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-[#0B56D9] px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                      Step {s.num}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#0A1931] tracking-tight">
                    {s.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceVisualShowcase
        eyebrow="Care from pickup to delivery"
        title="A reliable journey for every parcel"
        description="We collect your items in India, prepare them carefully, and arrange international delivery to your destination."
        items={[
          {
            title: "Doorstep collection",
            description: "Arrange pickup from your home, family, or supplier in India.",
            image: "/images/nri-services/personal-items.webp",
            alt: "Personal items ready to be shipped from India",
          },
          {
            title: "Careful repacking",
            description: "We inspect and repack parcels to help protect items and reduce excess volume.",
            image: "/images/nri-trust/professional-packing.webp",
            alt: "Pick O Pick checking and packing an international parcel",
          },
          {
            title: "Worldwide air delivery",
            description: "Choose international courier delivery with tracking to your door.",
            image: "/images/nri-trust/international-shipping.webp",
            alt: "Pick O Pick global air and courier shipping network",
          },
        ]}
        ctaTitle="Ready to send a parcel from India?"
        ctaDescription="Tell us what you’re sending and where it needs to go."
        ctaLabel="Book a pickup"
        targetId="order-and-send-form"
      />

      {/* Quote & Booking Form Section */}
      <section
        id="order-and-send-form"
        className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Form Card (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 hover:border-[#0B56D9]/40 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0B56D9] flex items-center justify-center shrink-0">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#0A1931] tracking-tight">
                      Book Doorstep Pickup &amp; Courier
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      We’ll calculate discounted freight rates and dispatch our
                      courier to the Indian address.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Sender / Customer Name"
                    value={customerName}
                    onChange={setCustomerName}
                    placeholder="Full name"
                  />
                  <FormInput
                    label="WhatsApp / Mobile Number"
                    value={mobileNumber}
                    onChange={setMobileNumber}
                    placeholder="+1 555 000 0000 or +91..."
                    type="tel"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Email Address"
                    value={customerEmail}
                    onChange={setCustomerEmail}
                    placeholder="you@example.com"
                    type="email"
                  />
                  <FormInput
                    label="Where to Send (Destination City / Zip Code)"
                    value={destinationLocation}
                    onChange={setDestinationLocation}
                    placeholder="e.g. London, UK EC1A 1BB"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Pickup City / Town (India)"
                    value={pickupCity}
                    onChange={setPickupCity}
                    placeholder="e.g. Chennai, Mylapore or 600004"
                  />

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                      Destination Country
                    </label>
                    <select
                      value={destinationCountry}
                      onChange={(e) => setDestinationCountry(e.target.value)}
                      className="w-full h-11 px-3.5 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-[#0A1931] outline-none transition-colors focus:border-[#0B56D9] focus:bg-white"
                    >
                      <option value="United States">United States (USA)</option>
                      <option value="United Kingdom">
                        United Kingdom (UK)
                      </option>
                      <option value="Canada">Canada</option>
                      <option value="United Arab Emirates">
                        United Arab Emirates (UAE)
                      </option>
                      <option value="Australia">Australia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Germany">Germany</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Other Country">Other Country</option>
                    </select>
                  </div>
                </div>

                {/* Weight selector pills */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    Approximate Weight Tier
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {WEIGHT_TIERS.map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setApproxWeight(tier)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          approxWeight === tier
                            ? "bg-[#0B56D9] text-white border border-[#0B56D9]"
                            : "bg-[#F8FAFC] border border-slate-200 text-slate-700 hover:border-[#0B56D9]/40"
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Parcel category pills */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    Parcel Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PARCEL_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setParcelType(cat)}
                        className={`p-2 text-left rounded-xl text-[11px] font-bold leading-tight transition-colors cursor-pointer ${
                          parcelType === cat
                            ? "bg-[#0B56D9] text-white border border-[#0B56D9]"
                            : "bg-[#F8FAFC] border border-slate-200 text-slate-700 hover:border-[#0B56D9]/40"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Links / Item Details */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    Share Product Links or List Items to Send{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={productLinks}
                    onChange={(e) => setProductLinks(e.target.value)}
                    placeholder="Share product links from Myntra, Meesho, Instagram, Flipkart, Amazon etc., or list personal items (e.g. homemade sweets, clothes, documents)..."
                    className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-[#0A1931] outline-none transition-colors focus:border-[#0B56D9] focus:bg-white"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Paste links from Myntra, Meesho, Instagram, Flipkart, Amazon, or describe packages for doorstep pickup.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-[#0B56D9] hover:bg-[#0849B7] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <FaWhatsapp size={17} />
                    <span>
                      {isSubmitting
                        ? "Submitting..."
                        : "Send Request to WhatsApp & Email"}
                    </span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-500 pt-1">
                  Direct connection with our logistics dispatch manager. An
                  official tracking reference code is provided immediately.
                </p>
              </form>
            </div>

            {/* Right Pricing Assurance (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 hover:border-[#0B56D9]/40 transition-colors duration-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#0B56D9] px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                    Smart Logistics
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Why Pick O Pick
                  </span>
                </div>

                <h4 className="text-lg font-extrabold text-[#0A1931] tracking-tight mb-4">
                  How We Save You Money
                </h4>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs sm:text-sm text-slate-700">
                    <Scale
                      size={16}
                      className="text-[#0B56D9] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-extrabold text-[#0A1931] text-xs">
                        Volumetric Box Trimming
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        Couriers charge by box volume. We cut down oversized
                        cartons and save you up to 40% on freight.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs sm:text-sm text-slate-700">
                    <ShieldCheck
                      size={16}
                      className="text-[#0B56D9] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-extrabold text-[#0A1931] text-xs">
                        Tamper-Evident Packaging
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        Multi-layer security tape, moisture protection, and
                        reinforced corrugated boxes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs sm:text-sm text-slate-700">
                    <FileText
                      size={16}
                      className="text-[#0B56D9] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-extrabold text-[#0A1931] text-xs">
                        Customs Compliance
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        We generate compliant commercial invoices and food
                        declaration paperwork for smooth overseas clearance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs sm:text-sm text-slate-700">
                    <Clock
                      size={16}
                      className="text-[#0B56D9] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-extrabold text-[#0A1931] text-xs">
                        3–5 Days Express Air Transit
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        Direct air cargo via DHL, FedEx, and Aramex with
                        continuous live tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cross-Link Card for Buy & Ship */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#0B56D9] px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                  Need Sourcing Help?
                </span>
                <h4 className="mt-3 text-base font-extrabold text-[#0A1931]">
                  Want us to buy from Indian shops?
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  If you don&apos;t have goods in India yet and want our team to
                  buy online from Indian shops, use our{" "}
                  <strong>Buy &amp; Ship</strong> assisted personal shopper
                  service.
                </p>
                <Link
                  to="/buy-and-ship"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0B56D9] hover:underline"
                >
                  <span>Go to Buy &amp; Ship Personal Shopper</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Allowed vs Prohibited Comparison Matrix */}
      <section
        id="allowed-items"
        className="py-16 sm:py-20 bg-white border-b border-slate-200/80 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
              <ShieldCheck size={12} className="text-[#FF6321]" />
              Shipping Guidelines
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
              What Can You Send{" "}
              <span className="text-[#0B56D9]">From India?</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Clear guidelines on compliant air cargo vs aviation prohibited
              materials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Allowed Items Card */}
            <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200/80 pb-3">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Check size={15} />
                </div>
                <h3 className="text-base font-extrabold text-[#0A1931]">
                  Allowed &amp; Popular Items
                </h3>
              </div>

              <div className="space-y-2.5">
                {ALLOWED_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 text-xs sm:text-sm text-slate-700"
                  >
                    <CheckCircle2
                      size={15}
                      className="text-emerald-600 shrink-0"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prohibited Items Card */}
            <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200/80 pb-3">
                <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                  <X size={15} />
                </div>
                <h3 className="text-base font-extrabold text-[#0A1931]">
                  Aviation Prohibited Items
                </h3>
              </div>

              <div className="space-y-2.5">
                {PROHIBITED_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 text-xs sm:text-sm text-slate-700"
                  >
                    <AlertTriangle
                      size={15}
                      className="text-red-500 shrink-0"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[11px] text-slate-500 border-t border-slate-200/80 pt-3">
                Unsure about an item? Message our WhatsApp support for instant
                customs verification before packing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
              <HelpCircle size={12} className="text-[#FF6321]" />
              Got Questions?
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
              Frequently Asked <span className="text-[#0B56D9]">Questions</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Questions and answers about our doorstep pickup and international
              courier process.
            </p>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-[#0B56D9]/40 transition-colors duration-200"
              >
                <h3 className="text-sm sm:text-base font-extrabold text-[#0A1931] flex items-center gap-2.5">
                  <HelpCircle size={16} className="text-[#0B56D9] shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
