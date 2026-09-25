import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Search,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { submitServiceRequest } from "../../../lib/serviceRequests";

// Comprehensive Dial Codes with Flags
const POPULAR_DIAL_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States / Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
];

const POPULAR_INDIAN_CITIES = [
  "Chennai, Tamil Nadu",
  "Coimbatore, Tamil Nadu",
  "Madurai, Tamil Nadu",
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Mumbai, Maharashtra",
  "Pune, Maharashtra",
  "Delhi, NCR",
  "Kolkata, West Bengal",
  "Kochi, Kerala",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Chandigarh, Punjab",
  "Lucknow, Uttar Pradesh",
];

const POPULAR_DESTINATIONS = [
  "United States (USA)",
  "United Kingdom (UK)",
  "Canada",
  "United Arab Emirates (Dubai)",
  "Singapore",
  "Australia",
  "Germany",
  "Malaysia",
  "France",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "New Zealand",
  "Ireland",
  "Netherlands",
];

export function PlanShipmentSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dialCode: "+91",
    mobileNumber: "",
    pickupLocation: "",
    dropLocation: "",
    itemsToShip: "",
  });

  const [pickupInput, setPickupInput] = useState("");
  const [dropInput, setDropInput] = useState("");
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropDropdown, setShowDropDropdown] = useState(false);
  const [showDialDropdown, setShowDialDropdown] = useState(false);
  const [dialSearch, setDialSearch] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    requestId: string;
    whatsappUrl: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickupRef.current &&
        !pickupRef.current.contains(event.target as Node)
      ) {
        setShowPickupDropdown(false);
      }
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setShowDropDropdown(false);
      }
      if (dialRef.current && !dialRef.current.contains(event.target as Node)) {
        setShowDialDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPickupCities = POPULAR_INDIAN_CITIES.filter((c) =>
    c.toLowerCase().includes(pickupInput.toLowerCase()),
  );

  const filteredDestinations = POPULAR_DESTINATIONS.filter((d) =>
    d.toLowerCase().includes(dropInput.toLowerCase()),
  );

  const filteredDialCodes = POPULAR_DIAL_CODES.filter(
    (dc) =>
      dc.country.toLowerCase().includes(dialSearch.toLowerCase()) ||
      dc.code.includes(dialSearch),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const finalPickup = pickupInput.trim() || formData.pickupLocation;
    const finalDrop = dropInput.trim() || formData.dropLocation;

    if (!formData.fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!formData.mobileNumber.trim()) {
      setErrorMsg("Please enter your contact mobile number.");
      return;
    }
    if (!finalPickup) {
      setErrorMsg("Please enter or select a pickup city in India.");
      return;
    }
    if (!finalDrop) {
      setErrorMsg("Please enter or select an international destination.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitServiceRequest("order_and_send", {
        customerName: formData.fullName,
        phone: `${formData.dialCode} ${formData.mobileNumber}`,
        email: formData.email,
        location: finalDrop,
        pickupLocation: finalPickup,
        dropLocation: finalDrop,
        itemsToShip: formData.itemsToShip,
      });
      setSubmissionSuccess({
        requestId: result.requestId,
        whatsappUrl: result.whatsappUrl,
      });
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDial =
    POPULAR_DIAL_CODES.find((d) => d.code === formData.dialCode) ||
    POPULAR_DIAL_CODES[0];

  return (
    <section
      id="order-and-send"
      className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-24"
    >
      <div id="plan-shipment" className="sr-only" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
            <Sparkles size={13} className="text-[#FF6321]" />
            Order &amp; Send • Doorstep Pickup &amp; Courier
          </div>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#0A1931] sm:text-5xl">
            India to your doorstep, <span className="text-[#0B56D9]">worldwide.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-base font-normal leading-relaxed text-slate-600 sm:text-lg">
            We collect across India, repack to reduce shipping weight, and deliver worldwide. Get a quick quote by WhatsApp or email.
          </p>

          <div className="mt-4 flex justify-center">
            <Link
              to="/order-and-send"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0B56D9] hover:underline"
            >
              <span>
                View complete Order &amp; Send service guide &amp; guidelines
              </span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* 2-Column Bento Grid: Left ONLY Image + Right Form */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: ONLY Image */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs flex items-center justify-center bg-slate-50">
            <img
              src="/images/pickopick-parcel-packing.webp"
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
                  Your reference code is{" "}
                  <span className="font-mono font-bold text-[#0B56D9] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    {submissionSuccess.requestId}
                  </span>
                  . WhatsApp has been opened and a confirmation email has been dispatched.
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
                    Get Instant Shipping Quote
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
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0A1931] placeholder:text-slate-400 font-medium focus:bg-white focus:border-[#0B56D9] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0A1931] placeholder:text-slate-400 font-medium focus:bg-white focus:border-[#0B56D9] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Searchable Dial Code Dropdown + Mobile Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mobile Number (WhatsApp){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Custom Searchable Country Dial Code Dropdown */}
                    <div ref={dialRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDialDropdown(!showDialDropdown)}
                        className="h-12 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-[#0A1931] flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                        title="Select country calling code"
                      >
                        <span className="text-base">{selectedDial.flag}</span>
                        <span>{formData.dialCode}</span>
                        <ChevronDown size={14} className="text-slate-400" />
                      </button>

                      {showDialDropdown && (
                        <div className="absolute left-0 top-full mt-1.5 w-72 max-h-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col">
                          {/* Search Dial Box */}
                          <div className="p-2 border-b border-slate-100 bg-slate-50">
                            <div className="relative">
                              <Search
                                size={14}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                              />
                              <input
                                type="text"
                                autoFocus
                                placeholder="Search country or code..."
                                value={dialSearch}
                                onChange={(e) => setDialSearch(e.target.value)}
                                className="w-full h-8 pl-8 pr-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-[#0A1931] outline-none focus:border-[#0B56D9]"
                              />
                            </div>
                          </div>

                          {/* Dial Code List */}
                          <div className="overflow-y-auto flex-1 p-1">
                            {filteredDialCodes.map((d) => (
                              <button
                                key={`${d.country}-${d.code}`}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    dialCode: d.code,
                                  });
                                  setShowDialDropdown(false);
                                  setDialSearch("");
                                }}
                                className={`w-full px-3 py-2 text-left text-xs rounded-lg flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                                  formData.dialCode === d.code
                                    ? "bg-blue-50 font-bold text-[#0B56D9]"
                                    : "text-[#0A1931]"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span>{d.flag}</span>
                                  <span className="truncate max-w-[140px]">
                                    {d.country}
                                  </span>
                                </span>
                                <span className="font-mono text-slate-500 font-bold">
                                  {d.code}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <input
                      type="tel"
                      required
                      placeholder="Enter your phone number"
                      value={formData.mobileNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobileNumber: e.target.value,
                        })
                      }
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0A1931] placeholder:text-slate-400 font-medium focus:bg-white focus:border-[#0B56D9] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Dropdown + Typeable Pickup Location & Drop Location */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Pickup Location */}
                  <div ref={pickupRef} className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Pickup Location (India){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Enter your pickup location"
                        value={pickupInput}
                        onChange={(e) => {
                          setPickupInput(e.target.value);
                          setShowPickupDropdown(true);
                        }}
                        onFocus={() => setShowPickupDropdown(true)}
                        className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0A1931] placeholder:text-slate-400 font-medium focus:bg-white focus:border-[#0B56D9] outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPickupDropdown(!showPickupDropdown)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {showPickupDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto p-1">
                        <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                          Popular Indian Cities
                        </div>
                        {filteredPickupCities.length > 0 ? (
                          filteredPickupCities.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                setPickupInput(city);
                                setFormData({
                                  ...formData,
                                  pickupLocation: city,
                                });
                                setShowPickupDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left text-xs font-semibold text-[#0A1931] hover:bg-blue-50 hover:text-[#0B56D9] rounded-lg transition-colors cursor-pointer"
                            >
                              {city}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-xs text-slate-400">
                            Use custom: &quot;{pickupInput}&quot;
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Drop Destination */}
                  <div ref={dropRef} className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Drop Destination (Global){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Enter your drop location"
                        value={dropInput}
                        onChange={(e) => {
                          setDropInput(e.target.value);
                          setShowDropDropdown(true);
                        }}
                        onFocus={() => setShowDropDropdown(true)}
                        className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0A1931] placeholder:text-slate-400 font-medium focus:bg-white focus:border-[#0B56D9] outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDropDropdown(!showDropDropdown)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {showDropDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto p-1">
                        <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                          Popular Destinations
                        </div>
                        {filteredDestinations.length > 0 ? (
                          filteredDestinations.map((dest) => (
                            <button
                              key={dest}
                              type="button"
                              onClick={() => {
                                setDropInput(dest);
                                setFormData({
                                  ...formData,
                                  dropLocation: dest,
                                });
                                setShowDropDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left text-xs font-semibold text-[#0A1931] hover:bg-blue-50 hover:text-[#0B56D9] rounded-lg transition-colors cursor-pointer"
                            >
                              {dest}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-xs text-slate-400">
                            Use custom: &quot;{dropInput}&quot;
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Items To Ship */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    What are you shipping? (e.g. Homemade food, clothes, gifts,
                    documents)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5kg homemade sweets, 2 silk sarees, spices"
                    value={formData.itemsToShip}
                    onChange={(e) =>
                      setFormData({ ...formData, itemsToShip: e.target.value })
                    }
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0A1931] placeholder:text-slate-400 font-medium focus:bg-white focus:border-[#0B56D9] outline-none transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 bg-[#0B56D9] hover:bg-[#0945AD] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#0B56D9]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FaWhatsapp size={19} className="text-[#25D366]" />
                  <span>
                    {isSubmitting
                      ? "Generating Rate Quote..."
                      : "Send Request to WhatsApp & Email"}
                  </span>
                  <ArrowRight size={16} />
                </button>

                <p className="text-[11px] text-center text-slate-400 font-medium">
                  🔒 We respect your privacy. Doorstep pickup arranged within 24
                  hours across India.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
