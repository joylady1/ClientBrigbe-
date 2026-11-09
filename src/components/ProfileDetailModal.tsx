import React, { useState } from 'react';
import { Professional, Review, UserSession } from '../types';
import { formatNaira } from '../utils/auth';
import { 
  X, CheckCircle2, MapPin, Star, Heart, MessageCircle, 
  Share2, Briefcase, Award, Shield, Check, Clock 
} from 'lucide-react';

interface ProfileDetailModalProps {
  pro: Professional;
  currentUser: UserSession | null;
  onClose: () => void;
  onContactWhatsApp: (pro: Professional, serviceName?: string) => void;
  reviews: Review[];
  onAddReview: (proId: string, rating: number, comment: string, author?: string) => void;
  isSaved: boolean;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  showToast: (text: string) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  pro,
  currentUser,
  onClose,
  onContactWhatsApp,
  reviews,
  onAddReview,
  isSaved,
  onToggleFavorite,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'portfolio' | 'reviews'>('services');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState(currentUser ? currentUser.name : '');
  const [activeImageZoom, setActiveImageZoom] = useState<string | null>(null);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    onAddReview(pro.id, newReviewRating, newReviewText.trim(), reviewerName.trim() || undefined);
    setNewReviewText('');
    showToast('Your verified review was published!');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Lightbox zoomed image */}
      {activeImageZoom && (
        <div 
          onClick={() => setActiveImageZoom(null)}
          className="fixed inset-0 z-60 bg-black/90 p-4 flex items-center justify-center cursor-zoom-out"
        >
          <img 
            src={activeImageZoom} 
            alt="Enlarged project" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" 
          />
        </div>
      )}

      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#D5AE70]/40 my-6 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Banner */}
        <div className="bg-[#123D32] text-white p-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-[#1B5445] text-[#D5AE70] flex items-center justify-center hover:bg-[#D5AE70] hover:text-[#123D32] transition"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1B5445] text-[#D5AE70] flex items-center justify-center hover:bg-[#D5AE70] hover:text-[#123D32] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 font-bold" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img 
                src={pro.avatar} 
                alt={pro.name} 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D5AE70] shadow-md"
              />
              {pro.verified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                  <CheckCircle2 className="w-4 h-4 text-[#123D32] fill-[#D5AE70]" />
                </div>
              )}
            </div>

            <div className="space-y-1 pr-16 sm:pr-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-[#FAF7F0]">{pro.name}</h2>
                <span className="text-[10px] font-extrabold bg-[#D5AE70] text-[#123D32] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Verified Pro
                </span>
              </div>
              <p className="text-xs text-[#D5AE70] font-bold">{pro.businessName}</p>
              <p className="text-xs text-[#FAF7F0]/80 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D5AE70]" />
                <span>{pro.city}, {pro.state} State, Nigeria</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-5 pt-4 border-t border-[#D5AE70]/20 grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-[#FAF7F0]/70 block text-[10px] uppercase">Rating</span>
              <span className="text-[#D5AE70] font-black text-sm flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-[#D5AE70]" />
                {pro.rating.toFixed(1)}
                <span className="text-[10px] text-white/70">({pro.reviewsCount})</span>
              </span>
            </div>

            <div>
              <span className="text-[#FAF7F0]/70 block text-[10px] uppercase">Starting Rate</span>
              <span className="text-[#D5AE70] font-black text-sm block mt-0.5">
                {formatNaira(pro.startingPrice)}
              </span>
            </div>

            <div>
              <span className="text-[#FAF7F0]/70 block text-[10px] uppercase">Response Time</span>
              <span className="text-white font-bold text-xs flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-[#D5AE70]" />
                {pro.responseTime || 'Under 1 hr'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-[#123D32]/10 bg-[#FAF7F0] text-xs font-bold text-[#26332D]">
          <button 
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
              activeTab === 'services' 
                ? 'border-[#123D32] text-[#123D32] bg-white font-extrabold' 
                : 'border-transparent text-[#52635B] hover:text-[#123D32]'
            }`}
          >
            Services & Pricing
          </button>
          
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
              activeTab === 'portfolio' 
                ? 'border-[#123D32] text-[#123D32] bg-white font-extrabold' 
                : 'border-transparent text-[#52635B] hover:text-[#123D32]'
            }`}
          >
            Portfolio ({pro.portfolio ? pro.portfolio.length : 0})
          </button>
          
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-center border-b-2 transition cursor-pointer ${
              activeTab === 'reviews' 
                ? 'border-[#123D32] text-[#123D32] bg-white font-extrabold' 
                : 'border-transparent text-[#52635B] hover:text-[#123D32]'
            }`}
          >
            Client Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* TAB 1: SERVICES & PRICING */}
          {activeTab === 'services' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-extrabold text-[#123D32] text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#D5AE70]" />
                  <span>About This Professional</span>
                </h4>
                <p className="text-[#52635B] leading-relaxed text-xs sm:text-sm bg-[#FAF7F0] p-4 rounded-2xl border border-[#123D32]/10">
                  {pro.bio}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-extrabold text-[#123D32] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[#D5AE70]" />
                    <span>Package Menu & Rates (₦ Naira)</span>
                  </h4>
                  <span className="text-[10px] text-[#7B8C85]">Tap any package to inquire on WhatsApp</span>
                </div>

                <div className="space-y-2.5">
                  {pro.servicesList && pro.servicesList.map((svc, i) => {
                    const parts = svc.split(' - ');
                    const svcTitle = parts[0] || svc;
                    const svcPrice = parts[1] || 'Custom Quote';
                    return (
                      <div 
                        key={i} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#123D32]/10 hover:border-[#D5AE70] transition gap-2"
                      >
                        <div>
                          <span className="font-bold text-[#26332D] text-xs sm:text-sm block">{svcTitle}</span>
                          <span className="text-[11px] text-[#52635B] flex items-center gap-1 mt-0.5">
                            <Check className="w-3 h-3 text-[#123D32]" />
                            Direct consultation & milestones included
                          </span>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className="font-black text-[#123D32] text-sm sm:text-base">{svcPrice}</span>
                          <button
                            onClick={() => onContactWhatsApp(pro, svcTitle)}
                            className="bg-[#123D32] hover:bg-[#1B5445] text-[#D5AE70] text-[11px] font-bold px-3 py-1.5 rounded-xl border border-[#D5AE70]/40 flex items-center gap-1 transition"
                          >
                            <MessageCircle className="w-3 h-3 fill-current" />
                            <span>Inquire</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verified Trust Guarantees */}
              <div className="p-4 rounded-2xl bg-[#123D32]/5 border border-[#123D32]/10 space-y-2">
                <span className="font-bold text-xs text-[#123D32] block">ClientBridge Safety Pledges:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#52635B]">
                  <span className="flex items-center gap-1">✓ No hidden platform commissions</span>
                  <span className="flex items-center gap-1">✓ Verified Nigerian contact credentials</span>
                  <span className="flex items-center gap-1">✓ Direct milestone discussions</span>
                  <span className="flex items-center gap-1">✓ Real portfolio inspection</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO GALLERY */}
          {activeTab === 'portfolio' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-extrabold text-[#123D32] text-xs uppercase tracking-wider">
                  Verified Works & Case Studies
                </h4>
                <span className="text-[10px] text-[#7B8C85]">Click any image to enlarge</span>
              </div>

              {pro.portfolio && pro.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pro.portfolio.map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setActiveImageZoom(imgUrl)}
                      className="group relative rounded-2xl overflow-hidden border border-[#123D32]/15 shadow-xs cursor-pointer aspect-video bg-stone-100"
                    >
                      <img 
                        src={imgUrl} 
                        alt={`${pro.name} project ${idx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                        <span>Click to Enlarge 🔍</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-[#FAF7F0] rounded-2xl border border-[#123D32]/10">
                  <p className="text-xs text-[#52635B]">This professional hasn't uploaded portfolio samples yet.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REVIEWS & FEEDBACK */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Review submission form */}
              <form onSubmit={handleReviewSubmit} className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#123D32]/15 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-[#123D32] text-xs uppercase tracking-wider">
                    Leave a Verified Client Review
                  </h4>
                  <span className="text-[10px] text-[#7B8C85]">Honest feedback helps good artisans grow</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#26332D] block mb-1">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bukola from Ikeja"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-white font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#26332D] block mb-1">Rating</label>
                    <select 
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full p-2.5 text-xs rounded-xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-white font-bold text-[#123D32]"
                    >
                      <option value="5">★★★★★ (5 Stars - Exceptional Service)</option>
                      <option value="4">★★★★☆ (4 Stars - Great Service)</option>
                      <option value="3">★★★☆☆ (3 Stars - Fair Experience)</option>
                      <option value="2">★★☆☆☆ (2 Stars - Needs Improvement)</option>
                      <option value="1">★☆☆☆☆ (1 Star - Unsatisfactory)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#26332D] block mb-1">Your Experience / Feedback</label>
                  <textarea 
                    placeholder="Describe how the project was handled, timeliness, quality, and communication..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-white font-medium"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-[#123D32] text-[#D5AE70] font-bold text-xs rounded-xl border border-[#D5AE70]/40 hover:bg-[#1B5445] transition cursor-pointer"
                >
                  Submit Verified Review
                </button>
              </form>

              {/* Review items */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs text-[#52635B] text-center p-6 bg-[#FAF7F0] rounded-2xl">
                    No reviews yet. Be the first to share your experience with this professional!
                  </p>
                ) : (
                  reviews.map(rev => (
                    <div key={rev.id} className="p-4 bg-white rounded-2xl border border-[#123D32]/10 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[#26332D]">{rev.author}</span>
                          {rev.verifiedHire && (
                            <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                              Verified Hire
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-[#D5AE70]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#D5AE70] text-[#D5AE70]' : 'text-stone-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#52635B] text-xs leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-[#7B8C85] block pt-1">{rev.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="p-4 bg-[#F7F1E5] border-t border-[#123D32]/10 flex items-center justify-between gap-3">
          <button 
            onClick={(e) => onToggleFavorite(pro.id, e)}
            className="px-4 py-3 rounded-2xl border border-[#123D32]/20 hover:bg-white text-[#26332D] transition flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'text-rose-500 fill-rose-500' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Bookmark Pro'}</span>
          </button>

          <button 
            onClick={() => onContactWhatsApp(pro)}
            className="flex-1 py-3.5 rounded-2xl bg-[#123D32] hover:bg-[#1B5445] text-[#D5AE70] font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg border border-[#D5AE70]/40 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Connect on WhatsApp (+234 Direct)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
