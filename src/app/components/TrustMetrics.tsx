import CountUp from 'react-countup';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function TrustMetrics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="pt-24 pb-12 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-2">
              {isInView ? <CountUp end={500} suffix="K+" duration={2.5} /> : "0"}
            </div>
            <p className="text-slate-600 font-medium">Packages Delivered</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-2">
              {isInView ? <CountUp end={200} suffix="+" duration={2.5} /> : "0"}
            </div>
            <p className="text-slate-600 font-medium">Countries Served</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-2">
              {isInView ? <CountUp end={50} suffix="K+" duration={2.5} /> : "0"}
            </div>
            <p className="text-slate-600 font-medium">Happy Customers</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-2">
              {isInView ? <CountUp end={10} suffix="+" duration={2.5} /> : "0"}
            </div>
            <p className="text-slate-600 font-medium">Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
}
