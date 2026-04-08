import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CalculateShippingModal } from './CalculateShippingModal';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

export function CTA() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <section id="contact" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-blue-900/20 overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[3rem] pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Ready to shop globally?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Create your free PickoPick account today and get your virtual Indian shipping address instantly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                  onClick={() => setIsRegisterOpen(true)}
                  className="relative overflow-hidden rounded-full bg-white px-8 py-3 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 text-base">
                      Create Free Account
                    </span>
                    
                  </span>
                </button>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="px-8 py-4 bg-blue-700/50 text-white border border-blue-500/50 rounded-full font-bold text-lg hover:bg-blue-700/80 transition-colors backdrop-blur-sm"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <CalculateShippingModal 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />
      <RegisterModal 
              isOpen={isRegisterOpen} 
              onClose={() => setIsRegisterOpen(false)} 
              onLoginClick={() => {
                setIsRegisterOpen(false);
                setIsLoginOpen(true);
              }}
            />
      <LoginModal
              isOpen={isLoginOpen}
              onClose={() => setIsLoginOpen(false)}
              onRegisterClick={() => {
                setIsLoginOpen(false);
                setIsRegisterOpen(true);     
              }}
            />
    </section>
  );
}
