import React, { useState, useRef, useEffect } from "react";
import {
  CheckCircle2,
  MapPin,
  Mail,
  User,
  Phone,
  Scale,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { CountrySelect, COUNTRIES, CountryOption } from "../ui/CountrySelect";

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
  "Personal Items",
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
  "Kolkata",
  "Jaipur",
  "Tiruchirappalli",
  "Salem",
  "Trivandrum",
];

export function PlanShipmentSection() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const [destinationCountry, setDestinationCountry] = useState("United States");
  const [dialCode, setDialCode] = useState("+1");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedWeightPreset, setSelectedWeightPreset] = useState("5");
  const [isCustomWeight, setIsCustomWeight] = useState(false);
  const [customWeight, setCustomWeight] = useState("");
  const [packageType, setPackageType] = useState("Apparel & Sarees");
  const [showDialDropdown, setShowDialDropdown] = useState(false);
  const dialDropdownRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    requestId: string;
    whatsappUrl: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCityDropdownOpen(false);
      }
      if (
        dialDropdownRef.current &&
        !dialDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDialDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountryChange = (countryName: string, country: CountryOption) => {
    setDestinationCountry(countryName);
    if (country.dialCode) {
      setDialCode(country.dialCode);
    }
  };

  const getEffectiveWeight = () => {
    if (isCustomWeight) {
      return customWeight || "5";
    }
    return selectedWeightPreset;
  };

  const filteredCities = POPULAR_INDIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(pickupCity.toLowerCase().trim()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!pickupCity.trim()) {
      setErrorMsg("Please specify the pickup location in India.");
      return;
    }

    if (!whatsappNumber.trim()) {
      setErrorMsg("Please enter your WhatsApp phone number.");
      return;
    }

    const effectiveWeight = getEffectiveWeight();
    const fullPhone = `${dialCode} ${whatsappNumber.trim()}`;

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        whatsappNumber: fullPhone,
        customerEmail: customerEmail.trim(),
        pickupCity: pickupCity.trim(),
        destinationCountry: destinationCountry.trim(),
        approxWeightKg: parseFloat(effectiveWeight) || 5,
        packageType: packageType,
        requirementDescription: `Shipment from ${pickupCity.trim()} to ${destinationCountry.trim()} (${effectiveWeight} kg, ${packageType})`,
      };

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
        console.warn("Server estimate fallback:", err);
      }

      if (!waUrl) {
        const message = `Hello PickoPick team! 👋\n\nI would like to request an international shipping quote:\n\n📋 *Request ID:* ${generatedRequestId}\n👤 *Customer Name:* ${customerName.trim()}\n📱 *WhatsApp:* ${fullPhone}\n📧 *Email:* ${customerEmail.trim() || "Not provided"}\n📍 *Pickup Location:* ${pickupCity.trim()}, India\n🌍 *Destination Country:* ${destinationCountry.trim()}\n⚖️ *Approx. Weight:* ${effectiveWeight} kg\n📦 *Package Type:* ${packageType}\n\nPlease share the best available shipping rate and pickup schedule. Thank you!`;

        waUrl = `https://wa.me/919790361222?text=${encodeURIComponent(message)}`;
      }

      setSubmissionSuccess({
        requestId: generatedRequestId,
        whatsappUrl: waUrl,
      });

      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
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

        {/* 2-Column Bento Grid: Left ONLY Image + Right Form */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: ONLY Image */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs flex items-center justify-center bg-slate-50">
            <img
              src="/images/pickopick-parcel-packing.jpg"
              alt="PickOPick Packaging Specialist preparing an international parcel from India"
              className="w-full h-full object-cover min-h-[380px] sm:min-h-[480px] lg:min-h-full"
              loading="lazy"
            />
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-xs flex flex-col justify-center">
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
                  <span className="font-mono font-bold text-[#0B56D9] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    {submissionSuccess.requestId}
                  </span>
                  . WhatsApp has been opened with your pre-filled shipment quote
                  details.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={submissionSuccess.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0B56D9] hover:bg-[#0945AD] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                  >
                    <FaWhatsapp size={19} className="text-[#25D366]" />
                    Continue on WhatsApp
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
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A1931] tracking-tight">
                    Get Instant WhatsApp Shipping Quote
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Provide your shipment details. We prepare the lowest
                    air-carrier quote in minutes.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                    {errorMsg}
                  </div>
                )}

                {/* 1. Full Name & Email Address */}
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
                        placeholder="Enter your name"
                        className="w-full h-12 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#0A1931] placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#0B56D9] focus:ring-1 focus:ring-[#0B56D9] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address{" "}
                      <span className="text-slate-400 font-normal">
                        (Optional)
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
                        placeholder="Enter your email"
                        className="w-full h-12 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#0A1931] placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#0B56D9] focus:ring-1 focus:ring-[#0B56D9] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Pickup Location in India (Interactive Searchable Dropdown) */}
                <div ref={cityDropdownRef} className="relative">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Pickup Location in India{" "}
                    <span className="text-[#FF6321]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
                    />
                    <input
                      type="text"
                      required
                      value={pickupCity}
                      onFocus={() => setIsCityDropdownOpen(true)}
                      onChange={(e) => {
                        setPickupCity(e.target.value);
                        setIsCityDropdownOpen(true);
                      }}
                      placeholder="Enter your location"
                      className="w-full h-12 pl-10 pr-10 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#0A1931] placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#0B56D9] focus:ring-1 focus:ring-[#0B56D9] transition-all"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setIsCityDropdownOpen((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isCityDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Dropdown Menu for Popular Cities */}
                  {isCityDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Popular Hubs & Cities
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Or type any Indian city
                        </span>
                      </div>

                      <div className="max-h-48 overflow-y-auto p-1.5">
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city) => {
                            const isSelected =
                              pickupCity.toLowerCase().trim() ===
                              city.toLowerCase();
                            return (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setPickupCity(city);
                                  setIsCityDropdownOpen(false);
                                }}
                                className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-xs text-left transition-colors cursor-pointer ${
                                  isSelected
                                    ? "bg-blue-50 text-[#0B56D9] font-bold"
                                    : "hover:bg-slate-50 text-slate-700 font-medium"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <MapPin
                                    size={13}
                                    className={
                                      isSelected
                                        ? "text-[#0B56D9]"
                                        : "text-slate-400"
                                    }
                                  />
                                  <span>{city}</span>
                                </span>
                                {isSelected && (
                                  <Check size={14} className="text-[#0B56D9]" />
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-3 py-2 text-xs text-slate-500">
                            Use "{pickupCity.trim()}" as pickup location
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Destination Country (Custom Flag Dropdown) */}
                <div>
                  <CountrySelect
                    value={destinationCountry}
                    onChange={handleCountryChange}
                    label="Destination Country"
                  />
                </div>

                {/* 4. WhatsApp Number with Selectable Country Dial Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    WhatsApp Number <span className="text-[#FF6321]">*</span>
                  </label>
                  <div className="flex gap-2">
                    {/* Dial Code Selector */}
                    <div ref={dialDropdownRef} className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowDialDropdown(!showDialDropdown)}
                        className="h-12 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5 text-xs font-bold text-[#0A1931] transition-colors cursor-pointer"
                      >
                        <span>{dialCode}</span>
                        <ChevronDown size={14} className="text-slate-400" />
                      </button>

                      {showDialDropdown && (
                        <div className="absolute left-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto p-1">
                          {COUNTRIES.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setDialCode(c.dialCode);
                                setShowDialDropdown(false);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs hover:bg-slate-50 transition-colors text-left cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                <span>{c.flag}</span>
                                <span className="truncate">{c.name}</span>
                              </span>
                              <span className="font-bold text-slate-500 ml-1.5">
                                {c.dialCode}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Number Input */}
                    <div className="relative flex-1">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="tel"
                        required
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="Enter your phone or WhatsApp number"
                        className="w-full h-12 pl-10 pr-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#0A1931] placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#0B56D9] focus:ring-1 focus:ring-[#0B56D9] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Approximate Weight (Choosable Presets + Optional Custom) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Approximate Weight{" "}
                      <span className="text-[#FF6321]">*</span>
                    </label>
                    <span className="text-xs text-slate-400 font-medium">
                      Actual or volumetric
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {WEIGHT_PRESETS.map((preset) => {
                      const isSelected =
                        !isCustomWeight &&
                        selectedWeightPreset === preset.value;
                      return (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => {
                            setSelectedWeightPreset(preset.value);
                            setIsCustomWeight(false);
                          }}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#0B56D9] text-white border border-[#0B56D9]"
                              : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}

                    {/* Custom Weight Choice */}
                    <button
                      type="button"
                      onClick={() => setIsCustomWeight(true)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCustomWeight
                          ? "bg-[#0B56D9] text-white border border-[#0B56D9]"
                          : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Custom...
                    </button>
                  </div>

                  {/* Show Custom Input ONLY when Custom is chosen */}
                  {isCustomWeight && (
                    <div className="relative mt-2.5">
                      <Scale
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        required={isCustomWeight}
                        value={customWeight}
                        onChange={(e) => setCustomWeight(e.target.value)}
                        placeholder="Enter custom weight in kg (e.g. 7.5)"
                        className="w-full h-11 pl-10 pr-12 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#0A1931] placeholder:text-slate-400 focus:outline-none focus:border-[#0B56D9] focus:ring-1 focus:ring-[#0B56D9] transition-all"
                        autoFocus
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase pointer-events-none">
                        KG
                      </span>
                    </div>
                  )}
                </div>

                {/* 6. Package Category */}
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
                            ? "bg-[#0B56D9] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Action Button (Blue Color on Normal & Hover) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#0B56D9] hover:bg-[#0945AD] text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-colors cursor-pointer group shadow-none"
                  >
                    <FaWhatsapp size={22} className="text-white shrink-0" />
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
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
