import { useState, useRef } from "react";

export function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      await video.play();
      setIsPlaying(true);
    } catch (error) {
      console.log("Video play failed:", error);
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden scroll-mt-24"
    >
      

      {/* ───────────────── DESKTOP ───────────────── */}
      <div className="hidden sm:block absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/PICK.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Optional Content Layer */}
      <div className="relative z-20 flex items-center justify-center h-full">
        {/* Add Hero Text Here */}
      </div>
    </section>
  );
}