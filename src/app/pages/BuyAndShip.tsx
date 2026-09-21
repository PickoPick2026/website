import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Link2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Plane,
  ExternalLink,
  Package,
  Store,
  Clipboard,
  HelpCircle,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { submitServiceRequest } from "../../lib/serviceRequests";

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

const QUICK_STORES = [
  "Amazon.in",
  "Myntra",
  "Ajio",
  "Flipkart",
  "Nykaa",
  "Meesho",
  "Fabindia",
  "Taneira",
  "Local Boutique",
];

const STEPS = [
  {
    num: "01",
    title: "Discover Any Product in India",
    desc: "Browse Indian e-commerce sites (Amazon.in, Myntra, Ajio, Nykaa) or local specialty shops in Chennai, Mumbai, or Delhi.",
  },
  {
    num: "02",
    title: "Share Link or Photo",
    desc: "Paste the product link or send item screenshots with size and color. No Indian card or local phone OTP is needed.",
  },
  {
    num: "03",
    title: "We Purchase & Verify",
    desc: "Our India team purchases the items in INR, inspects them at our Chennai center, and provides free 30-day locker storage.",
  },
  {
    num: "04",
    title: "Consolidate & Express Deliver",
    desc: "We combine orders from multiple shops into one box to save up to 80% on shipping, then express fly to your doorstep in 3–5 days.",
  },
];

const CHECKLIST_ITEMS = [
  {
    title: "Product Web Link or Clear Screenshot",
    detail:
      "Direct URL from any Indian website or screenshots of the items you wish to purchase.",
  },
  {
    title: "Exact Sizing & Variant Specs",
    detail:
      "Color, size, variant, brand, and desired quantity so we buy the exact match.",
  },
  {
    title: "Destination Country & Zip Code",
    detail:
      "Your delivery country and postal code so we can estimate the fastest shipping option.",
  },
  {
    title: "Special Inspection Notes",
    detail:
      "Let us know if you need specific measurements or fabric photos upon warehouse arrival.",
  },
];

const POPULAR_STORES = [
  {
    category: "Fashion & Ethnic Wear",
    stores: [
      {
        name: "Myntra",
        desc: "Ethnic wear, festive apparel & kurtas",
        link: "/shop?category=Dresses",
      },
      {
        name: "Ajio",
        desc: "Indie brands & artisanal apparel",
        link: "https://www.ajio.com",
        external: true,
      },
      {
        name: "Nykaa Fashion",
        desc: "Designer sarees, lehengas & footwear",
        link: "https://www.nykaafashion.com",
        external: true,
      },
      {
        name: "Fabindia",
        desc: "Handcrafted cottons & festive linens",
        link: "https://www.fabindia.com",
        external: true,
      },
    ],
  },
  {
    category: "General & Mega Marketplaces",
    stores: [
      {
        name: "Amazon India",
        desc: "Kitchenware, books, electronics & ayurveda",
        link: "https://www.amazon.in",
        external: true,
      },
      {
        name: "Flipkart",
        desc: "Indian electronics, appliances & lifestyle",
        link: "https://www.flipkart.com",
        external: true,
      },
      {
        name: "Tata CLiQ",
        desc: "Authentic luxury & premium Indian brands",
        link: "https://www.tatacliq.com",
        external: true,
      },
      {
        name: "Meesho",
        desc: "Budget regional fashion & home goods",
        link: "https://www.meesho.com",
        external: true,
      },
    ],
  },
  {
    category: "Authentic Regional Foods & Sweets",
    stores: [
      {
        name: "Mambalam Iyers",
        desc: "Authentic South Indian pickles, podis & pastes",
        link: "/shop?category=Sweets+and+Savories",
      },
      {
        name: "Nandri Masala",
        desc: "Fresh ground regional Indian spice blends",
        link: "/shop?category=Groceries",
      },
      {
        name: "Sri Krishna Sweets",
        desc: "World-famous Mysore Pak & traditional sweets",
        link: "/shop?category=Sweets+and+Savories",
      },
      {
        name: "Haldiram's / Anand Sweets",
        desc: "Traditional regional Indian snacks",
        link: "/shop?category=Sweets+and+Savories",
      },
    ],
  },
  {
    category: "Pooja Items & Handicrafts",
    stores: [
      {
        name: "Best Terracotta",
        desc: "Handmade Indian clay cookware & decor",
        link: "/shop?category=Home+Decorations",
      },
      {
        name: "Giri Trading",
        desc: "Temple pooja idols, brass lamps & spiritual books",
        link: "/shop?category=Pooja+Items",
      },
      {
        name: "Craftsvilla",
        desc: "Authentic Indian handicrafts & artifacts",
        link: "/shop?category=Home+Decorations",
      },
      {
        name: "Jaypore",
        desc: "Curated Indian handloom & artisanal jewelry",
        link: "https://www.jaypore.com",
        external: true,
      },
    ],
  },
];

