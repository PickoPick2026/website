import { useEffect, useId, useRef, useState } from "react";
import { Share2, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const socials = [
  { name: "X (Twitter)", href: "https://x.com/Pickopicko61028", icon: FaXTwitter, color: "bg-slate-900" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/pick-o-pick", icon: FaLinkedinIn, color: "bg-[#0A66C2]" },
  { name: "Instagram", href: "https://www.instagram.com/pickopickofficial/", icon: FaInstagram, color: "bg-[#C13584]" },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61578667226102", icon: FaFacebookF, color: "bg-[#1877F2]" },
];

export default function FloatingSocialMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const closeOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed right-3 top-1/2 z-40 -translate-y-1/2 sm:right-5"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={isOpen ? "Close social links" : "Follow Pick O Pick"}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#0B56D9] text-white shadow-lg transition-colors hover:bg-[#0849B7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B56D9]"
      >
        {isOpen ? <X size={21} aria-hidden="true" /> : <Share2 size={21} aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id={panelId}
            aria-label="Follow Pick O Pick on social media"
            initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="absolute right-14 top-1/2 w-48 -translate-y-1/2 rounded-2xl border border-blue-100 bg-white p-2 shadow-xl sm:right-16"
          >
            <p className="px-3 pb-2 pt-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Follow us</p>
            {socials.map(({ name, href, icon: Icon, color }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} (opens in a new tab)`}
                onClick={() => setIsOpen(false)}
                className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-[#0A1931] transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-[#0B56D9]"
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${color}`}>
                  <Icon size={16} aria-hidden="true" />
                </span>
                {name}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
