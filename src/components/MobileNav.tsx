import React from 'react';
import { ViewType, UserSession } from '../types';
import { Home, Search, Heart, Briefcase, User, LogIn } from 'lucide-react';

interface MobileNavProps {
  currentView: ViewType;
  currentUser: UserSession | null;
  savedCount: number;
  onNavigate: (view: ViewType) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  currentUser,
  savedCount,
  onNavigate,
  onOpenAuth
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F7F1E5]/95 backdrop-blur-lg border-t border-[#123D32]/20 px-4 py-2 flex items-center justify-around text-[10px] font-bold text-[#26332D] shadow-2xl">
      <button 
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-1 py-1 transition ${
          currentView === 'home' ? 'text-[#123D32] font-extrabold' : 'text-[#52635B]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>
      
      <button 
        onClick={() => onNavigate('browse')}
        className={`flex flex-col items-center gap-1 py-1 transition ${
          currentView === 'browse' ? 'text-[#123D32] font-extrabold' : 'text-[#52635B]'
        }`}
      >
        <Search className="w-5 h-5" />
        <span>Browse</span>
      </button>

      <button 
        onClick={() => onNavigate('saved')}
        className={`flex flex-col items-center gap-1 py-1 relative transition ${
          currentView === 'saved' ? 'text-[#123D32] font-extrabold' : 'text-[#52635B]'
        }`}
      >
        <Heart className="w-5 h-5" />
        <span>Saved</span>
        {savedCount > 0 && (
          <span className="absolute top-0 right-1 w-4 h-4 bg-[#123D32] text-[#D5AE70] rounded-full text-[9px] flex items-center justify-center font-bold">
            {savedCount}
          </span>
        )}
      </button>

      {currentUser ? (
        <button 
          onClick={() => onNavigate(currentUser.role === 'provider' ? 'provider-dashboard' : 'customer-dashboard')}
          className={`flex flex-col items-center gap-1 py-1 transition cursor-pointer ${
            currentView === 'provider-dashboard' || currentView === 'customer-dashboard' 
              ? 'text-[#123D32] font-black' 
              : 'text-[#52635B]'
          }`}
        >
          {currentUser.role === 'provider' ? (
            <Briefcase className="w-5 h-5 text-[#123D32]" />
          ) : (
            <User className="w-5 h-5 text-[#123D32]" />
          )}
          <span>{currentUser.role === 'provider' ? 'Provider' : 'Dashboard'}</span>
        </button>
      ) : (
        <button 
          onClick={() => onOpenAuth('register')}
          className="flex flex-col items-center gap-1 py-1 text-[#123D32] font-black cursor-pointer"
        >
          <Briefcase className="w-5 h-5 text-[#D5AE70]" />
          <span>Dashboard</span>
        </button>
      )}
    </div>
  );
};
