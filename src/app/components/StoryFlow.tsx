import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, Link as LinkIcon, ShoppingBag, Warehouse, PlaneTakeoff, Globe2, PackageCheck } from 'lucide-react';

const steps = [
  { icon: Search, title: "Product discovered in India", desc: "Find what you love on any Indian e-commerce store."},
  { icon: LinkIcon, title: "Product link submitted", desc: "Paste the URL in your PickoPick dashboard." },
  { icon: ShoppingBag, title: "PickoPick purchases", desc: "We buy the item on your behalf locally." },
  { icon: Warehouse, title: "Package arrives at warehouse", desc: "We receive, inspect, and store your items." },
  { icon: PlaneTakeoff, title: "International shipping", desc: "Choose your preferred global courier." },
  { icon: Globe2, title: "Package travels globally", desc: "Real-time tracking across borders." },
  { icon: PackageCheck, title: "Package delivered", desc: "Safe arrival at your doorstep worldwide." },
];

export function StoryFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const packageY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" ref={containerRef} className="py-20 sm:py-24 bg-white relative overflow-hidden scroll-mt-24">
      {/* Blueprint Background */}
      <div 
        className="absolute inset-0 opacity-[0.2] pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: 'url("/blueprint-bg.png")',
          backgroundSize: '80% auto',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          filter: 'hue-rotate(180deg) brightness(1.1) contrast(0.9)',
        }}
      />
      {/* Subtle fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1931]">
            The Journey of Your Package
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            From an Indian storefront to your global doorstep, experience a seamless logistics process.
          </p>
        </div>

        {/* Desktop center timeline */}
        <div className="relative hidden md:block">
          {/* Central muted line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#0B56D9]/15 -translate-x-1/2" />
          {/* Scroll progress line */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#0B56D9] -translate-x-1/2 origin-top"
            style={{ scaleY: scrollYProgress }}
          />
          {/* Moving Package Icon */}
          <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-20 flex w-12 h-12 bg-white border-4 border-[#0B56D9] rounded-full items-center justify-center text-[#0B56D9] shadow-xl shadow-[#0B56D9]/20"
            style={{ top: packageY }}
          >
            <PackageCheck size={20} />
          </motion.div>

          <div className="space-y-16">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-row items-center gap-10 ${isEven ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 ${isEven ? 'text-left' : 'text-right'}`}>
                    <div className="mx-auto max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 text-left hover:border-[#0B56D9]/40 transition-colors group">
                      <h3 className="text-lg font-extrabold tracking-tight text-[#0A1931] transition-colors group-hover:text-[#0B56D9]">{step.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-white border-4 border-[#0B56D9]/20 text-[#0B56D9]">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: index * 0.2 }}
                    >
                      <step.icon size={24} />
                    </motion.div>
                  </div>
                  
                  <div className="flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="relative md:hidden">
          <div className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-[#0B56D9]/15" />
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative flex items-start gap-4"
              >
                <div className="relative z-10 flex shrink-0 items-center justify-center w-11 h-11 rounded-full bg-white border-4 border-[#0B56D9]/25 text-[#0B56D9] mt-1">
                  <step.icon size={20} />
                </div>
                <div className="flex-1 rounded-2xl border border-slate-200/80 bg-white p-4">
                  <h3 className="text-sm font-extrabold tracking-tight text-[#0A1931]">{step.title}</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
