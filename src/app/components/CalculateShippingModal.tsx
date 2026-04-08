import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Package, Calculator, ArrowRight, Plane } from 'lucide-react';

interface CalculateShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalculateShippingModal({ isOpen, onClose }: CalculateShippingModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{ cost: number; days: string } | null>(null);

  const [formData, setFormData] = useState({
    destination: '',
    weight: '',
    length: '',
    width: '',
    height: '',
  });

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destination || !formData.weight) return;
    
    setIsCalculating(true);
    
    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: formData.destination,
          weight: formData.weight
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult({
          cost: data.cost,
          days: data.days,
        });
        setStep(2);
      } else {
        alert(data.error || 'Calculation failed');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setResult(null);
    setFormData({
      destination: '',
      weight: '',
      length: '',
      width: '',
      height: '',
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300); // Reset after animation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
              
              {/* Header */}
              <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Calculator size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Shipping Calculator</h2>
                    <p className="text-xs text-slate-500">Get an instant estimate</p>
                  </div>
                </div>
                <button 
                  onClick={handleClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleCalculate} 
                      className="flex flex-col gap-5"
                    >
                      
                      {/* Route */}
                      <div className="flex flex-col gap-3 relative">
                        <div className="absolute left-[1.1rem] top-8 bottom-8 w-px bg-slate-200 z-0" />
                        
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-500 shadow-sm">
                            <MapPin size={16} />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
                            <input type="text" value="India (Warehouse)" disabled className="w-full bg-slate-50 border border-slate-200 text-slate-500 text-sm rounded-lg px-3 py-2 outline-none cursor-not-allowed" />
                          </div>
                        </div>

                        <div className="relative z-10 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 shadow-sm">
                            <Plane size={16} />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-700 mb-1">To Destination</label>
                            <select 
                              required
                              value={formData.destination}
                              onChange={(e) => setFormData({...formData, destination: e.target.value})}
                              className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            >
                              <option value="">Select country...</option>
                              <option value="US">United States</option>
                              <option value="UK">United Kingdom</option>
                              <option value="CA">Canada</option>
                              <option value="AU">Australia</option>
                              <option value="AE">UAE</option>
                              <option value="SG">Singapore</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100 my-2" />

                      {/* Package Details */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Package size={16} className="text-slate-400" />
                          <h3 className="text-sm font-semibold text-slate-700">Package Details</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-medium text-slate-700 mb-1">Weight (kg)</label>
                            <input 
                              type="number" 
                              required
                              min="0.1"
                              step="0.1"
                              placeholder="e.g. 2.5"
                              value={formData.weight}
                              onChange={(e) => setFormData({...formData, weight: e.target.value})}
                              className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-medium text-slate-700 mb-1">Dimensions (cm) <span className="text-slate-400 font-normal">Optional</span></label>
                            <div className="flex items-center gap-2">
                              <input type="number" placeholder="L" value={formData.length} onChange={(e) => setFormData({...formData, length: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-2 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-center" />
                              <span className="text-slate-300 text-xs">x</span>
                              <input type="number" placeholder="W" value={formData.width} onChange={(e) => setFormData({...formData, width: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-2 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-center" />
                              <span className="text-slate-300 text-xs">x</span>
                              <input type="number" placeholder="H" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-2 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-center" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isCalculating}
                        className="w-full mt-4 bg-gradient-to-br from-blue-600 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isCalculating ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Calculate Estimate
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col items-center text-center py-4"
                    >
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <Plane size={32} className="ml-1" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">Estimated Cost</h3>
                      <p className="text-sm text-slate-500 mb-8">India to {formData.destination} • {formData.weight}kg</p>
                      
                      <div className="w-full bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                        <div className="flex justify-between items-end mb-4">
                          <span className="text-slate-600 font-medium">Express Shipping</span>
                          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">${result?.cost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Estimated Delivery</span>
                          <span className="font-semibold text-slate-700">{result?.days} Business Days</span>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full">
                        <button 
                          onClick={() => setStep(1)}
                          className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                        >
                          Recalculate
                        </button>
                        <button 
                          onClick={handleClose}
                          className="flex-1 py-3 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-900 transition-colors shadow-lg shadow-blue-600/20"
                        >
                          Start Shipping
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
