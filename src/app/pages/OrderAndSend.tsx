import { useEffect, useState, type FormEvent } from "react";
import {
  Truck,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Plane,
  AlertTriangle,
  Scale,
  FileText,
  Clock,
  Check,
  X,
  MapPin,
  CalendarCheck,
  Home,
  Globe2,
  Percent,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { submitServiceRequest } from "../../lib/serviceRequests";
import {
  BluePanel,
  COUNTRY_OPTIONS,
  CrossLinkBanner,
  FaqAccordion,
  FieldLabel,
  FormGroup,
  FormInput,
  HeroPrimaryButton,
  HeroSecondaryButton,
  PageHero,
  SectionHeader,
  StatsBar,
  StepsTimeline,
  fieldClass,
} from "../components/ServicePage";

const WHATSAPP_COURIER_URL =
  "https://wa.me/919790361222?text=Hello%20PickoPick%20Courier%2C%20I%20want%20to%20schedule%20a%20doorstep%20pickup%20in%20India.";

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
    icon: CalendarCheck,
    title: "Schedule Pickup Online",
    desc: "Enter the pickup address in India and destination details abroad. Choose your preferred pickup time slot.",
  },
  {
    num: "02",
    icon: Home,
    title: "Doorstep Collection in India",
    desc: "Our courier executive visits the Indian address, hands over an instant receipt, and safely collects the parcel.",
  },
  {
    num: "03",
    icon: Scale,
    title: "Box Trimming & Repacking",
    desc: "At our central hub, we inspect, trim empty dead space, custom repack, and share WhatsApp photo/video proof.",
  },
  {
    num: "04",
    icon: Plane,
    title: "Express Air Delivery Abroad",
    desc: "Dispatched via DHL, FedEx, or Aramex with customs clearance and handed over at your foreign doorstep in 3–5 days.",
  },
];

