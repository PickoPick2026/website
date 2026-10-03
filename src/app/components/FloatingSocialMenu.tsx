import { useEffect, useId, useRef, useState } from "react";
import { Globe, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

const socials = [
  { name: "X (Twitter)", href: "https://x.com/Pickopicko61028", icon: FaXTwitter, color: "bg-black" },
  { name: "Instagram", href: "https://www.instagram.com/pickopickofficial/", icon: FaInstagram, color: "bg-linear-to-tr from-[#FCAF45] via-[#DD2A7B] to-[#8134AF]" },
  { name: "Facebook", href: "https://www.facebook.com/people/Pick-O-Pick/pfbid0F6C9GymAgZ2KsvWHpnPPfFQaaV64H2K8m7XP2DStMuGJdaF1qbKBr1MJpeERa1ppl/", icon: FaFacebookF, color: "bg-[#1877F2]" },
  { name: "YouTube", href: "https://www.youtube.com/@pickopick.official", icon: FaYoutube, color: "bg-[#FF0000]" },
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
      className="fixed bottom-[45%] right-0 z-40 flex w-[52px] flex-col-reverse overflow-hidden rounded-l-[26px] border border-r-0 border-blue-100 bg-white shadow-lg"
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
        className="brand-shine-button flex h-12 w-full shrink-0 items-center justify-center bg-[#0B56D9] text-white transition-colors hover:bg-[#0849B7] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
      >
        {isOpen ? <X size={21} aria-hidden="true" /> : <Globe size={21} aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id={panelId}
            aria-label="Follow Pick O Pick on social media"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
            className="w-full overflow-hidden"
          >
            <div className="flex max-h-[calc(55dvh-152px)] flex-col items-center gap-2 overflow-y-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {socials.map(({ name, href, icon: Icon, color }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} (opens in a new tab)`}
                title={name}
                onClick={() => setIsOpen(false)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${color}`}
              >
                <Icon size={19} aria-hidden="true" />
              </a>
            ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
