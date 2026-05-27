import { useRef, useState } from "react";

export function HeroMobile() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
    } else {
      await v.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="relative h-screen bg-black overflow-hidden">

      {/* Blurred bg to fill empty sides — no black bars */}
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-50 pointer-events-none"
        src="/videos/PICK.mp4"
      />

      {/* Main video — natural size, no crop */}
      <video
        ref={videoRef}
        playsInline
        loop
        preload="auto"
        className="absolute inset-0 w-full h-full object-contain"
      >
        <source src="/videos/PICK.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur border-2 border-white flex items-center justify-center active:scale-95 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p className="text-white text-xs tracking-widest uppercase opacity-80">
              Tap to watch
            </p>
          </div>
        )}
      </div>

    </section>
  );
}