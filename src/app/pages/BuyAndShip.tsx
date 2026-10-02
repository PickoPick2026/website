import { useEffect, useState, type FormEvent } from "react";
import {
  ShoppingBag,
  Link2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Plane,
  ExternalLink,
  Package,
  Store,
  Clipboard,
  Search,
  Percent,
  Shirt,
  ShoppingCart,
  Candy,
  Flame,
} from "lucide-react";
import { Link } from "react-router-dom";
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

const WHATSAPP_SHOPPER_URL =
  "https://wa.me/919790361222?text=Hello%20PickoPick%20Personal%20Shopper%2C%20I%20want%20to%20buy%20items%20from%20an%20Indian%20store.";

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
    icon: Search,
    title: "Discover Any Product in India",
    desc: "Browse Indian e-commerce sites (Amazon.in, Myntra, Ajio, Nykaa) or local specialty shops in Chennai, Mumbai, or Delhi.",
  },
  {
    num: "02",
    icon: Link2,
    title: "Share Link or Photo",
    desc: "Paste the product link or send item screenshots with size and color. No Indian card or local phone OTP is needed.",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "We Purchase & Verify",
    desc: "Our India team purchases the items in INR, inspects them at our Chennai center, and provides free 30-day locker storage.",
  },
  {
    num: "04",
    icon: Plane,
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
    icon: Shirt,
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
    icon: ShoppingCart,
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
    icon: Candy,
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
    icon: Flame,
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
  const [activeCategory, setActiveCategory] = useState(0);

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

  const handleSubmitRequest = async (e: FormEvent) => {
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

    // Open WhatsApp immediately inside the click gesture so the request
    // always reaches WhatsApp (popup blockers kill async window.open).
    const waMessage = [
      "Hello Pick O Pick, new *Buy & Ship* request:",
      `Name: ${customerName}`,
      `Phone: ${customerPhone}`,
      `Email: ${customerEmail}`,
      `Delivery Location: ${destinationLocation}, ${destinationCountry}`,
      `Store: ${sourceStore}`,
      `Product URL / Item: ${productUrl}`,
      itemNotes.trim() ? `Size / Variant / Notes: ${itemNotes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(
      `https://wa.me/919790361222?text=${encodeURIComponent(waMessage)}`,
      "_blank",
      "noopener,noreferrer",
    );

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
      toast.success(
        result.emailSent
          ? "Buy & Ship request sent to WhatsApp — confirmation email dispatched too!"
          : "Buy & Ship request sent to WhatsApp! Your personal shopper will connect shortly.",
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

  const category = POPULAR_STORES[activeCategory];

  return (
    <main className="min-h-screen bg-white text-[#0A1931]">
      {/* ───────── Hero ───────── */}
      <PageHero
        eyebrow="Buy & Ship • Personal Shopper in India"
        title="Shop Any Store in India."
        highlight="We Buy & Deliver Worldwide."
        description="Can’t buy online in India because of domestic OTPs or local cards? Pick O Pick purchases on your behalf in INR, inspects every item, repacks, and delivers directly to your foreign doorstep."
        image="/images/nri-trust/shop-from-india.webp"
        imageAlt="Parcels from Indian stores combined into one Pick O Pick box"
        floatingChips={[
          { icon: ShieldCheck, label: "Inspected in Chennai" },
          { icon: Package, label: "One box, many stores" },
          { icon: Plane, label: "3–5 day delivery" },
        ]}
        actions={
          <>
            <HeroPrimaryButton href="#assisted-buy-form">
              Submit Product Link
            </HeroPrimaryButton>
            <HeroSecondaryButton href={WHATSAPP_SHOPPER_URL}>
              <FaWhatsapp size={16} />
              Speak With a Shopper
            </HeroSecondaryButton>
          </>
        }
      />

      <StatsBar
        stats={[
          { icon: Store, value: "500+", label: "Indian stores" },
          { icon: Package, value: "30 days", label: "Free locker storage" },
          { icon: Percent, value: "Up to 80%", label: "Consolidation savings" },
          { icon: Plane, value: "3–5 days", label: "Global delivery" },
        ]}
      />

      {/* ───────── Supported stores ribbon ───────── */}
      <section className="pt-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 sm:px-8">
          <span className="mr-1 text-[11px] font-black uppercase tracking-widest text-slate-400">
            Shop from
          </span>
          {QUICK_STORES.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setSourceStore(st);
                document.getElementById("assisted-buy-form")?.scrollIntoView();
              }}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0B56D9] hover:bg-blue-50 hover:text-[#0B56D9]"
            >
              {st}
            </button>
          ))}
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <SectionHeader
            eyebrow="How it works"
            title="How Buy & Ship"
            highlight="Works"
            description="Four simple steps from finding an item in India to unboxing it at your doorstep abroad."
          />
          <StepsTimeline steps={STEPS} />
        </div>
      </section>

      {/* ───────── Request form ───────── */}
      <section
        id="assisted-buy-form"
        className="scroll-mt-24 border-y border-slate-200/80 bg-[#F7F9FF] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <SectionHeader
            eyebrow="Start your order"
            title="Tell us what to"
            highlight="buy for you"
            description="Share the product and where it’s going — your personal shopper takes it from there."
          />

          <div className="grid items-start gap-8 lg:grid-cols-12">
            <form
              onSubmit={handleSubmitRequest}
              className="space-y-8 rounded-[28px] border border-slate-200 bg-white p-6 sm:p-9 lg:col-span-7"
            >
              <FormGroup step="1" title="The product">
                <FieldLabel label="Product URL or Item Description" required>
                  <div className="relative">
                    <Link2
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#0B56D9]"
                    />
                    <input
                      type="text"
                      required
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      placeholder="Paste link from Amazon.in, Myntra, Ajio, Nykaa or describe item..."
                      className={`${fieldClass} pl-11 pr-24`}
                    />
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition-colors hover:border-[#0B56D9] hover:text-[#0B56D9]"
                    >
                      <Clipboard size={12} /> Paste
                    </button>
                  </div>
                </FieldLabel>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Store Name / Source"
                    value={sourceStore}
                    onChange={setSourceStore}
                    placeholder="e.g. Myntra, Amazon.in, Boutique..."
                  />
                  <FormInput
                    label="Size / Variant / Quantity / Notes"
                    value={itemNotes}
                    onChange={setItemNotes}
                    placeholder="e.g. Size 38, Maroon, Qty 2"
                    required={false}
                  />
                </div>
              </FormGroup>

              <div className="border-t border-dashed border-slate-200" />

              <FormGroup step="2" title="Your details">
                <div className="grid gap-4 sm:grid-cols-2">
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
                <FormInput
                  label="Email Address"
                  value={customerEmail}
                  onChange={setCustomerEmail}
                  placeholder="you@example.com"
                  type="email"
                />
              </FormGroup>

              <div className="border-t border-dashed border-slate-200" />

              <FormGroup step="3" title="Delivery">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Delivery Location"
                    value={destinationLocation}
                    onChange={setDestinationLocation}
                    placeholder="City, State / Postal Code"
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
                  className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0B56D9] text-sm font-extrabold text-white transition-colors hover:bg-[#0849B7] disabled:opacity-60"
                >
                  <FaWhatsapp size={18} />
                  <span>
                    {isSubmitting
                      ? "Submitting..."
                      : "Send Buy & Ship Request to WhatsApp & Email"}
                  </span>
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
                <p className="pt-3 text-center text-[11px] text-slate-500">
                  Connects directly to your dedicated India personal shopper
                  with an official tracking reference.
                </p>
              </div>
            </form>

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-28 lg:col-span-5">
              <BluePanel className="rounded-[28px]">
                <div className="p-7 sm:p-8">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-100">
                    Checklist
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold tracking-tight">
                    What You Need to Provide
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {CHECKLIST_ITEMS.map((item) => (
                      <li key={item.title} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#0B56D9]">
                          <CheckCircle2 size={14} />
                        </span>
                        <span>
                          <span className="block text-sm font-extrabold">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-blue-100">
                            {item.detail}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </BluePanel>

              <a
                href={WHATSAPP_SHOPPER_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-5 transition-colors hover:border-[#0B56D9]/40"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <FaWhatsapp size={22} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-extrabold text-[#0A1931]">
                    Prefer to chat?
                  </span>
                  <span className="block text-xs text-slate-500">
                    Send screenshots straight to a personal shopper.
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

      {/* ───────── Store directory ───────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <SectionHeader
            eyebrow="Store directory"
            title="Popular Indian Stores"
            highlight="We Buy From"
            description="Browse products on these sites, copy the link, and paste it into Pick O Pick."
          />

          <div
            className="mb-8 flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:justify-center"
            role="tablist"
          >
            {POPULAR_STORES.map((cat, index) => {
              const Icon = cat.icon;
              const isActive = index === activeCategory;
              return (
                <button
                  key={cat.category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(index)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition-colors ${
                    isActive
                      ? "border-[#0B56D9] bg-[#0B56D9] text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-[#0B56D9]/40"
                  }`}
                >
                  <Icon size={14} />
                  {cat.category}
                </button>
              );
            })}
          </div>

          <div
            key={category.category}
            className="animate-fade-in grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            role="tabpanel"
          >
            {category.stores.map((s) => {
              const content = (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-base font-black text-[#0B56D9] transition-colors group-hover:bg-[#0B56D9] group-hover:text-white">
                    {s.name.charAt(0)}
                  </span>
                  <span className="mt-4 block text-sm font-extrabold text-[#0A1931]">
                    {s.name}
                  </span>
                  <span className="mt-1 block flex-1 text-xs leading-relaxed text-slate-500">
                    {s.desc}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0B56D9]">
                    {s.external ? "Visit Store" : "View in Shop"}
                    {s.external ? (
                      <ExternalLink size={12} />
                    ) : (
                      <ArrowRight size={12} />
                    )}
                  </span>
                </>
              );
              const cardClass =
                "group flex flex-col rounded-[24px] border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-[#0B56D9]/40";
              return s.external ? (
                <a
                  key={s.name}
                  href={s.link}
                  target="_blank"
                  rel="noreferrer"
                  className={cardClass}
                >
                  {content}
                </a>
              ) : (
                <Link key={s.name} to={s.link} className={cardClass}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── FAQs ───────── */}
      <section className="border-t border-slate-200/80 bg-[#F7F9FF] py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Got questions?"
              title="Frequently Asked"
              highlight="Questions"
              description="Everything you need to know about assisted purchasing and shipping from India."
            />
            <a
              href={WHATSAPP_SHOPPER_URL}
              target="_blank"
              rel="noreferrer"
              className="-mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#0B56D9] hover:underline"
            >
              <ShoppingBag size={16} />
              Still unsure? Ask a personal shopper
              <ArrowRight size={14} />
            </a>
          </div>
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>

      <CrossLinkBanner
        eyebrow="Already have items?"
        title="Items already at home in India?"
        description={
          <>
            If packages are already at your family’s residence or parents&apos;
            house in India, use our <strong>Order &amp; Send</strong> doorstep
            pickup service instead.
          </>
        }
        to="/order-and-send"
        cta="Go to Order & Send"
        image="/images/nri-trust/international-shipping.webp"
      />
    </main>
  );
}
