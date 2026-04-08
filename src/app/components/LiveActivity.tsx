import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin } from 'lucide-react';

const activities = [
  { item: "Saree from Myntra", dest: "London, UK", time: "Just now" },
  { item: "Electronics from Flipkart", dest: "Dubai, UAE", time: "2 mins ago" },
  { item: "Spices from Amazon", dest: "Sydney, AU", time: "5 mins ago" },
  { item: "Handicrafts from FabIndia", dest: "New York, USA", time: "12 mins ago" },
];

export function LiveActivity() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none hidden md:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md shadow-xl border border-slate-100 p-4 rounded-2xl flex items-center gap-4 pointer-events-auto"
        >
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              Shipped: {activities[currentIndex].item}
            </p>
            <p className="text-xs text-slate-500">
              To {activities[currentIndex].dest} • {activities[currentIndex].time}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
