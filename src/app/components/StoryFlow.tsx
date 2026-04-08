import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, Link as LinkIcon, ShoppingBag, Warehouse, PlaneTakeoff, Globe2, PackageCheck } from 'lucide-react';

const steps = [
  { icon: Search, title: "Product discovered in India", desc: "Find what you love on any Indian e-commerce store." },
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
    <section id="how-it-works" ref={containerRef} className="py-32 bg-white relative overflow-hidden scroll-mt-24">
      {/* Blueprint Background */}
      <div 
        className="absolute inset-0 opacity-[0.2] pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: 'url("/blueprint-bg.png")',
          backgroundSize: '80% auto',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          filter: 'hue-rotate(180deg) brightness(1.1) contrast(0.9)', // Give it a subtle blue/blueprint tint
        }}
      />
      {/* Subtle Gradient Overlay to enhance depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            The Journey of Your Package
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From an Indian storefront to your global doorstep, experience a seamless logistics process.
          </p>
        </div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2 hidden md:block" />
          
          <motion.div 
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-indigo-800 -translate-x-1/2 hidden md:block origin-top"
            style={{ scaleY: scrollYProgress }}
          />

          {/* Moving Package Icon */}
          <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex w-12 h-12 bg-white border-4 border-blue-600 rounded-full items-center justify-center text-blue-600 shadow-xl shadow-blue-600/20"
            style={{ top: packageY }}
          >
            <PackageCheck size={20} />
          </motion.div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 w-full ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-3xl shadow-xl shadow-blue-900/20 border border-blue-500 hover:border-blue-400 transition-colors group">
                      <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors">{step.title}</h3>
                      <p className="text-white/90 text-xl">{step.desc}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-blue-50 shadow-lg text-blue-600">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3, 
                        ease: "easeInOut", 
                        delay: index * 0.2 
                      }}
                    >
                      <step.icon size={24} />
                    </motion.div>
                  </div>
                  
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
