import React, { useMemo } from 'react';
import { UserSession, Professional, InquiryHistoryItem, Review, ViewType } from '../types';
import { ProfessionalCard } from './ProfessionalCard';
import { ShieldCheck, MessageCircle, Heart, Star, ArrowRight, User, Trash2, Camera, Upload } from 'lucide-react';
import { processImageFile } from '../utils/imageUpload';

interface CustomerDashboardProps {
  currentUser: UserSession;
  savedPros: string[];
  professionals: Professional[];
  contactHistory: InquiryHistoryItem[];
  reviews: Review[];
  onNavigate: (view: ViewType) => void;
  onOpenModal: (pro: Professional) => void;
  onContactWhatsApp: (pro: Professional, serviceName?: string) => void;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onClearHistoryItem?: (id: string) => void;
  onCreateProviderDashboard?: () => void;
  onUpdateAvatar?: (avatarUrl: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  savedPros,
  professionals,
  contactHistory,
  reviews,
  onNavigate,
  onOpenModal,
  onContactWhatsApp,
  onToggleFavorite,
  onClearHistoryItem,
  onCreateProviderDashboard,
  onUpdateAvatar
}) => {
  const bookmarkedList = useMemo(() => {
    return professionals.filter(p => savedPros.includes(p.id));
  }, [professionals, savedPros]);

  const myReviews = useMemo(() => {
    return reviews.filter(r => r.author.toLowerCase() === currentUser.name.toLowerCase());
  }, [reviews, currentUser]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-200">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#123D32]/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D32]/10 text-[#123D32] text-xs font-bold mb-2">
            <span>🇳🇬</span>
            <span>Verified Nigerian Client Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#123D32]">
            Welcome Back, {currentUser.name}!
          </h1>
          <p className="text-xs sm:text-sm text-[#52635B] mt-1 font-medium">
            Manage your saved Nigerian artisans, tracked WhatsApp inquiries, and ratings.
          </p>
        </div>

        <button 
          onClick={() => onNavigate('browse')}
          className="bg-[#123D32] text-[#D5AE70] px-5 py-3 rounded-2xl font-bold text-xs border border-[#D5AE70]/40 hover:bg-[#1B5445] transition shadow-md flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <span>Find More Artisans</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-[#123D32]/10 shadow-xs">
          <span className="text-[11px] font-bold text-[#52635B] uppercase tracking-wider block">Bookmarked Pros</span>
          <span className="text-2xl font-black text-[#123D32] mt-1 block">{savedPros.length}</span>
          <span className="text-[10px] text-[#123D32] font-semibold flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            Active favorites
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D5AE70]/40 shadow-xs">
          <span className="text-[11px] font-bold text-[#52635B] uppercase tracking-wider block">WhatsApp Outreach</span>
          <span className="text-2xl font-black text-[#D5AE70] mt-1 block">{contactHistory.length}</span>
          <span className="text-[10px] text-[#52635B] font-semibold flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-[#123D32]" />
            Inquiries recorded
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#123D32]/10 shadow-xs">
          <span className="text-[11px] font-bold text-[#52635B] uppercase tracking-wider block">Reviews Submitted</span>
          <span className="text-2xl font-black text-[#123D32] mt-1 block">{myReviews.length}</span>
          <span className="text-[10px] text-[#52635B] font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 text-[#D5AE70]" />
            Community contributions
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#123D32]/10 shadow-xs">
          <span className="text-[11px] font-bold text-[#52635B] uppercase tracking-wider block">Verified WhatsApp</span>
          <span className="text-xs font-black text-[#123D32] mt-2 inline-flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#123D32]" />
            +234 {currentUser.phone}
          </span>
          <span className="text-[10px] text-[#7B8C85] block mt-1">Direct inquiries active</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Bookmarked Pros */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#123D32] flex items-center gap-2">
              <span>Your Bookmarked Professionals</span>
              <span className="text-xs bg-[#123D32] text-[#D5AE70] px-2.5 py-0.5 rounded-full font-bold">
                {bookmarkedList.length}
              </span>
            </h2>
            <button 
              onClick={() => onNavigate('browse')} 
              className="text-xs font-bold text-[#123D32] underline hover:text-[#1B5445] cursor-pointer"
            >
              Explore more categories
            </button>
          </div>

          {bookmarkedList.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl text-center border border-[#123D32]/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F7F1E5] text-[#123D32] flex items-center justify-center mx-auto text-xl">
                ❤️
              </div>
              <h3 className="text-base font-bold text-[#123D32]">No bookmarked professionals yet</h3>
              <p className="text-xs text-[#52635B] max-w-sm mx-auto">
                Save artisans while browsing so you can easily compare pricing and message them when you're ready.
              </p>
              <button 
                onClick={() => onNavigate('browse')} 
                className="mt-2 px-5 py-2.5 bg-[#123D32] text-[#D5AE70] font-bold text-xs rounded-xl border border-[#D5AE70]/30 hover:bg-[#1B5445] transition cursor-pointer"
              >
                Browse All Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {bookmarkedList.map(pro => (
                <ProfessionalCard 
                  key={pro.id} 
                  pro={pro}
                  isSaved={true}
                  onToggleFavorite={onToggleFavorite}
                  onOpenModal={() => onOpenModal(pro)}
                  onContactWhatsApp={onContactWhatsApp}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Profile & Outreach Log */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Client Details Box */}
          <div className="bg-white p-6 rounded-3xl border border-[#123D32]/10 shadow-xs">
            <h3 className="font-extrabold text-[#123D32] text-sm mb-4 pb-2 border-b border-[#123D32]/10 flex items-center gap-2">
              <User className="w-4 h-4 text-[#D5AE70]" />
              <span>Your Client Profile</span>
            </h3>
            <div className="flex items-center gap-4 pb-3 mb-3 border-b border-[#123D32]/10">
              <div className="relative group shrink-0">
                <img 
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"} 
                  alt={currentUser.name} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D5AE70] shadow-xs"
                />
                <label 
                  className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer text-[10px] font-bold"
                  title="Upload picture"
                >
                  <Camera className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const dataUrl = await processImageFile(file, 400, 400, 0.85);
                        onUpdateAvatar && onUpdateAvatar(dataUrl);
                      } catch (err) {}
                    }}
                  />
                </label>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#7B8C85] block">Profile Picture</span>
                <label className="text-[11px] font-extrabold text-[#123D32] hover:underline cursor-pointer flex items-center gap-1 mt-0.5">
                  <Upload className="w-3 h-3 text-[#D5AE70]" />
                  <span>Upload New Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const dataUrl = await processImageFile(file, 400, 400, 0.85);
                        onUpdateAvatar && onUpdateAvatar(dataUrl);
                      } catch (err) {}
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#52635B] block text-[11px]">Full Name:</span>
                <span className="font-bold text-[#26332D] text-sm">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-[#52635B] block text-[11px]">Email Address:</span>
                <span className="font-semibold text-[#26332D]">{currentUser.email}</span>
              </div>
              <div>
                <span className="text-[#52635B] block text-[11px]">WhatsApp Phone:</span>
                <span className="font-bold text-[#123D32]">+234 {currentUser.phone}</span>
              </div>
              <div>
                <span className="text-[#52635B] block text-[11px]">Account Type:</span>
                <span className="inline-block mt-0.5 text-[10px] font-bold bg-[#FAF7F0] text-[#123D32] px-2 py-0.5 rounded-md border border-[#123D32]/15">
                  Verified Client
                </span>
              </div>
            </div>

            {/* Prompt to create Provider Dashboard */}
            <div className="mt-4 pt-4 border-t border-[#123D32]/10 bg-[#FAF7F0] -mx-6 -mb-6 p-4 rounded-b-3xl">
              <span className="text-[10px] font-black text-[#123D32] uppercase tracking-wider block mb-1">
                Do you also offer services?
              </span>
              <p className="text-[11px] text-[#52635B] mb-3 leading-tight">
                List your craft or business on ClientBridge and receive direct customer WhatsApp leads.
              </p>
              <button
                onClick={() => onCreateProviderDashboard && onCreateProviderDashboard()}
                className="w-full py-2.5 rounded-xl bg-[#123D32] text-[#D5AE70] font-black text-xs hover:bg-[#1B5445] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border border-[#D5AE70]/30"
              >
                <span>Create Provider Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Recent Outreach History */}
          <div className="bg-white p-6 rounded-3xl border border-[#123D32]/10 shadow-xs">
            <h3 className="font-extrabold text-[#123D32] text-sm mb-4 flex items-center gap-2 pb-2 border-b border-[#123D32]/10">
              <MessageCircle className="w-4 h-4 text-[#123D32]" />
              <span>Recent WhatsApp Outreach</span>
            </h3>

            {contactHistory.length === 0 ? (
              <p className="text-xs text-[#52635B]">
                No recent WhatsApp inquiries recorded. When you tap "WhatsApp" on any profile, it will be logged here for quick reference.
              </p>
            ) : (
              <div className="space-y-3">
                {contactHistory.slice(0, 5).map(item => (
                  <div key={item.id} className="p-3.5 bg-[#FAF7F0] rounded-2xl border border-[#123D32]/10 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#26332D]">{item.proName}</span>
                      <span className="text-[10px] text-[#D5AE70] font-black">{item.date}</span>
                    </div>
                    <div className="text-[#52635B] text-[11px] leading-tight">
                      Service: <span className="font-semibold text-[#26332D]">{item.service}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
};
