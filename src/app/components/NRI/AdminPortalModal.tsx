import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Package, 
  Phone, 
  MapPin, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'consultations' | 'slotBlocks'>('bookings');
  const [data, setData] = useState<{
    bookings: any[];
    consultations: any[];
    slotBlocks: any[];
    summary: { totalBookings: number; totalConsultations: number; totalSlotBlocks: number };
  }>({
    bookings: [],
    consultations: [],
    slotBlocks: [],
    summary: { totalBookings: 0, totalConsultations: 0, totalSlotBlocks: 0 },
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/bookings');
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const exportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pickopick-nri-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0A1931] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-[#FF6321]">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">Pick O Pick Operations & CRM Hub</h3>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  LIVE PERSISTENT DB
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time inspection of customer booking dockets, consultations, and slot reservations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={exportJson}
              className="p-2 px-3 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Export JSON for CRM / Google Sheets"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector & Metrics */}
        <div className="bg-[#F1F5F9] p-3 px-6 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#0A1931] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Shipment Bookings ({data.bookings.length})
            </button>

            <button
              onClick={() => setActiveTab('consultations')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'consultations'
                  ? 'bg-[#0A1931] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Consultations ({data.consultations.length})
            </button>

            <button
              onClick={() => setActiveTab('slotBlocks')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'slotBlocks'
                  ? 'bg-[#0A1931] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Slot Reservations ({data.slotBlocks.length})
            </button>
          </div>

          <span className="text-[11px] text-slate-500">
            Total Records: <strong className="text-slate-800">{data.bookings.length + data.consultations.length + data.slotBlocks.length}</strong>
          </span>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'bookings' && (
            <div>
              {data.bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No shipment requests booked yet. Fill the booking form on the homepage to generate live dockets!
                </div>
              ) : (
                <div className="space-y-3">
                  {data.bookings.map((b) => (
                    <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-[#FF6321] text-sm">{b.id}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                            {b.data?.serviceType?.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                          className="p-1 rounded-lg border border-slate-300 font-bold text-[11px] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                        >
                          <option value="RECEIVED">RECEIVED</option>
                          <option value="IN_REVIEW">IN REVIEW</option>
                          <option value="SLOT_RESERVED">SLOT RESERVED</option>
                          <option value="PICKUP_COORDINATED">PICKUP COORDINATED</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Destination</span>
                          <strong>{b.data?.destinationCountry} ({b.data?.destinationCity || 'City'})</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Pickup Date/Slot</span>
                          <span>{b.data?.preferredPickupDate} â€¢ {b.data?.preferredPickupSlotLabel?.split('(')[0]}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Client Contact</span>
                          <span>{b.data?.customerName || b.data?.pickupName} ({b.data?.customerWhatsapp})</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Pickup PIN/City</span>
                          <span>{b.data?.pickupCity}, PIN {b.data?.pickupPin}</span>
                        </div>
                      </div>

                      {b.data?.requirementDescription && (
                        <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                          Note: "{b.data.requirementDescription}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'consultations' && (
            <div>
              {data.consultations.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No consultation requests yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.consultations.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#FF6321]">{c.id}</span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Customer</span>
                          <strong>{c.fullName} ({c.currentCountry})</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">WhatsApp</span>
                          <span className="font-semibold text-emerald-700">{c.whatsappNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Preferred Time</span>
                          <span>{c.preferredDate} ({c.preferredTime})</span>
                        </div>
                      </div>
                      {c.requirementHelp && (
                        <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                          Inquiry: {c.requirementHelp}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'slotBlocks' && (
            <div>
              {data.slotBlocks.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No reserved slots yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.slotBlocks.map((sb) => (
                    <div key={sb.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#0A1931]">{sb.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF6321] text-[10px] font-bold">
                          {sb.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Reserved For</span>
                          <strong>{sb.customerName}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Destination & Date</span>
                          <span>{sb.destinationCountry} â€¢ {sb.preferredDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Time Slot</span>
                          <span>{sb.preferredTimeSlot}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
