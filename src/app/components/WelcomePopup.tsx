import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Pause, Play, X } from "lucide-react";
import { Link } from "react-router-dom";

const openRegister = () =>
  window.dispatchEvent(new Event("pickopick:open-register"));
const openConsultation = () =>
  window.dispatchEvent(new Event("pickopick:open-consultation"));

export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("pickopick-welcome-popup-seen")) return;
    const timer = window.setTimeout(() => setOpen(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("pickopick-welcome-popup-seen", "true");
    setOpen(false);
  };

  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close welcome offer"
            onClick={dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[105] cursor-default bg-slate-950/65 backdrop-blur-sm"
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-popup-title"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.22 }}
            className="fixed left-1/2 top-1/2 z-[106] max-h-[92dvh] w-[min(94vw,1040px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-blue-100 bg-white md:overflow-hidden"
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 z-20 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid md:grid-cols-[1.08fr_.92fr]">
              <div className="flex min-h-[500px] flex-col justify-center p-7 sm:p-10">
                <img
                  src="/PICKLogo.png"
                  alt="Pick O Pick"
                  className="h-11 w-fit object-contain"
                />
                <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF6321]">
                  India to the world
                </p>
                <h2
                  id="welcome-popup-title"
                  className="mt-3 max-w-lg text-3xl font-extrabold leading-tight tracking-tight text-[#0A1931] sm:text-4xl"
                >
                  Everything from India, delivered your way.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
                  Choose Buy &amp; Ship when you want us to shop in India, or
                  Order &amp; Send when your purchases are ready. Our team
                  handles pickup, consolidation and global delivery.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      dismiss();
                      openRegister();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B56D9] px-5 py-3.5 text-xs font-extrabold text-white transition-colors hover:bg-[#0849B7]"
                  >
                    BUY &amp; SHIP <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dismiss();
                      openConsultation();
                    }}
                    className="rounded-full border border-[#0B56D9] px-5 py-3.5 text-xs font-extrabold text-[#0B56D9] transition-colors hover:bg-blue-50"
                  >
                    ORDER &amp; SEND
                  </button>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold">
                  <Link
                    to="/contact"
                    onClick={dismiss}
                    className="text-slate-600 hover:text-[#0B56D9]"
                  >
                    For more details, Contact Us
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      dismiss();
                      openConsultation();
                    }}
                    className="text-[#0B56D9] hover:underline"
                  >
                    Book your free consultation
                  </button>
                </div>
              </div>
              <div className="relative flex min-h-[500px] items-center bg-[#F4F8FF] p-5 pt-10 sm:p-7 sm:pt-10">
                <div className="group relative h-[58dvh] min-h-[420px] w-full overflow-hidden rounded-2xl border border-blue-100 bg-white md:h-[560px] md:max-h-[72dvh]">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    playsInline
                    preload="metadata"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onClick={toggleVideo}
                  >
                    <source src="/videos/video.mp4" type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                  <button
                    type="button"
                    onClick={toggleVideo}
                    className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0B56D9] transition-all hover:scale-105 ${isPlaying ? "opacity-0 group-hover:opacity-100 focus:opacity-100" : "opacity-100"}`}
                    aria-label={
                      isPlaying ? "Pause welcome video" : "Play welcome video"
                    }
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 fill-current" />
                    ) : (
                      <Play className="ml-0.5 h-6 w-6 fill-current" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