const SAVINGS = [
  {
    icon: Scale,
    title: "Volumetric Box Trimming",
    text: "Couriers charge by box volume. We cut down oversized cartons and save you up to 40% on freight.",
  },
  {
    icon: ShieldCheck,
    title: "Tamper-Evident Packaging",
    text: "Multi-layer security tape, moisture protection, and reinforced corrugated boxes.",
  },
  {
    icon: FileText,
    title: "Customs Compliance",
    text: "We generate compliant commercial invoices and food declaration paperwork for smooth overseas clearance.",
  },
  {
    icon: Clock,
    title: "3–5 Days Express Air Transit",
    text: "Direct air cargo via DHL, FedEx, and Aramex with continuous live tracking.",
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

const pillClass = (active: boolean) =>
  `rounded-xl border text-xs font-bold transition-colors ${
    active
      ? "border-[#0B56D9] bg-[#0B56D9] text-white"
      : "border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-[#0B56D9]/40"
  }`;

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

  const handleSubmitQuote = async (e: FormEvent) => {
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

    // Open WhatsApp immediately inside the click gesture so the request
    // always reaches WhatsApp (popup blockers kill async window.open).
    const waMessage = [
      "Hello Pick O Pick, new *Order & Send* request:",
      `Name: ${customerName}`,
      `Phone: ${mobileNumber}`,
      `Email: ${customerEmail}`,
      `Pickup City (India): ${pickupCity}`,
      `Destination: ${destinationLocation}, ${destinationCountry}`,
      `Approx Weight: ${approxWeight}`,
      `Parcel Category: ${parcelType}`,
      `Items / Links: ${productLinks}`,
    ].join("\n");
    window.open(
      `https://wa.me/919790361222?text=${encodeURIComponent(waMessage)}`,
      "_blank",
      "noopener,noreferrer",
    );

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
      toast.success(
        result.emailSent
          ? "Order & Send request sent to WhatsApp — confirmation email dispatched too!"
          : "Order & Send request sent to WhatsApp! We will confirm shortly.",
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
      {/* ───────── Hero ───────── */}
      <PageHero
        eyebrow="Order & Send • Doorstep Pickup & Courier"
        title="Doorstep Pickup in India."
        highlight="Express Delivery Worldwide."
        description="Have homemade delicacies, sweets, garments, documents, or personal gifts at home in India? We collect directly from your Indian doorstep across 25,000+ pincodes, repack to trim volumetric dead weight, and express-courier to 200+ countries."
        image="/images/nri-trust/international-shipping.webp"
        imageAlt="Pick O Pick plane, ship and truck delivering parcels worldwide"
        floatingChips={[
          { icon: Home, label: "Free doorstep collection" },
          { icon: Scale, label: "Volumetric box trimming" },
          { icon: Plane, label: "3–5 day express" },
        ]}
        actions={
          <>
            <HeroPrimaryButton href="#order-and-send-form">
              Schedule Doorstep Pickup
            </HeroPrimaryButton>
            <HeroSecondaryButton href={WHATSAPP_COURIER_URL}>
              <FaWhatsapp size={16} />
              Chat on WhatsApp
            </HeroSecondaryButton>
          </>
        }
      />

      <StatsBar
        stats={[
          { icon: MapPin, value: "25,000+", label: "Pickup pincodes" },
          { icon: Percent, value: "Up to 40%", label: "Freight saved by repacking" },
          { icon: Globe2, value: "200+", label: "Destination countries" },
          { icon: Plane, value: "3–5 days", label: "Express delivery" },
        ]}
      />

      {/* ───────── Pickup hubs ribbon ───────── */}
      <section className="pt-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 sm:px-8">
          <span className="mr-1 text-[11px] font-black uppercase tracking-widest text-slate-400">
            Major pickup hubs
          </span>
          {POPULAR_PICKUP_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setPickupCity(city);
                document.getElementById("order-and-send-form")?.scrollIntoView();
              }}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0B56D9] hover:bg-blue-50 hover:text-[#0B56D9]"
            >
              <MapPin size={11} />
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <SectionHeader
            eyebrow="End-to-end reliability"
            title="How Order & Send"
            highlight="Works"
            description="Effortless doorstep collection from your family or suppliers in India to your home overseas."
          />
          <StepsTimeline steps={STEPS} />
        </div>
      </section>

      {/* ───────── Booking form ───────── */}
      <section
        id="order-and-send-form"
        className="scroll-mt-24 border-y border-slate-200/80 bg-[#F7F9FF] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <SectionHeader
            eyebrow="Book a pickup"
            title="Schedule your"
            highlight="doorstep pickup"
            description="We’ll calculate discounted freight rates and dispatch our courier to the Indian address."
          />

          <div className="grid items-start gap-8 lg:grid-cols-12">
            <form
              onSubmit={handleSubmitQuote}
              className="space-y-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(11,86,217,0.5)] sm:p-9 lg:col-span-7"
            >
              <FormGroup step="1" title="Pickup & parcel">
                <FormInput
                  label="Pickup City / Town (India)"
                  value={pickupCity}
                  onChange={setPickupCity}
                  placeholder="e.g. Chennai, Mylapore or 600004"
                />

                <div>
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">
                    Approximate Weight
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {WEIGHT_TIERS.map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        aria-pressed={approxWeight === tier}
                        onClick={() => setApproxWeight(tier)}
                        className={`px-4 py-2.5 ${pillClass(approxWeight === tier)}`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">
                    Parcel Category
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {PARCEL_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        aria-pressed={parcelType === cat}
                        onClick={() => setParcelType(cat)}
                        className={`p-3 text-left leading-tight ${pillClass(parcelType === cat)}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <FieldLabel label="Share Product Links or List Items to Send" required>
                  <textarea
                    required
                    rows={3}
                    value={productLinks}
                    onChange={(e) => setProductLinks(e.target.value)}
                    placeholder="Share product links from Myntra, Meesho, Instagram, Flipkart, Amazon etc., or list personal items (e.g. homemade sweets, clothes, documents)..."
                    className={`${fieldClass.replace("h-12 ", "")} resize-none py-3`}
                  />
                </FieldLabel>
              </FormGroup>

              <div className="border-t border-dashed border-slate-200" />

              <FormGroup step="2" title="Your details">
                <div className="grid gap-4 sm:grid-cols-2">
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
                <FormInput
                  label="Email Address"
                  value={customerEmail}
                  onChange={setCustomerEmail}
                  placeholder="you@example.com"
                  type="email"
                />
              </FormGroup>

              <div className="border-t border-dashed border-slate-200" />

              <FormGroup step="3" title="Delivery abroad">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Destination City / Zip Code"
                    value={destinationLocation}
                    onChange={setDestinationLocation}
                    placeholder="e.g. London, UK EC1A 1BB"
                  />
                  <FieldLabel label="Destination Country">
                    <select
                      value={destinationCountry}
                      onChange={(e) => setDestinationCountry(e.target.value)}
                      className={fieldClass}
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </FieldLabel>
                </div>
              </FormGroup>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0B56D9] text-sm font-extrabold text-white shadow-lg shadow-[#0B56D9]/25 transition-colors hover:bg-[#0849B7] disabled:opacity-60"
                >
                  <FaWhatsapp size={18} />
                  <span>
                    {isSubmitting
                      ? "Submitting..."
                      : "Send Order & Send Request to WhatsApp & Email"}
                  </span>
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
                <p className="pt-3 text-center text-[11px] text-slate-500">
                  Direct connection with our logistics dispatch manager. An
                  official tracking reference code is provided immediately.
                </p>
              </div>
            </form>

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-28 lg:col-span-5">
              <BluePanel className="rounded-[28px]">
                <div className="p-7 sm:p-8">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-100">
                    Smart logistics
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold tracking-tight">
                    How We Save You Money
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {SAVINGS.map(({ icon: Icon, title, text }) => (
                      <li key={title} className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0B56D9]">
                          <Icon size={16} />
                        </span>
                        <span>
                          <span className="block text-sm font-extrabold">{title}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-blue-100">
                            {text}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </BluePanel>

              <a
                href={WHATSAPP_COURIER_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-5 transition-colors hover:border-[#0B56D9]/40"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <FaWhatsapp size={22} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-extrabold text-[#0A1931]">
                    Need a pickup today?
                  </span>
                  <span className="block text-xs text-slate-500">
                    Message our dispatch team on WhatsApp.
                  </span>
                </span>
                <ArrowRight
                  size={16}
                  className="text-[#0B56D9] transition-transform group-hover:translate-x-1"
                />
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* ───────── Allowed vs prohibited ───────── */}
      <section id="allowed-items" className="scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <SectionHeader
            eyebrow="Shipping guidelines"
            title="What Can You Send"
            highlight="From India?"
            description="Clear guidelines on compliant air cargo vs aviation prohibited materials."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#0B56D9]">
                  <Check size={18} />
                </span>
                <h3 className="text-lg font-extrabold text-[#0A1931]">
                  Allowed &amp; Popular Items
                </h3>
              </div>
              <ul className="divide-y divide-slate-100">
                {ALLOWED_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 py-3 text-sm text-slate-700"
                  >
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#0B56D9]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <X size={18} />
                </span>
                <h3 className="text-lg font-extrabold text-[#0A1931]">
                  Aviation Prohibited Items
                </h3>
              </div>
              <ul className="divide-y divide-slate-100">
                {PROHIBITED_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 py-3 text-sm text-slate-700"
                  >
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={WHATSAPP_COURIER_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center gap-2 rounded-2xl bg-blue-50 p-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-blue-100"
              >
                <Truck size={16} className="shrink-0 text-[#0B56D9]" />
                Unsure about an item? Message our WhatsApp support for instant
                customs verification before packing.
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FAQs ───────── */}
      <section className="border-t border-slate-200/80 bg-[#F7F9FF] py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            align="left"
            eyebrow="Got questions?"
            title="Frequently Asked"
            highlight="Questions"
            description="Questions and answers about our doorstep pickup and international courier process."
          />
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>

      <CrossLinkBanner
        eyebrow="Need sourcing help?"
        title="Want us to buy from Indian shops?"
        description={
          <>
            If you don&apos;t have goods in India yet and want our team to buy
            online from Indian shops, use our <strong>Buy &amp; Ship</strong>{" "}
            assisted personal shopper service.
          </>
        }
        to="/buy-and-ship"
        cta="Go to Buy & Ship"
        image="/images/nri-trust/shop-from-india.webp"
      />
    </main>
  );
}
