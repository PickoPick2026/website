import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import { BluePanel } from "./ServicePage";

// LinkedIn / YouTube handles are placeholders until the client shares the
// official ones.
const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/pickopickofficial/", icon: FaInstagram },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61578667226102", icon: FaFacebookF },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/pick-o-pick", icon: FaLinkedinIn },
  { name: "YouTube", href: "https://www.youtube.com/@pickopick", icon: FaYoutube },
  { name: "X (Twitter)", href: "https://x.com/Pickopicko61028", icon: FaXTwitter },
];

const linkGroups = [
  {
    title: "Services",
    links: [
      { label: "Buy & Ship", to: "/buy-and-ship" },
      { label: "Order & Send", to: "/order-and-send" },
      { label: "Personal Shopper", to: "/nri#booking-portal" },
      { label: "Package Consolidation", to: "/nri#booking-portal" },
      { label: "International Shipping", to: "/shipping-estimate" },
      { label: "B2B Logistics", to: "/nri#booking-portal" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Shop Directory", to: "/shop" },
      { label: "NRI Premium Services", to: "/nri" },
      { label: "Track Shipment", to: "/track-shipment" },
      { label: "About Us", to: "/#about" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Prohibited Items", to: "/prohibited" },
      { label: "Refund Policy", to: "/refund" },
    ],
  },
];

/** Collapsible on mobile, always open from lg up. */
function LinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 lg:border-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-4 text-left lg:pointer-events-none lg:py-0"
      >
        <span className="text-sm font-extrabold text-[#0A1931]">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#0B56D9] transition-transform lg:hidden ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <ul
        className={`${isOpen ? "grid" : "hidden"} grid-cols-2 gap-x-4 gap-y-3 pb-5 lg:mt-5 lg:grid lg:grid-cols-1 lg:pb-0`}
      >
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-sm text-slate-600 transition-colors hover:text-[#0B56D9]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#F7F9FF]">
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        {/* CTA */}
        <BluePanel className="rounded-[28px]">
          <div className="flex flex-col gap-6 p-7 sm:p-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Ready to ship from India?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-blue-50 sm:text-base">
                Buy from any Indian store or send from home — we deliver to
                your doorstep anywhere in the world.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
              <Link
                to="/shipping-estimate"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50"
              >
                Get an Estimate
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://wa.me/919790361222?text=Hello%20Pick%20O%20Pick%2C%20I%20need%20help%20shipping%20from%20India."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-white/20"
              >
                <FaWhatsapp size={16} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </BluePanel>

        {/* Main */}
        <div className="grid gap-10 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block" aria-label="Pick O Pick home">
              <img
                src="/PICKLogo.png"
                alt="PickoPick"
                className="w-[160px] object-contain sm:w-[180px]"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-600">
              Your premium global logistics partner. Buy from any Indian store
              and we'll ship it to your doorstep anywhere in the world.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  title={name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0B56D9] transition-colors hover:border-[#0B56D9] hover:bg-[#0B56D9] hover:text-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups (accordions on mobile) */}
          <div className="border-t border-slate-200 lg:col-span-5 lg:grid lg:grid-cols-3 lg:gap-8 lg:border-0">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <LinkGroup title={group.title} links={group.links} />
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-extrabold text-[#0A1931]">Contact</h3>
            <div className="mt-5 space-y-3">
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0B56D9]" />
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-bold text-[#0A1931]">
                    Pickopick Private Limited
                  </span>
                  <br />
                  No : 49 &amp; 51, 2nd Sector, Thiru Vi Ka Industrial Estate,
                  Guindy, Chennai - 600032
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                {[
                  { href: "tel:+919790361222", label: "+91 97903 61222" },
                  { href: "tel:+919003715617", label: "+91 90037 15617" },
                ].map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-[#0A1931] transition-colors hover:border-[#0B56D9]/40 hover:text-[#0B56D9] sm:text-sm"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-[#0B56D9]" />
                    {phone.label}
                  </a>
                ))}
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-extrabold text-[#0B56D9] hover:underline"
              >
                <Mail className="h-4 w-4" />
                Contact our team
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 py-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>&copy; {new Date().getFullYear()} PickoPick. All rights reserved.</p>
          <span>Made with precision for global commerce.</span>
        </div>
      </div>
    </footer>
  );
}
