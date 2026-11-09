import React from 'react';
import { ShieldCheck, MessageCircle, Heart } from 'lucide-react';

interface FooterProps {
  onSelectState: (state: string) => void;
  onSelectCategory: (catId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectState, onSelectCategory }) => {
  return (
    <footer className="bg-[#123D32] text-[#F7F1E5] border-t border-[#D5AE70]/20 pt-16 pb-28 md:pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#F7F1E5]/15">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#D5AE70] text-[#123D32] font-black flex items-center justify-center text-xl shadow-md">
                CB
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                CLIENT<span className="text-[#D5AE70]">BRIDGE</span>
              </span>
            </div>
            <p className="text-xs text-[#F7F1E5]/80 leading-relaxed">
              Nigeria's trusted digital bridge connecting verified artisans, creative studios, and tech specialists with clients nationwide.
            </p>
            <div className="pt-2">
              <span className="text-xs text-[#D5AE70] font-extrabold uppercase tracking-wide block">
                Tagline: Your Skills Deserve Customers.
              </span>
            </div>
          </div>

          {/* Major Nigerian Hubs */}
          <div>
            <h4 className="font-bold text-sm text-[#D5AE70] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span>Commercial Hubs</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F7F1E5]/80">
              <li>
                <button 
                  onClick={() => onSelectState("Lagos")} 
                  className="hover:text-[#D5AE70] transition text-left cursor-pointer"
                >
                  Lagos (Ikeja, Lekki, Yaba, Surulere)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectState("FCT Abuja")} 
                  className="hover:text-[#D5AE70] transition text-left cursor-pointer"
                >
                  Abuja FCT (Maitama, Gwarinpa, Wuse 2)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectState("Rivers")} 
                  className="hover:text-[#D5AE70] transition text-left cursor-pointer"
                >
                  Port Harcourt, Rivers (GRA Phase 2, Peter Odili)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectState("Oyo")} 
                  className="hover:text-[#D5AE70] transition text-left cursor-pointer"
                >
                  Ibadan, Oyo (Bodija, Ring Road, Oluyole)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectState("Enugu")} 
                  className="hover:text-[#D5AE70] transition text-left cursor-pointer"
                >
                  Enugu (Independence Layout, New Haven)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectState("Kano")} 
                  className="hover:text-[#D5AE70] transition text-left cursor-pointer"
                >
                  Kano (Nassarawa GRA, Bompai)
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-bold text-sm text-[#D5AE70] uppercase tracking-wider mb-4">
              Trending Services
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F7F1E5]/80">
              <li>
                <button onClick={() => onSelectCategory("fashion")} className="hover:text-[#D5AE70] transition text-left cursor-pointer">
                  Fashion Designers & Aso-Ebi Tailoring
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("electrical")} className="hover:text-[#D5AE70] transition text-left cursor-pointer">
                  Solar Inverters & Licensed Electricians
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("web-dev")} className="hover:text-[#D5AE70] transition text-left cursor-pointer">
                  Full-Stack Web & Paystack Developers
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("photography")} className="hover:text-[#D5AE70] transition text-left cursor-pointer">
                  Wedding & Corporate Photographers
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("baking")} className="hover:text-[#D5AE70] transition text-left cursor-pointer">
                  Bakers, Caterers & Small Chops
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("graphic-design")} className="hover:text-[#D5AE70] transition text-left cursor-pointer">
                  Brand Identity & Packaging Designers
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Standards */}
          <div>
            <h4 className="font-bold text-sm text-[#D5AE70] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D5AE70]" />
              <span>Trust & Standards</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F7F1E5]/80">
              <li className="flex items-center gap-2">
                <span className="text-[#D5AE70]">✓</span>
                <span>Government ID Verification Option</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D5AE70]">✓</span>
                <span>+234 Verified WhatsApp Direct Chat</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D5AE70]">✓</span>
                <span>Transparent Upfront Naira (₦) Rates</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D5AE70]">✓</span>
                <span>Community Review Integrity Audit</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D5AE70]">✓</span>
                <span>Zero Middleman Withholding of Wages</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F7F1E5]/70 gap-4">
          <p>&copy; 2026 CLIENTBRIDGE Technologies Nigeria Ltd. RC 1984221. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>for Nigeria's hardworking creators & artisans 🇳🇬</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