const FAQS = [
  {
    q: "What is Buy & Ship vs Order & Send?",
    a: "Buy & Ship is our Assisted Shopping Service where Pick O Pick buys items on your behalf from Indian websites or physical shops when you don't have an Indian payment card. Order & Send is for packages you or your family already possess in India that you want us to pick up from your doorstep and courier internationally.",
  },
  {
    q: "How do I pay for the items purchased?",
    a: "We accept international debit/credit cards (Visa, MasterCard, American Express), PayPal, Wise, and direct international wire transfers. You do not need an Indian bank account or Indian mobile number.",
  },
  {
    q: "Can you buy from multiple different Indian websites?",
    a: "Yes! That is one of our biggest advantages. You can order clothes from Myntra, sweets from a Chennai shop, and books from Amazon India. We hold them free in your locker for 30 days, discard heavy outer boxes, combine them into one package, and save you up to 80% on international shipping.",
  },
  {
    q: "How long does shipping take once purchased?",
    a: "Once all your items arrive at our Chennai consolidation hub and you approve the packing photos, express international transit takes just 3 to 5 business days to USA, UK, Canada, Australia, UAE, Europe, and 200+ countries worldwide.",
  },
  {
    q: "What if an item is out of stock or requires sizing exchange?",
    a: "Our personal shoppers verify availability before charging you. If an item arrives with defects or in the wrong size, we handle the return and replacement directly with the seller in India before sending it abroad.",
  },
];

