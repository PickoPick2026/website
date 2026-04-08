import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const brands = [
  { name: 'ZARA', style: 'font-serif tracking-widest uppercase text-3xl md:text-4xl' },
  { name: 'amazon', style: 'font-sans font-bold lowercase text-4xl md:text-5xl tracking-tight' },
  { name: 'AliExpress', style: 'font-sans font-semibold text-3xl md:text-4xl tracking-tight' },
  { name: 'adidas', style: 'font-sans font-black lowercase text-3xl md:text-4xl tracking-tighter' },
  { name: 'NIKE', style: 'font-sans font-black italic uppercase text-3xl md:text-4xl tracking-tighter' },
  { name: 'H&M', style: 'font-serif font-bold text-3xl md:text-4xl' },
  { name: 'SEPHORA', style: 'font-sans tracking-[0.2em] uppercase text-2xl md:text-3xl' },
  { name: 'ASOS', style: 'font-sans font-black tracking-tighter text-4xl md:text-5xl' },
];

// Duplicate for seamless marquee
const marqueeBrands = [...brands, ...brands];

export function ShopBanner() {
  return (
    <section className="py-20 bg-white overflow-hidden flex flex-col items-center">
      <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          Shop it like it's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">hot</span>
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
          Access millions of products from your favorite global brands and have them shipped directly to your doorstep with PickoPick.
        </p>
        <a 
          href="#shop-directory"
          className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white px-8 py-4 rounded-full font-medium hover:from-blue-700 hover:to-indigo-900 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5"
        >
          Explore Directory
          <ArrowRight size={18} />
        </a>
      </div>

      {/* Dynamic Marquee */}
      <div className="relative w-full flex overflow-hidden py-12 bg-white border-y border-slate-100">
        {/* Gradient Masks for smooth fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <motion.div 
          className="flex w-max items-center gap-16 md:gap-24 px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 40 
          }}
        >
          {marqueeBrands.map((brand, i) => (
            <div 
              key={i} 
              className={`text-slate-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-800 transition-colors duration-300 cursor-pointer flex items-center gap-1 ${brand.style}`}
            >
              {brand.name}
              {(brand.name === 'amazon' || brand.name === 'AliExpress' || brand.name === 'ZARA') && (
                <span className="text-sm font-sans font-normal tracking-normal self-start mt-1 opacity-50">TM</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
