import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Package, Plane, Ship, Search, Filter, MoreVertical, ArrowRight, Globe as GlobeIcon, CheckCircle2, Rocket } from 'lucide-react';

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

  useEffect(() => {
    const prefillTrackingId = (event: Event) => {
      const trackingEvent = event as CustomEvent<string>;
      if (trackingEvent.detail) setTrackingId(trackingEvent.detail);
    };
    window.addEventListener('pickopick:prefill-tracking', prefillTrackingId);
    return () => window.removeEventListener('pickopick:prefill-tracking', prefillTrackingId);
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/shipments');
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setActivities([]);
        return;
      }
      const data = await response.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleTrack = async () => {
    if (!trackingId) return;

    setIsSearching(true);
    setSearchResult(null);
    setErrorMsg("");

    try {
      const response = await fetch(`/api/shipments/${trackingId}`);
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setErrorMsg("Server returned an invalid response. Please try again.");
        setShowModal(true);
        setTrackingId("");
        setIsSearching(false);
        return;
      }
      const data = await response.json();
      console.log("TRACK RESPONSE:", data);
      if (response.ok) {
        setSearchResult(data);
      } else {
        setErrorMsg(data.error || "Shipment not found");
      }

      setShowModal(true);
    } catch (error) {
      console.error("TRACK ERROR:", error);
      setErrorMsg("Error tracking shipment");
      setShowModal(true);
      trackingId && setTrackingId("");
    } finally {
      setIsSearching(false);
      trackingId && setTrackingId("");
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
      {/* ===== SECTION 1 : Tracking Search Header ===== */}
      <div className="relative overflow-hidden border-b border-blue-700 bg-[#0B56D9] pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="absolute inset-0 z-0">
          <motion.div
            style={{ opacity: globeOpacity, scale: globeScale, y: globeY }}
            className="flex h-full w-full items-center justify-center"
          >
            <img
              src="/images/nri-hero-logistics-v2.webp"
              alt="Global Network"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-8">
          {/* Eyebrow pill */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            <GlobeIcon className="h-3.5 w-3.5" />
            AI-Powered Real-Time Tracking
          </span>

          <h1 className="mt-6 whitespace-pre-line text-[clamp(1.9rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-white">
            Real-time Global Tracking
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-blue-50 sm:text-lg">
            Monitor your shipments across the globe with precision and transparency — from our hub to your overseas doorstep.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-9 flex max-w-2xl flex-col items-center gap-3 sm:flex-row">
            <div className="relative flex w-full items-center rounded-full border border-white/30 bg-white/15 px-5 backdrop-blur-sm">
              <Search className="h-5 w-5 shrink-0 text-blue-100" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                placeholder="Enter Cargo ID (e.g. AA-845)"
                className="w-full bg-transparent px-3 py-4 text-left text-sm font-medium text-white outline-none placeholder:text-blue-100"
              />
            </div>
            <button
              onClick={handleTrack}
              disabled={isSearching}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50 disabled:opacity-50 sm:w-auto"
            >
              {isSearching ? 'Searching...' : 'TRACK NOW'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Assurance strip */}
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/25 pt-5 text-xs text-blue-50">
            <span className="inline-flex items-center gap-2"><Plane className="h-4 w-4" /> 180+ global routes</span>
            <span className="inline-flex items-center gap-2"><Package className="h-4 w-4" /> End-to-end visibility</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> WhatsApp event updates</span>
          </div>
        </div>
      </div>

      {/* ===== SECTION 2 : Live Activities Dashboard ===== */}
      <div className="bg-[#F7F9FF] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          {/* Section header */}
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
              Live Network Activity
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">
              Shipments in Motion, Right Now
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Live updates from parcels currently travelling across our global network — air and sea, headed to families everywhere.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Live Activities table */}
            <div id="activities-table" className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2">
              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-extrabold tracking-tight text-[#0A1931]">Live Activities</h3>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live
                    </span>
                    <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50">
                      <Filter size={20} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-left">
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Cargo ID</th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Destination</th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Arrival date</th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                        <th className="w-10 pb-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activities.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group transition-colors hover:bg-blue-50/40"
                        >
                          <td className="py-5">
                            <div className="flex items-center gap-4">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                item.status === 'Arrived' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-[#0B56D9]'
                              }`}>
                                {item.type === 'air' ? <Plane size={18} /> : <Ship size={18} />}
                              </div>
                              <span className="font-bold text-[#0A1931]">{item.id}</span>
                            </div>
                          </td>
                          <td className="py-5">
                            <div className="flex min-w-[220px] flex-col gap-2">
                              <div className="flex items-center justify-between text-xs font-bold text-[#0A1931]">
                                <span>{item.from}</span>
                                <span className="font-medium text-slate-300">{item.distance}</span>
                                <span>{item.to}</span>
                              </div>
                              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${item.progress}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="relative h-full rounded-full bg-[#0B56D9]"
                                >
                                  <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#0B56D9] shadow-sm" />
                                </motion.div>
                              </div>
                            </div>
                          </td>
                          <td className="py-5">
                            <span className="font-bold text-[#0A1931]">{item.arrivalDate}</span>
                          </td>
                          <td className="py-5">
                            <span className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                              item.status === 'Arrived'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-50 text-[#0B56D9]'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-5 text-right">
                            <button className="text-slate-300 transition-colors hover:text-slate-600">
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

            {/* Right column: stats + CTA */}
            <div className="space-y-6">
              {/* Stats card */}
              <div className="relative overflow-hidden rounded-2xl p-7 text-white">
                <img
                  src="/images/nri-hero-logistics-v2.webp"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover brightness-[0.65]"
                />
                <div className="relative z-10">
                  <h3 className="text-base font-extrabold tracking-tight">Network Statistics</h3>

                  <div className="mt-6 space-y-6">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-blue-50">Monthly Delivered</p>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
                          <ArrowRight size={14} className="-rotate-45" /> +32%
                        </span>
                      </div>
                      <p className="mt-2 text-4xl font-extrabold tracking-tight">1021</p>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
                        <div className="h-full w-[82%] rounded-full bg-white" />
                      </div>
                    </div>

                    <div className="h-px bg-white/15" />

                    <div>
                      <div className="flex items-baseline justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-blue-50">Yearly Delivered</p>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
                          <ArrowRight size={14} className="-rotate-45" /> +12%
                        </span>
                      </div>
                      <p className="mt-2 text-4xl font-extrabold tracking-tight">4603</p>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
                        <div className="h-full w-[64%] rounded-full bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Route planner CTA card */}
              <div className="relative overflow-hidden rounded-2xl bg-[#0B56D9] p-7 text-white" style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="relative z-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-lg font-extrabold tracking-tight">Plan Your Route with AI</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-blue-100">
                    Get instant cost and time estimates for your global shipments.
                  </p>
                  <button className="mt-5 w-full rounded-full bg-white py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50">
                    How It Works
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Result Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 sm:items-center sm:justify-center sm:p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 text-[#0B56D9]">
                  <Package className="h-5 w-5" />
                </div>
                <h2 className="text-base font-extrabold text-[#0A1931]">
                  {errorMsg ? "Tracking Error" : "Shipment Details"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {isSearching && <p className="text-sm text-slate-500">Loading...</p>}

              {errorMsg && !isSearching && (
                <div className="rounded-lg bg-red-50 p-4 text-xs font-semibold text-red-700">
                  {errorMsg}
                </div>
              )}

              {searchResult && !isSearching && (
                <div className="space-y-4 text-slate-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ID</p>
                      <p className="mt-0.5 text-sm font-bold text-[#0A1931]">{searchResult.id}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</p>
                      <p className="mt-0.5 text-sm font-bold text-[#0B56D9]">{searchResult.status}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">From</p>
                      <p className="mt-0.5 text-sm font-bold text-[#0A1931]">{searchResult.from}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">To</p>
                      <p className="mt-0.5 text-sm font-bold text-[#0A1931]">{searchResult.to}</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">Delivery</p>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-[#0B56D9]" style={{ width: `${searchResult.progress}%` }} />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-extrabold text-[#0A1931]">Tracking Timeline</h3>
                    <div className="max-h-60 space-y-4 overflow-y-auto pr-2">
                      {searchResult.events.map((event: any, index: number) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="mt-2 h-3 w-3 rounded-full bg-[#0B56D9]" />
                          <div>
                            <p className="text-sm font-semibold text-[#0A1931]">{event.event_description}</p>
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

            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full rounded-full bg-[#0A1931] py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#162847]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
