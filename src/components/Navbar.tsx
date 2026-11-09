import React, { useState, useRef, useEffect } from 'react';
import { UserSession, ViewType } from '../types';
import { Heart, ChevronDown, User, Briefcase, LogOut, Search, Calculator, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentUser: UserSession | null;
  currentView: ViewType;
  savedCount: number;
  onNavigate: (view: ViewType) => void;
  onOpenAuth: (mode: 'login' | 'register', role?: 'customer' | 'provider') => void;
  onLogout: () => void;
  onOpenCalculator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  savedCount,
  onNavigate,
  onOpenAuth,
  onLogout,
  onOpenCalculator
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#F7F1E5]/95 backdrop-blur-md border-b border-[#123D32]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-xl bg-[#123D32] flex items-center justify-center text-[#D5AE70] font-extrabold text-xl shadow-md border border-[#D5AE70]/40 group-hover:scale-105 transition-transform duration-200">
            CB
          </div>
          <div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#123D32] block leading-none">
              CLIENT<span className="text-[#D5AE70]">BRIDGE</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#52635B] font-semibold flex items-center gap-1 mt-0.5">
              <span>Your Skills Deserve Customers</span>
              <span className="text-[9px] bg-[#123D32]/10 text-[#123D32] font-bold px-1.5 py-0.2 rounded">NG 🇳🇬</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#26332D]">
          <button 
            onClick={() => onNavigate('home')} 
            className={`hover:text-[#123D32] transition-colors py-1 ${
              currentView === 'home' ? 'text-[#123D32] border-b-2 border-[#123D32]' : 'text-[#26332D]'
            }`}
          >
            Home
          </button>
          
          <button 
            onClick={() => onNavigate('browse')} 
            className={`hover:text-[#123D32] transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'browse' ? 'text-[#123D32] border-b-2 border-[#123D32]' : 'text-[#26332D]'
            }`}
          >
            <Search className="w-4 h-4 text-[#123D32]" />
            <span>Browse Professionals</span>
          </button>

          <button 
            onClick={() => onOpenAuth('register', 'provider')}
            className="hover:text-[#123D32] transition-colors py-1 flex items-center gap-1.5 text-[#123D32] font-extrabold"
            title="Create a service provider or customer dashboard"
          >
            <Briefcase className="w-4 h-4 text-[#D5AE70]" />
            <span>Create Dashboard</span>
          </button>

          <button 
            onClick={onOpenCalculator}
            className="hover:text-[#123D32] transition-colors py-1 flex items-center gap-1.5 text-[#52635B] hover:text-[#123D32]"
            title="Estimate project costs in Nigerian Naira"
          >
            <Calculator className="w-4 h-4 text-[#D5AE70]" />
            <span>Pricing Estimator</span>
          </button>

          {currentUser && (
            <button 
              onClick={() => onNavigate(currentUser.role === 'provider' ? 'provider-dashboard' : 'customer-dashboard')}
              className={`hover:text-[#123D32] transition-colors py-1 flex items-center gap-1.5 ${
                currentView === 'provider-dashboard' || currentView === 'customer-dashboard' 
                  ? 'text-[#123D32] border-b-2 border-[#123D32]' 
                  : 'text-[#26332D]'
              }`}
            >
              <span>{currentUser.role === 'provider' ? 'Provider Portal' : 'My Dashboard'}</span>
              <span className="w-2 h-2 rounded-full bg-[#D5AE70] animate-pulse"></span>
            </button>
          )}

          <button 
            onClick={() => onNavigate('saved')} 
            className={`relative hover:text-[#123D32] transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'saved' ? 'text-[#123D32] border-b-2 border-[#123D32]' : 'text-[#26332D]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="bg-[#123D32] text-[#D5AE70] text-xs px-2 py-0.5 rounded-full font-bold ml-0.5">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Auth / User Action Area */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 bg-white border border-[#123D32]/20 px-3.5 py-2 rounded-2xl cursor-pointer hover:border-[#D5AE70] shadow-xs transition"
                aria-expanded={userMenuOpen}
              >
                <div className="w-8 h-8 rounded-full bg-[#123D32] text-[#D5AE70] font-bold flex items-center justify-center text-xs border border-[#D5AE70]/40 shadow-xs overflow-hidden shrink-0">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-xs font-bold text-[#26332D] leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#123D32] font-bold uppercase tracking-wider flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-[#123D32]" />
                    {currentUser.role === 'provider' ? 'Verified Provider' : 'Client Account'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#52635B]" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-[#123D32]/15 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#123D32]/10">
                    <p className="text-xs font-bold text-[#26332D] truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-[#52635B] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#F7F1E5] text-[#123D32] border border-[#123D32]/20">
                      {currentUser.role === 'provider' ? 'Provider Account' : 'Customer Account'}
                    </span>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'provider' ? (
                      <button 
                        onClick={() => { onNavigate('provider-dashboard'); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#26332D] hover:bg-[#F7F1E5] hover:text-[#123D32] transition flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-[#123D32]" />
                          Provider Dashboard
                        </span>
                        <span className="text-xs">💼</span>
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => { onNavigate('customer-dashboard'); setUserMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#26332D] hover:bg-[#F7F1E5] hover:text-[#123D32] transition flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-[#123D32]" />
                            Client Dashboard
                          </span>
                          <span className="text-xs">📊</span>
                        </button>
                        <button 
                          onClick={() => { onOpenAuth('register', 'provider'); setUserMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold text-[#123D32] bg-[#FAF7F0] hover:bg-[#EDE3D1] transition flex items-center justify-between cursor-pointer mt-1 border border-[#123D32]/10"
                        >
                          <span className="flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-[#D5AE70]" />
                            Create Provider Dashboard
                          </span>
                          <span className="text-[10px] bg-[#123D32] text-[#D5AE70] px-1.5 py-0.2 rounded font-black">+PRO</span>
                        </button>
                      </>
                    )}
                    
                    <button 
                      onClick={() => { onNavigate('saved'); setUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#26332D] hover:bg-[#F7F1E5] hover:text-[#123D32] transition flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        Saved & Outreach
                      </span>
                      <span className="text-xs bg-[#123D32]/10 text-[#123D32] px-1.5 py-0.5 rounded-full">{savedCount}</span>
                    </button>

                    <button 
                      onClick={() => { onNavigate('browse'); setUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#26332D] hover:bg-[#F7F1E5] hover:text-[#123D32] transition flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-[#123D32]" />
                        Explore Marketplace
                      </span>
                      <span className="text-xs">🔎</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-[#123D32]/10">
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5 text-rose-700" />
                        Sign Out
                      </span>
                      <span className="text-xs">🚪</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onOpenAuth('login')}
                className="text-xs sm:text-sm font-bold text-[#26332D] hover:text-[#123D32] px-3 py-2 rounded-xl transition hover:bg-[#EDE3D1]/50 cursor-pointer"
              >
                Sign In
              </button>
              <button 
                onClick={() => onOpenAuth('register', 'provider')}
                className="bg-[#123D32] text-[#D5AE70] hover:bg-[#1B5445] px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all border border-[#D5AE70]/40 hover:scale-102 active:scale-98 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Create Dashboard</span>
                <span className="text-[10px] bg-[#D5AE70] text-[#123D32] px-1.5 py-0.2 rounded-md font-black hidden sm:inline-block">NEW</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
