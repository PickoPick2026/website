import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Mail,
  User,
  Phone,
  Scale,
  Sparkles,
  ArrowRight,
  Package,
  Plane,
  Truck,
  Building,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { CountrySelect, CountryOption } from "../ui/CountrySelect";

const WEIGHT_PRESETS = [
  { label: "1 – 2 kg", value: "2" },
  { label: "3 – 5 kg", value: "5" },
  { label: "5 – 10 kg", value: "10" },
  { label: "10 – 20 kg", value: "15" },
  { label: "20+ kg", value: "25" },
];

const PACKAGE_TYPES = [
  "Apparel & Sarees",
  "Food & Groceries",
  "Personal Belongings",
  "Pooja & Brassware",
  "Documents",
  "Commercial Cargo",
];

const POPULAR_INDIAN_CITIES = [
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Mumbai",
  "Delhi NCR",
  "Coimbatore",
  "Madurai",
  "Kochi",
  "Pune",
  "Ahmedabad",
];

export function PlanShipmentSection() {
  const [customerName, setCustomerName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("United States");
  const [selectedCountryObj, setSelectedCountryObj] =
    useState<CountryOption | null>(null);
  const [approxWeight, setApproxWeight] = useState("5");
  const [packageType, setPackageType] = useState("Apparel & Sarees");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    requestId: string;
    whatsappUrl: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCountryChange = (countryName: string, country: CountryOption) => {
    setDestinationCountry(countryName);
    setSelectedCountryObj(country);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    if (!whatsappNumber.trim()) {
      setErrorMsg("Please enter your WhatsApp or phone number.");
      return;
    }

    if (!pickupCity.trim()) {
      setErrorMsg("Please specify the pickup city in India.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        whatsappNumber: whatsappNumber.trim(),
        customerEmail: customerEmail.trim(),
        pickupCity: pickupCity.trim(),
        destinationCountry: destinationCountry.trim(),
        approxWeightKg: parseFloat(approxWeight) || 5,
        packageType: packageType,
        requirementDescription: `Shipment from ${pickupCity.trim()} to ${destinationCountry.trim()} (${approxWeight} kg, ${packageType})`,
      };

      // 1. Send to server estimate-request endpoint to record lead and obtain official reference ID
      let generatedRequestId = `POP-EST-${Date.now().toString().slice(-6)}`;
      let waUrl = "";

      try {
        const res = await fetch("/api/estimate-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "estimate_request",
            payload,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.requestId) generatedRequestId = data.requestId;
          if (data?.whatsappUrl) waUrl = data.whatsappUrl;
        }
      } catch (err) {
        // Backend optional fallback, continue to WhatsApp directly
        console.warn("Server estimate request fallback:", err);
      }

      // 2. Build official WhatsApp message if not returned by server
      if (!waUrl) {
        const flag = selectedCountryObj?.flag || "🌍";
        const message = `Hello PickoPick team! 👋\n\nI would like to request an international shipping quote:\n\n📋 *Request ID:* ${generatedRequestId}\n👤 *Customer Name:* ${customerName.trim()}\n📱 *WhatsApp:* ${whatsappNumber.trim()}\n📧 *Email:* ${customerEmail.trim() || "Not provided"}\n📍 *Pickup City:* ${pickupCity.trim()}, India\n${flag} *Destination Country:* ${destinationCountry.trim()}\n⚖️ *Approx. Weight:* ${approxWeight} kg\n📦 *Package Type:* ${packageType}\n\nPlease share the best available shipping rate and pickup schedule. Thank you!`;

        waUrl = `https://wa.me/919790361222?text=${encodeURIComponent(message)}`;
      }

      setSubmissionSuccess({
        requestId: generatedRequestId,
        whatsappUrl: waUrl,
      });

      // 3. Open WhatsApp in new tab
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
            <Sparkles size={13} className="text-[#FF6321]" />
            Plan Your Shipment
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A1931] leading-tight">
            From Your Door in India. <br className="hidden sm:inline" />
            <span className="text-[#0B56D9]">To Your World Overseas.</span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Doorstep pickup from any Indian city, free repackaging, and express
            worldwide air delivery. Instant quotes shared directly on WhatsApp.
          </p>
        </div>

        {/* Bento Grid: Left Branded Capability Card + Right Interactive Form */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: PickoPick Verified Logistics Showcase */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Branded Card with background image overlay */}
            <div
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-7 sm:p-9 text-white bg-[#0B56D9] border border-blue-600"
              style={{
                backgroundImage: "url('/images/nri-hero-logistics-v2.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Blue Overlay */}
              <div className="absolute inset-0 bg-[#0B56D9]/85 backdrop-blur-[0.5px] z-0" />

              <div className="relative z-10">
                <span className="text-[11px] font-black uppercase tracking-widest text-white px-2.5 py-1 rounded-full bg-white/15 border border-white/25">
                  Direct WhatsApp Quotation
                </span>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-4">
                  A real quote, tailored for your parcel.
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Never automated guesswork. Our Chennai operations hub inspects
                  dimensions, optimizes package consolidation, and gives you the
                  lowest carrier rates.
                </p>

                {/* 4-Step Journey */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center font-black text-xs shrink-0">
                      01
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Doorstep Pickup in India
                      </h4>
                      <p className="text-xs text-blue-100/90 mt-0.5">
                        Free collection from your home, vendor, or regional
                        store across India.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center font-black text-xs shrink-0">
                      02
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Inspection & Repackaging
                      </h4>
                      <p className="text-xs text-blue-100/90 mt-0.5">
                        5-ply protective cartons, vacuum sealing for foods, and
                        photo confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center font-black text-xs shrink-0">
                      03
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        International Express Air
                      </h4>
                      <p className="text-xs text-blue-100/90 mt-0.5">
                        Dispatched via DHL, FedEx, and Aramex with continuous
                        live tracking.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center font-black text-xs shrink-0">
                      04
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Doorstep Delivery Overseas
                      </h4>
                      <p className="text-xs text-blue-100/90 mt-0.5">
                        Delivered safely to your destination address in 3–7
                        business days.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Contact Pill */}
                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-blue-200">Official Helpline: </span>
                    <span className="font-bold text-white">
                      +91 97903 61222
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online Now
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 text-center">
                <div className="text-[#0B56D9] font-black text-sm sm:text-base">
                  220+
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  Countries Served
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 text-center">
                <div className="text-[#0B56D9] font-black text-sm sm:text-base">
                  3 – 7
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  Transit Days
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 text-center">
                <div className="text-[#FF6321] font-black text-sm sm:text-base">
                  100%
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  Customs Cleared
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Efficiency Interactive Request Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-9">
            {submissionSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0A1931]">
                  Quote Request Initiated!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your verification code is{" "}
                  <span className="font-mono font-bold text-[#0B56D9] bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                    {submissionSuccess.requestId}
                  </span>
                  . WhatsApp has been opened with your pre-formatted quote
                  details.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={submissionSuccess.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    <FaWhatsapp size={18} />
                    Continue to WhatsApp Chat
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmissionSuccess(null)}
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#0A1931] font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    Request Another Quote
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A1931] tracking-tight">
                    Get Instant WhatsApp Shipping Quote
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Fill in your shipment details to connect with our logistics
                    desk.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                    {errorMsg}
                  </div>
                )}

                {/* Row 1: Name & WhatsApp Number */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Full Name <span className="text-[#FF6321]">*</span>
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full h-12 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#0A1931] placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#0B56D9] focus:ring-1 focus:ring-[#0B56D9] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      WhatsApp Number <span className="text-[#FF6321]">*</span>
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="tel"
                        required
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="+1 234 567 8900"
                        className="w-full h-12 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#0A1931] placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#0B56D9] focus:ring-1 focus:ring-[#0B56D9] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email & Pickup City */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address{" "}
                      <span className="text-slate-400 font-normal">
                        (For copy of invoice)
                      </span>
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full h-12 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#0A1931] placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#0B56D9] focus:ring-1 focus:ring-[#0B56D9] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Pickup City in India{" "}
                      <span className="text-[#FF6321]">*</span>
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        list="popular-indian-cities"
                        required
                        value={pickupCity}
                        onChange={(e) => setPickupCity(e.target.value)}
                        placeholder="e.g. Chennai, Bangalore, Mumbai"
                        className="w-full h-12 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#0A1931] placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#0B56D9] focus:ring-1 focus:ring-[#0B56D9] transition-all"
                      />
                      <datalist id="popular-indian-cities">
                        {POPULAR_INDIAN_CITIES.map((city) => (
                          <option key={city} value={city} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </div>

                {/* Row 3: Destination Country with Flag Dropdown */}
                <div>
                  <CountrySelect
                    value={destinationCountry}
                    onChange={handleCountryChange}
                    label="Destination Country"
                  />
                </div>

                {/* Row 4: Approximate Weight with Quick Select Chips */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Approximate Weight{" "}
                      <span className="text-[#FF6321]">*</span>
                    </label>
                    <span className="text-xs text-slate-400 font-medium">
                      Higher of actual or volumetric
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mb-2.5">
                    {WEIGHT_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setApproxWeight(preset.value)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          approxWeight === preset.value
                            ? "bg-[#0B56D9] text-white border border-[#0B56D9]"
                            : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Scale
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      required
                      value={approxWeight}
                      onChange={(e) => setApproxWeight(e.target.value)}
                      placeholder="Custom weight"
                      className="w-full h-12 pl-10 pr-12 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#0A1931] placeholder:text-slate-400 focus:outline-none focus:border-[#0B56D9] focus:ring-1 focus:ring-[#0B56D9] transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase pointer-events-none">
                      KG
                    </span>
                  </div>
                </div>

                {/* Row 5: Package Type Pills */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Package Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PACKAGE_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPackageType(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          packageType === type
                            ? "bg-[#0A1931] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#0A1931] hover:bg-[#0B56D9] text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-colors cursor-pointer group shadow-none"
                  >
                    <FaWhatsapp size={22} className="text-[#25D366] shrink-0" />
                    <span>
                      {isSubmitting
                        ? "Generating Quotation..."
                        : "Get Live Quote on WhatsApp"}
                    </span>
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>

                {/* Subtext info */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
                  <ShieldCheck
                    size={14}
                    className="text-emerald-600 shrink-0"
                  />
                  <span>
                    No spam. 100% verified quote directly on WhatsApp with
                    official reference code.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
