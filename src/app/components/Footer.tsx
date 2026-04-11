import { Package } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-6 text-white">
              <div className="mb-6 -mt-[80px] md:-mt-[115px] -mb-[120px] md:-mb-[145px] w-[200px] md:w-[240px]">
                <img
                  src="/PICKLogo.png"
                  alt="PickoPick"
                  className="w-full object-contain"
                />
              </div>
            </a>
            <p className="mb-6 max-w-sm">
              Your premium global logistics partner. Buy from any Indian store and we'll ship it to your doorstep anywhere in the world.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-800 hover:text-white transition-colors cursor-pointer">X</div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-800 hover:text-white transition-colors cursor-pointer">in</div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-800 hover:text-white transition-colors cursor-pointer">ig</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6">Services</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Personal Shopper</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Package Consolidation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">International Shipping</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">B2B Logistics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Prohibited Items</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} PickoPick. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Made with precision for global commerce.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