export default function BuyAndShipPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [sourceStore, setSourceStore] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [itemNotes, setItemNotes] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("United States");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#assisted-buy-form") {
      window.setTimeout(
        () =>
          document
            .getElementById("assisted-buy-form")
            ?.scrollIntoView(),
        80,
      );
    }
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setProductUrl(text);
        toast.success("Pasted URL from clipboard!");
      }
    } catch {
      toast.info("Please paste the link manually into the field.");
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl.trim()) {
      toast.error("Please enter a product URL or describe the item.");
      return;
    }
    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !customerEmail.trim() ||
      !sourceStore.trim() ||
      !destinationLocation.trim()
    ) {
      toast.error(
        "Please complete your name, phone, email, store, and delivery location.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitServiceRequest("buy_and_ship", {
        customerName,
        phone: customerPhone,
        email: customerEmail,
        location: destinationLocation,
        productUrl,
        sourceStore,
        itemNotes,
        destinationCountry,
      });
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      toast.success(
        result.emailSent
          ? "Request submitted to WhatsApp and email confirmation sent!"
          : "Request submitted! Opening WhatsApp to connect with your Personal Shopper.",
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
      {/* Hero Section: Consistent with NRI Hero & About Us right panel */}
      <section
        className="relative overflow-hidden border-b border-blue-100 bg-[#0B56D9] bg-cover bg-bottom pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 text-white"
        style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.webp')" }}
      >
        {/* Clean solid overlay matching AboutUs & HeroSection pattern */}
        <div className="absolute inset-0 bg-[#0B56D9]/85 backdrop-blur-[0.5px] z-0" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-8 text-center">
          {/* Header pill badge */}
          <span className="inline-block text-[11px] font-black uppercase tracking-widest text-white px-3 py-1 rounded-full bg-white/15 border border-white/25">
            Buy &amp; Ship • Personal Shopper in India
          </span>

          <h1 className="mt-4 text-[clamp(1.75rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight">
            Shop Any Store in India. We Buy &amp; Deliver Worldwide.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-white/85">
            Can’t buy online in India because of domestic OTPs or local cards?
            Pick O Pick purchases on your behalf in INR, inspects every item,
            repacks, and delivers directly to your foreign doorstep.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="#assisted-buy-form"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-extrabold tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50 cursor-pointer"
            >
              <span>SUBMIT PRODUCT LINK</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="https://wa.me/919790361222?text=Hello%20PickoPick%20Personal%20Shopper%2C%20I%20want%20to%20buy%20items%20from%20an%20Indian%20store."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-xs font-extrabold tracking-wider text-white transition-colors hover:bg-white/20 cursor-pointer"
            >
              <FaWhatsapp className="h-4 w-4" />
              <span>SPEAK WITH A SHOPPER</span>
            </a>
          </div>

          {/* Trust strip matching NRI HeroSection */}
          <div className="mx-auto mt-9 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/25 pt-5 text-xs text-white/80">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-white" /> 500+ Indian Stores
            </span>
            <span className="inline-flex items-center gap-2">
              <Package className="h-4 w-4 text-white" /> 30-Day Free Storage
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-white" /> Up to 80%
              Consolidation Savings
            </span>
            <span className="inline-flex items-center gap-2">
              <Plane className="h-4 w-4 text-white" /> 3–5 Days Global Delivery
            </span>
          </div>
        </div>
      </section>

      {/* Quick Store Pill Ribbon */}
      <section className="py-4 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#0B56D9] mr-1">
            Supported Stores:
          </span>
          {QUICK_STORES.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setSourceStore(st);
                document
                  .getElementById("assisted-buy-form")
                  ?.scrollIntoView();
              }}
              className="px-3 py-1 rounded-full bg-white border border-slate-200/80 text-slate-700 hover:border-[#0B56D9]/40 hover:text-[#0B56D9] transition-colors cursor-pointer text-xs font-medium"
            >
              {st}
            </button>
          ))}
        </div>
      </section>

      {/* How Buy & Ship Works (4-Step Section) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
              <Sparkles size={12} className="text-[#FF6321]" />
              How It Works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
              How Buy &amp; Ship <span className="text-[#0B56D9]">Works</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Four simple steps from finding an item in India to unboxing it at
              your doorstep abroad.
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

      {/* Assisted Buy Form Section */}
      <section
        id="assisted-buy-form"
        className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Form Card (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 hover:border-[#0B56D9]/40 transition-colors duration-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0B56D9] flex items-center justify-center shrink-0">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#0A1931] tracking-tight">
                      Submit Assisted Buy Request
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tell us what you want to buy and our personal shoppers
                      will handle the rest.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Your Full Name"
                    value={customerName}
                    onChange={setCustomerName}
                    placeholder="e.g. Rahul Sharma"
                  />
                  <FormInput
                    label="WhatsApp / Phone Number"
                    value={customerPhone}
                    onChange={setCustomerPhone}
                    placeholder="+1 555 000 0000"
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
                    label="Delivery Location"
                    value={destinationLocation}
                    onChange={setDestinationLocation}
                    placeholder="City, State / Postal Code"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    Product URL or Item Description{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      placeholder="Paste link from Amazon.in, Myntra, Ajio, Nykaa or describe item..."
                      className="w-full h-11 pl-3.5 pr-20 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-[#0A1931] outline-none transition-colors focus:border-[#0B56D9] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-700 hover:text-[#0B56D9] transition-colors cursor-pointer"
                    >
                      <Clipboard size={12} /> Paste
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Store Name / Source"
                    value={sourceStore}
                    onChange={setSourceStore}
                    placeholder="e.g. Myntra, Amazon.in, Boutique..."
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

                <FormInput
                  label="Size / Variant / Quantity / Notes"
                  value={itemNotes}
                  onChange={setItemNotes}
                  placeholder="e.g. Size 38, Maroon color, Quantity: 2 pieces"
                  required={false}
                />

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
                  Connects directly to your dedicated India personal shopper
                  with an official tracking reference.
                </p>
              </form>
            </div>

            {/* Right Checklist & Capabilities (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-9 hover:border-[#0B56D9]/40 transition-colors duration-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#0B56D9] px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                    Checklist
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Required Details
                  </span>
                </div>

                <h4 className="text-lg font-extrabold text-[#0A1931] tracking-tight mb-4">
                  What You Need to Provide
                </h4>

                <div className="space-y-3.5">
                  {CHECKLIST_ITEMS.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs sm:text-sm text-slate-700"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-[#0B56D9] shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="font-extrabold text-[#0A1931] text-xs">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Link Card for Order & Send */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#0B56D9] px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                  Already Have Items?
                </span>
                <h4 className="mt-3 text-base font-extrabold text-[#0A1931]">
                  Items already at home in India?
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  If packages are already at your family’s residence or
                  parents&apos; house in India, use our{" "}
                  <strong>Order &amp; Send</strong> doorstep pickup service
                  instead.
                </p>
                <Link
                  to="/order-and-send"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0B56D9] hover:underline"
                >
                  <span>Go to Order &amp; Send Doorstep Pickup</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory of Supported Stores */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
              <Store size={12} className="text-[#FF6321]" />
              Store Directory
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
              Popular Indian Stores{" "}
              <span className="text-[#0B56D9]">We Buy From</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Browse products on these sites, copy the link, and paste it into
              Pick O Pick.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {POPULAR_STORES.map((cat, cIdx) => (
              <div
                key={cIdx}
                className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-6 sm:p-7"
              >
                <div className="flex items-center gap-2 mb-4 border-b border-slate-200/80 pb-3">
                  <Store size={18} className="text-[#0B56D9]" />
                  <h3 className="text-base font-extrabold text-[#0A1931]">
                    {cat.category}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {cat.stores.map((s, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-[#0B56D9]/40 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#0A1931]">
                          {s.name}
                        </p>
                        <p className="text-[11px] text-slate-500">{s.desc}</p>
                      </div>
                      {s.external ? (
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B56D9] hover:underline shrink-0 ml-3"
                        >
                          <span>Visit Store</span>
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <Link
                          to={s.link}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B56D9] hover:underline shrink-0 ml-3"
                        >
                          <span>View in Shop</span>
                          <ArrowRight size={11} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
              Everything you need to know about assisted purchasing and shipping
              from India.
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
