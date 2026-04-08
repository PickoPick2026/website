import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Package, Plane, Ship, Search, Filter, MoreVertical, ArrowRight, Globe as GlobeIcon } from 'lucide-react';

export function TrackingExperience() {
  const [trackingId, setTrackingId] = useState('');
  const [activities, setActivities] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const [showModal, setShowModal] = useState(false);
const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/shipments');
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

//   const handleTrack = async () => {
//     if (!trackingId) return;
//     setIsSearching(true);
//     setSearchResult(null);
//     try {
//       const response = await fetch(
//   `https://admin.pickopick.com/api/tracking_api/get_tracking_data?api_company_id=20&customer_code=superadmin&tracking_no=${trackingId}`
// );
//       const data = await response.json();
//       if (response.ok) {
//         setSearchResult(data);
//         // Scroll to activities section to show result if it's there
//         const target = document.querySelector('#activities-table');
//         if (target) target.scrollIntoView({ behavior: 'smooth' });
//       } else {
//         alert(data.error || 'Shipment not found');
//       }
//     } catch (error) {
//       alert('Error tracking shipment');
//     } finally {
//       setIsSearching(false);
//     }
//   };
const handleTrack = async () => {
  if (!trackingId) return;

  setIsSearching(true);
  setSearchResult(null);
  setErrorMsg("");

  try {
    const response = await fetch(`/api/shipments/${trackingId}`);
    const data = await response.json();

    if (response.ok) {
      setSearchResult(data);
    } else {
      setErrorMsg(data.error || "Shipment not found");
    }

    setShowModal(true); // ✅ open modal always
  } catch (error) {
    setErrorMsg("Error tracking shipment");
    setShowModal(true);
    trackingId && setTrackingId("");
  } finally {
    setIsSearching(false);
    trackingId && setTrackingId(""); // Clear input after search
  }
};  

const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const globeOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const globeScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const globeY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section id="track-shipment" ref={containerRef} className="bg-white scroll-mt-24">
      {/* Immersive Globe Header Section */}
      <div className="relative min-h-[800px] flex flex-col items-center justify-center overflow-hidden bg-[#050a24]">
        {/* Background Globe Image - Full Section Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#050a24] via-transparent to-[#050a24] z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050a24] via-transparent to-[#050a24] z-10" />
          <motion.div 
            style={{ opacity: globeOpacity, scale: globeScale, y: globeY }}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-7xl aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072" 
                alt="Global Network" 
                className="w-full h-full object-contain opacity-60"
                referrerPolicy="no-referrer"
              />
              {/* Atmosphere & Glow Effects */}
              <div className="absolute inset-0 rounded-full shadow-[0_0_100px_rgba(59,130,246,0.3)]" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050a24] opacity-40" />
            </div>
          </motion.div>
        </div>

        {/* Background Grid Overlay */}
        <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-8 backdrop-blur-sm"
          >
            <GlobeIcon size={16} />
            <span>AI-Powered Global Logistics</span>
          </motion.div>
          
          <div className="relative mb-12">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              Real-time Global <br /> Tracking
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Monitor your shipments across the globe with precision and transparency.
            </p>
          </div>

          {/* Search Bar - Centered on Globe */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200" />
            <div className="relative flex items-center bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl">
              <Search className="ml-4 text-slate-400" size={20} />
              <input 
                type="text" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter Cargo ID (e.g. AA-845)" 
                className="w-full bg-transparent px-4 py-4 outline-none text-white placeholder:text-slate-500 font-medium text-lg"
              />
              <button 
                onClick={handleTrack}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/40 disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Track Now'}
              </button>
            </div>
          </div>

          {/* Floating Stats or Labels like in the image */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="text-left">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">X: 5.403478</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Y: -77.399377</p>
            </div>
            <div className="hidden md:block" />
            <div className="hidden md:block" />
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Zoom: 1.0x</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">3D Mode Active</p>
            </div>
          </div>
        </div>

        {/* Curved Flight Path Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <motion.path
              d="M300,400 Q500,200 700,600"
              fill="none"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="2"
              strokeDasharray="10,10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              r="4"
              fill="#3b82f6"
              initial={{ offset: 0 }}
              animate={{ offset: 1 }}
            >
              <animateMotion
                dur="5s"
                repeatCount="indefinite"
                path="M300,400 Q500,200 700,600"
              />
            </motion.circle>
          </svg>
        </div>
      </div>

      {/* White Background Activities Section */}
      <div className="relative z-20 pt-24 pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div id="activities-table" className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">Live Activities</h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
                      <Filter size={20} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left border-b border-slate-50">
                        <th className="pb-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Cargo ID</th>
                        <th className="pb-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Destination</th>
                        <th className="pb-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Arrival date</th>
                        <th className="pb-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Status</th>
                        <th className="pb-6 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {activities.map((item, index) => (
                        <motion.tr 
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                item.status === 'Arrived' ? 'bg-amber-400 text-white' : 'bg-blue-600 text-white'
                              }`}>
                                {item.type === 'air' ? <Plane size={18} /> : <Ship size={18} />}
                              </div>
                              <span className="font-bold text-slate-900">{item.id}</span>
                            </div>
                          </td>
                          <td className="py-6">
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                <span>{item.from}</span>
                                <span className="text-slate-300 font-medium">{item.distance}</span>
                                <span>{item.to}</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${item.progress}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="h-full bg-blue-600 rounded-full relative"
                                >
                                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 border-2 border-white rounded-full shadow-sm" />
                                </motion.div>
                              </div>
                            </div>
                          </td>
                          <td className="py-6">
                            <span className="font-bold text-slate-900">{item.arrivalDate}</span>
                          </td>
                          <td className="py-6">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                              item.status === 'Arrived' 
                                ? 'bg-amber-400 text-slate-900' 
                                : 'bg-blue-600/10 text-blue-600'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-6 text-right">
                            <button className="text-slate-300 hover:text-slate-600 transition-colors">
                              <MoreVertical size={20} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-8">Main Statistics</h3>
                
                <div className="space-y-8">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Monthly Delivered</p>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold">1021</span>
                      <span className="text-emerald-400 text-sm font-bold flex items-center gap-1 mb-1">
                        <ArrowRight size={14} className="-rotate-45" />
                        +32%
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-700/50" />

                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">Yearly Delivered</p>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold">4603</span>
                      <span className="text-emerald-400 text-sm font-bold flex items-center gap-1 mb-1">
                        <ArrowRight size={14} className="-rotate-45" />
                        +12%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-4">Plan Your Route with AI ✨</h4>
                  <p className="text-blue-100 text-sm mb-6">Get instant cost and time estimates for your global shipments.</p>
                  <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors">
                    How It Works
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-fadeIn">

      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 text-slate-400 hover:text-black"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">
        {errorMsg ? "Tracking Error" : "Shipment Details"}
      </h2>

      {/* Loading */}
      {isSearching && (
        <p className="text-slate-500">Loading...</p>
      )}

      {/* Error */}
      {errorMsg && !isSearching && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg font-medium">
          {errorMsg}
        </div>
      )}

      {/* Success Data */}
      {searchResult && !isSearching && (
  <div className="space-y-4 text-slate-700">

    {/* Basic Info */}
    <p><strong>ID:</strong> {searchResult.id}</p>
    <p><strong>Status:</strong> {searchResult.status}</p>
    <p><strong>From:</strong> {searchResult.from}</p>
    <p><strong>To:</strong> {searchResult.to}</p>
    <p><strong>Delivery:</strong> {searchResult.arrivalDate}</p>

    {/* Progress */}
    <div className="mt-3">
      <div className="h-2 bg-slate-200 rounded-full">
        <div
          className="h-2 bg-blue-600 rounded-full"
          style={{ width: `${searchResult.progress}%` }}
        />
      </div>
    </div>

    {/* 🚚 Timeline */}
    <div className="mt-6">
      <h3 className="font-bold mb-3">Tracking Timeline</h3>

      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {searchResult.events.map((event: any, index: number) => (
          <div key={index} className="flex gap-3 items-start">

            <div className="w-3 h-3 mt-2 rounded-full bg-blue-600" />

            <div>
              <p className="font-semibold text-sm">
                {event.event_description}
              </p>
              <p className="text-xs text-slate-500">
                {event.event_location} • {event.event_at}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>

  </div>
)}
    </div>
  </div>
)}
    </section>
    
  );
}


