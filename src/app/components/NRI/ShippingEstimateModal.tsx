import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calculator, 
  Sparkles, 
  Plane, 
  Info, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { POPULAR_NRI_COUNTRIES, ALL_SUPPORTED_COUNTRIES } from './data/mockData';
import { ShippingEstimateResult } from './types';

interface ShippingEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedWithEstimate?: (country: string, weight: number) => void;
}

export const ShippingEstimateModal: React.FC<ShippingEstimateModalProps> = ({
  isOpen,
  onClose,
  onProceedWithEstimate,
}) => {
  const [destinationCountry, setDestinationCountry] = useState('USA');
  const [weightKg, setWeightKg] = useState('5');
  const [lengthCm, setLengthCm] = useState('');
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [estimateResult, setEstimateResult] = useState<ShippingEstimateResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateEstimate = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationCountry,
          weightKg: parseFloat(weightKg) || 1,
          lengthCm: parseFloat(lengthCm) || 0,
          widthCm: parseFloat(widthCm) || 0,
          heightCm: parseFloat(heightCm) || 0,
        }),
      });
      const data = await res.json();
      setEstimateResult(data);
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      calculateEstimate();
    }
  }, [isOpen, destinationCountry, weightKg, lengthCm, widthCm, heightCm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#0A1931] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6321] flex items-center justify-center text-white font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                International Shipping Rate Estimator
              </h3>
              <p className="text-xs text-slate-300">
                Transparent live estimates with volumetric packaging comparison
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Destination Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Destination Country:
            </label>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {POPULAR_NRI_COUNTRIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setDestinationCountry(c)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                    destinationCountry.toLowerCase() === c.toLowerCase()
                      ? 'bg-[#0A1931] text-white border-[#0A1931]'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <select
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
            >
              {ALL_SUPPORTED_COUNTRIES.map((cntry) => (
                <option key={cntry} value={cntry}>{cntry}</option>
              ))}
            </select>
          </div>

          {/* Weight & Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Actual Weight (KG):
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Dimensions (L x W x H in cm) - Optional:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="L (cm)"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(e.target.value)}
                  className="p-3 rounded-xl border border-slate-300 text-xs text-center focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                />
                <input
                  type="number"
                  placeholder="W (cm)"
                  value={widthCm}
                  onChange={(e) => setWidthCm(e.target.value)}
                  className="p-3 rounded-xl border border-slate-300 text-xs text-center focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                />
                <input
                  type="number"
                  placeholder="H (cm)"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="p-3 rounded-xl border border-slate-300 text-xs text-center focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                />
              </div>
            </div>
          </div>

          {/* Rate Estimate Card */}
          {estimateResult && (
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                    ESTIMATED RATE BRACKET
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#0A1931]">
                      ₹{estimateResult.estimatedInrMin.toLocaleString('en-IN')} – ₹{estimateResult.estimatedInrMax.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      (~${estimateResult.estimatedUsdMin} – ${estimateResult.estimatedUsdMax} USD)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Transit Window</span>
                  <p className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1">
                    <Plane className="w-3.5 h-3.5" />
                    <span>{estimateResult.transitDays}</span>
                  </p>
                </div>
              </div>

              {/* Billable weight breakdown */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Actual Weight</span>
                  <span className="font-bold text-slate-800">{estimateResult.actualWeightKg} kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Volumetric Wt</span>
                  <span className="font-bold text-slate-800">{estimateResult.volumetricWeightKg || '0.0'} kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200">
                  <span className="text-[10px] text-[#FF6321] block font-bold">Chargeable Wt</span>
                  <span className="font-bold text-orange-950">{estimateResult.billableWeightKg} kg</span>
                </div>
              </div>

              {/* Key Bullet Notes */}
              <div className="space-y-1 text-[11px] text-slate-600">
                {estimateResult.notes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              if (onProceedWithEstimate) {
                onProceedWithEstimate(destinationCountry, parseFloat(weightKg) || 1);
              }
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-[#FF6321] hover:bg-orange-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Proceed to Booking with this estimate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
