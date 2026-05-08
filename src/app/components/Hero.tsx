// import { useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { Globe } from './Globe';
// import { motion } from 'motion/react';
// import { ArrowRight, Globe2, PackageSearch, Plane } from 'lucide-react';
// import { CalculateShippingModal } from './CalculateShippingModal';

// export function Hero() {
//   const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

//   return (
//     <section id="home" className="relative min-h-screen flex items-center pt-32 overflow-hidden bg-gradient-to-b from-slate-50 to-white scroll-mt-24">
//       {/* 3D Background */}
//       <div className="absolute inset-0 z-0 opacity-60">
//         <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
//           <OrbitControls 
//             enableZoom={false} 
//             enablePan={false}
//             autoRotate
//             autoRotateSpeed={0.5}
//           />
//           <Globe />
//         </Canvas>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
//         <div className="max-w-2xl">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//           >
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm mb-8">
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
//               </span>
//               Global Logistics Network Active
//             </div>
//             <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-6">
//               Buy from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">India.</span><br />
//               Ship <span className="text-slate-400">worldwide.</span>
//             </h1>
//             <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
//               Your premium gateway to Indian stores. We purchase, consolidate, and ship your packages globally with unparalleled speed and reliability.
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4">
//               <button className="px-8 py-4 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-indigo-900 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group">
//                 Start Shipping
//                 <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
//               </button>
//               <button 
//                 onClick={() => setIsCalculatorOpen(true)}
//                 className="px-8 py-4 bg-white text-[#0a1128] border border-slate-200 rounded-full font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
//               >
//                 Calculate Shipping
//               </button>
//             </div>

//             <div className="mt-12 flex items-center gap-8 text-slate-500 text-sm font-medium">
//               <div className="flex items-center gap-2">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
//                 >
//                   <Globe2 size={18} className="text-blue-500" />
//                 </motion.div>
//                 200+ Countries
//               </div>
//               <div className="flex items-center gap-2">
//                 <motion.div
//                   animate={{ y: [0, -4, 0] }}
//                   transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
//                 >
//                   <PackageSearch size={18} className="text-blue-500" />
//                 </motion.div>
//                 Free Consolidation
//               </div>
//               <div className="flex items-center gap-2">
//                 <motion.div
//                   animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
//                   transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
//                 >
//                   <Plane size={18} className="text-blue-500" />
//                 </motion.div>
//                 Express Delivery
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       <CalculateShippingModal 
//         isOpen={isCalculatorOpen} 
//         onClose={() => setIsCalculatorOpen(false)} 
//       />
//     </section>
//   );
// }


import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Globe2, PackageSearch, Plane } from 'lucide-react';
import { CalculateShippingModal } from './CalculateShippingModal';

export function Hero() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden scroll-mt-24"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">

          <video
            autoPlay
            muted
            loop
            playsInline
            className="
              w-full h-full object-center
              object-contain scale-125
              sm:object-cover sm:scale-110
              md:object-cover md:scale-100
            "
          >
            <source src="/videos/PICK.mp4" type="video/mp4" />
          </video>

        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-black/60 sm:bg-black/50 md:bg-black/40"></div> */}

</div>


      {/* Content */}
      {/* <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center text-white">
        <div className="max-w-2xl">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Global Logistics Network Active
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
            Buy from <span className="text-blue-400">India.</span><br />
            Ship <span className="text-gray-300">worldwide.</span>
          </h1>

          <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-lg">
            Your premium gateway to Indian stores. We purchase, consolidate,
            and ship your packages globally with speed and reliability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
              Start Shipping
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
           
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-200 transition-all"
            >
              Register Now
            </button>
          </div>

          <div className="mt-12 flex items-center gap-8 text-white/80 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Globe2 size={18} className="text-blue-400" />
              200+ Countries
            </div>

            <div className="flex items-center gap-2">
              <PackageSearch size={18} className="text-blue-400" />
              Free Consolidation
            </div>

            <div className="flex items-center gap-2">
              <Plane size={18} className="text-blue-400" />
              Express Delivery
            </div>
          </div>

        </div>
      </div> */}

      {/* <CalculateShippingModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      /> */}
    </section>
  );
}

