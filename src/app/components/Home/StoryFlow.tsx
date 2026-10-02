import { useRef, useState } from "react";
import {
  Search,
  Link as LinkIcon,
  ShoppingBag,
  Warehouse,
  PlaneTakeoff,
  Globe2,
  PackageCheck,
  Play,
  PlayCircle,
} from "lucide-react";

const steps = [
  {
    num: "1",
    icon: Search,
    title: "Discover Product",
    desc: "Find what you love on any Indian store.",
  },
  {
    num: "2",
    icon: LinkIcon,
    title: "Submit Link",
    desc: "Share the product URL with Pick O Pick.",
  },
  {
    num: "3",
    icon: ShoppingBag,
    title: "We Purchase",
    desc: "Our team buys it locally for you.",
  },
  {
    num: "4",
    icon: Warehouse,
    title: "Warehouse Hub",
    desc: "Received, inspected & consolidated.",
  },
  {
    num: "5",
    icon: PlaneTakeoff,
    title: "Global Dispatch",
    desc: "Packed for international air transit.",
  },
  {
    num: "6",
    icon: Globe2,
    title: "Live Tracking",
    desc: "Follow updates across borders.",
  },
  {
    num: "7",
    icon: PackageCheck,
    title: "Doorstep Arrival",
    desc: "Safely delivered to your home.",
  },
];

export function StoryFlow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      id="how-it-works"
      className="py-14 sm:py-20 bg-white border-y border-slate-100 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#0B56D9]">
            How it works
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
            Your Package Journey
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            From the streets of India to your doorstep, follow the seamless path
            of your order.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
          {/* ───────── Zigzag journey ───────── */}
          <ol className="relative">
            {/* Spine: left edge on mobile, centre on desktop */}
            <div
              aria-hidden="true"
              className="absolute bottom-6 top-6 left-6 w-0.5 border-l-2 border-dashed border-[#0B56D9]/30 md:left-1/2 md:-translate-x-1/2"
            />

            {steps.map((item, index) => {
              const Icon = item.icon;
              const isRight = index % 2 === 1;
              const isLast = index === steps.length - 1;
              return (
                <li
                  key={item.num}
                  className="group relative grid grid-cols-[3rem_1fr] items-center gap-4 py-2.5 md:grid-cols-[1fr_3rem_1fr]"
                >
                  {/* Card — alternates sides on desktop */}
                  <div
                    className={`col-start-2 row-start-1 ${
                      isRight ? "md:col-start-3" : "md:col-start-1 md:text-right"
                    }`}
                  >
                    <div
                      className={`relative rounded-2xl border bg-white p-4 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[#0B56D9]/50 group-hover:shadow-[0_12px_30px_-18px_rgba(11,86,217,0.6)] ${
                        isLast ? "border-[#0B56D9] bg-blue-50/60" : "border-slate-200"
                      }`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#0B56D9]">
                        Step {item.num.padStart(2, "0")}
                      </p>
                      <h4 className="mt-1 text-sm font-extrabold leading-tight text-[#0A1931]">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs leading-snug text-slate-500">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Node on the spine */}
                  <div className="col-start-1 row-start-1 flex justify-center md:col-start-2">
                    <span
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                        isLast
                          ? "border-[#0B56D9] bg-[#0B56D9] text-white"
                          : "border-[#0B56D9] bg-white text-[#0B56D9] group-hover:bg-[#0B56D9] group-hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0B56D9] text-[11px] font-black text-white ring-2 ring-white">
                        {item.num}
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* ───────── Real journey video ───────── */}
          <div className="lg:sticky lg:top-28">
            <div className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-3xl border border-blue-100 bg-[#F4F8FF] p-2">
              <div className="group relative overflow-hidden rounded-2xl bg-black">
                <video
                  ref={videoRef}
                  src="/videos/video.mp4"
                  controls={isPlaying}
                  preload="metadata"
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onEnded={() => setIsPlaying(false)}
                  className="aspect-[9/16] w-full object-cover"
                  aria-label="Pick O Pick package journey video"
                >
                  Your browser does not support video playback.
                </video>

                {!isPlaying && (
                  <button
                    type="button"
                    onClick={() => videoRef.current?.play()}
                    className="absolute inset-0 flex items-center justify-center bg-[#0B56D9]/20 transition-colors hover:bg-[#0B56D9]/10"
                    aria-label="Play package journey video"
                  >
                    <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0B56D9] shadow-lg transition-transform group-hover:scale-105">
                      <span className="absolute inset-0 animate-ping rounded-full bg-white/60" />
                      <Play className="relative ml-1 h-7 w-7 fill-current" />
                    </span>
                  </button>
                )}
              </div>

              <p className="flex items-center justify-center gap-2 px-3 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <PlayCircle className="h-4 w-4 text-[#0B56D9]" />
                Watch your parcel's real journey
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
