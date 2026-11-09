import React from 'react';
import { Professional } from '../types';
import { formatNaira } from '../utils/auth';
import { MapPin, Star, Heart, CheckCircle2, MessageCircle } from 'lucide-react';

interface ProfessionalCardProps {
  pro: Professional;
  isSaved: boolean;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onOpenModal: (pro: Professional) => void;
  onContactWhatsApp: (pro: Professional, serviceName?: string) => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  pro,
  isSaved,
  onToggleFavorite,
  onOpenModal,
  onContactWhatsApp
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#123D32]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      
      {/* Top Header */}
      <div className="p-5 flex items-start gap-4 pb-3">
        <div className="relative shrink-0">
          <img 
            src={pro.avatar} 
            alt={pro.name} 
            loading="lazy"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D5AE70]/40 shadow-sm group-hover:scale-102 transition-transform"
          />
          {pro.verified && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md" title="ClientBridge Verified">
              <CheckCircle2 className="w-4 h-4 text-[#123D32] fill-[#D5AE70]" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold text-[#123D32] uppercase tracking-wider bg-[#FAF7F0] px-2.5 py-1 rounded-lg border border-[#123D32]/10 truncate">
              {pro.categoryLabel}
            </span>
            <button 
              onClick={(e) => onToggleFavorite(pro.id, e)}
              aria-label={isSaved ? "Remove from bookmarks" : "Bookmark this professional"}
              className="p-1.5 rounded-full hover:bg-[#F7F1E5] transition text-[#52635B] hover:text-rose-500 cursor-pointer"
            >
              <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
          </div>

          <h3 
            onClick={() => onOpenModal(pro)}
            className="text-base font-extrabold text-[#26332D] truncate mt-1.5 hover:text-[#123D32] cursor-pointer"
          >
            {pro.name}
          </h3>
          <p className="text-xs text-[#52635B] truncate font-semibold">{pro.businessName}</p>

          <div className="flex items-center gap-1 text-[11px] text-[#52635B] mt-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#123D32] shrink-0" />
            <span className="truncate">{pro.city}, {pro.state}</span>
          </div>
        </div>
      </div>

      {/* Bio snippet */}
      <div className="px-5 py-2 flex-1">
        <p className="text-xs text-[#52635B] line-clamp-2 leading-relaxed">
          {pro.bio}
        </p>
        {pro.badges && pro.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {pro.badges.slice(0, 2).map((badge, i) => (
              <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#123D32]/5 text-[#123D32]">
                {badge}
              </span>
            ))}
            {pro.responseTime && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#D5AE70]/20 text-[#123D32]">
                ⚡ {pro.responseTime}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Pricing & Ratings strip */}
      <div className="px-5 py-3 border-t border-[#123D32]/10 flex items-center justify-between text-xs bg-[#FAF7F0]">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center text-[#D5AE70]">
            <Star className="w-3.5 h-3.5 fill-[#D5AE70] text-[#D5AE70]" />
          </div>
          <span className="font-extrabold text-[#26332D]">{pro.rating.toFixed(1)}</span>
          <span className="text-[#7B8C85] text-[11px]">({pro.reviewsCount} reviews)</span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[#7B8C85] uppercase tracking-wider block font-medium">Starting from</span>
          <span className="font-black text-sm text-[#123D32] tracking-tight">{formatNaira(pro.startingPrice)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 pt-2.5 grid grid-cols-2 gap-2 bg-white">
        <button 
          onClick={() => onOpenModal(pro)}
          className="w-full py-2.5 rounded-xl border border-[#123D32]/30 text-[#123D32] hover:bg-[#123D32]/10 font-bold text-xs transition cursor-pointer text-center"
        >
          View Profile
        </button>
        
        <button 
          onClick={() => onContactWhatsApp(pro)}
          className="w-full py-2.5 rounded-xl bg-[#123D32] hover:bg-[#1B5445] text-[#D5AE70] font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm border border-[#D5AE70]/40 cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>WhatsApp</span>
        </button>
      </div>

    </div>
  );
};
