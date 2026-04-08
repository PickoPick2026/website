import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Jenkins",
    country: "USA",
    flag: "🇺🇸",
    text: "PickoPick made it incredibly easy to buy traditional Indian wear for my wedding. The consolidation saved me a fortune on shipping!",
    avatar: "https://i.pravatar.cc/150?u=1"
  },
  {
    name: "David Chen",
    country: "Australia",
    flag: "🇦🇺",
    text: "Fast, reliable, and transparent. The photos they send when items arrive at their warehouse give me total peace of mind.",
    avatar: "https://i.pravatar.cc/150?u=2"
  },
  {
    name: "Priya Patel",
    country: "UK",
    flag: "🇬🇧",
    text: "I missed my favorite Indian snacks and brands. Now I just order them online and PickoPick delivers them to London in days.",
    avatar: "https://i.pravatar.cc/150?u=3"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="about" className="py-32 bg-white text-slate-900 overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Loved Globally
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join thousands of happy customers shipping from India to the world.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 p-8 md:p-12 rounded-3xl shadow-xl flex flex-col justify-center text-white"
              >
                <div className="flex items-center gap-4 mb-8">
                  <img src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].name} className="w-16 h-16 rounded-full border-2 border-white/20" />
                  <div>
                    <h4 className="font-bold text-xl text-white">{testimonials[currentIndex].name}</h4>
                    <div className="flex items-center gap-2 text-blue-100 mt-1">
                      <span className="text-xl">{testimonials[currentIndex].flag}</span>
                      <span>{testimonials[currentIndex].country}</span>
                    </div>
                  </div>
                </div>
                <p className="text-white leading-relaxed text-xl md:text-2xl italic">
                  "{testimonials[currentIndex].text}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
