import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const partners = [
  { src: '/partners/Myntra.png', alt: 'Myntra' },
  { src: '/partners/Flipkart.png', alt: 'Flipkart' },
  { src: '/partners/Amazon_logo.webp', alt: 'Amazon' },
  { src: '/partners/BestTerracotta.jpg', alt: 'BestTerracotta' },
  { src: '/partners/mambalamiyers.png', alt: 'Mambalam Iyers' },
  { src: '/partners/nandrimasala.webp', alt: 'Nandri Masala' },
];

// Duplicate for seamless marquee
const marqueeBrands = [...partners, ...partners];

export function ShopBanner() {
  return (
    <section className="py-20 bg-white overflow-hidden flex flex-col items-center">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          Shop it like it's{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
            hot
          </span>
        </h2>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
          Access millions of products from your favorite global brands and have them shipped directly to your doorstep with PickoPick.
        </p>

        <a
          href="#shop-directory"
          className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white px-8 py-4 rounded-full font-medium hover:from-blue-700 hover:to-indigo-900 transition-all shadow-lg hover:-translate-y-0.5"
        >
          Explore Directory
          <ArrowRight size={18} />
        </a>
      </div>

      {/* Marquee */}
      <div className="relative w-full overflow-hidden py-12 border-y border-slate-100">

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10" />

        <motion.div
          className="flex w-max items-center gap-16 md:gap-24 px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
        >
          {marqueeBrands.map((partner, i) => (
            <div
              key={i}
              className="flex items-center justify-center h-16 md:h-20 w-32"
            >
              <img
                src={partner.src}
                alt={partner.alt}
                className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}