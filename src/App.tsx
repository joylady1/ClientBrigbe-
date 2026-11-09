import React, { useState, useEffect, useMemo } from 'react';
import { 
  Professional, Review, UserSession, InquiryHistoryItem, ViewType 
} from './types';
import { 
  INITIAL_PROFESSIONALS, INITIAL_REVIEWS, 
  SERVICE_CATEGORIES, NIGERIAN_STATES 
} from './data/seedData';
import { getStoredSession, createWhatsAppUrl } from './utils/auth';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { ProfessionalCard } from './components/ProfessionalCard';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { AuthModal } from './components/AuthModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ProviderDashboard } from './components/ProviderDashboard';
import { QuoteCalculatorModal } from './components/QuoteCalculatorModal';
import { Toast } from './components/Toast';

import { 
  Search, MapPin, Star, ShieldCheck, MessageCircle, 
  Sparkles, ArrowRight, CheckCircle2, ChevronRight, 
  Layers, Users, Award, Zap, Heart 
} from 'lucide-react';

export default function App() {
  // Session hydration
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => getStoredSession());
  
  // View hydration
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    try {
      const saved = localStorage.getItem('cb_current_view') as ViewType | null;
      if (saved) {
        return saved;
      }
    } catch {
      // fallback
    }
    const session = getStoredSession();
    if (session) {
      return session.role === 'provider' ? 'provider-dashboard' : 'customer-dashboard';
    }
    return 'home';
  });

  // Professionals data
  const [professionals, setProfessionals] = useState<Professional[]>(() => {
    try {
      const raw = localStorage.getItem('cb_professionals');
      return raw ? JSON.parse(raw) : INITIAL_PROFESSIONALS;
    } catch {
      return INITIAL_PROFESSIONALS;
    }
  });

  // Reviews data
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const raw = localStorage.getItem('cb_reviews');
      return raw ? JSON.parse(raw) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Saved / Bookmarks
  const [savedPros, setSavedPros] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('cb_saved_pros');
      return raw ? JSON.parse(raw) : ['pro-1', 'pro-3'];
    } catch {
      return ['pro-1', 'pro-3'];
    }
  });

  // Inquiries Outreach History
  const [contactHistory, setContactHistory] = useState<InquiryHistoryItem[]>(() => {
    try {
      const raw = localStorage.getItem('cb_inquiries');
      return raw ? JSON.parse(raw) : [
        { 
          id: 'inq-seed-1', 
          proName: "Babajide 'Jay' Adeleke", 
          date: 'Yesterday, 3:15 PM', 
          service: 'Brand Identity & Logo Guide' 
        }
      ];
    } catch {
      return [];
    }
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('All Nigeria');
  const [minRating, setMinRating] = useState(0);

  // Modals & Feedback
  const [activeProModal, setActiveProModal] = useState<Professional | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<'customer' | 'provider'>('customer');
  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
  };

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    try {
      localStorage.setItem('cb_current_view', view);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('cb_professionals', JSON.stringify(professionals));
  }, [professionals]);

  useEffect(() => {
    localStorage.setItem('cb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('cb_saved_pros', JSON.stringify(savedPros));
  }, [savedPros]);

  useEffect(() => {
    localStorage.setItem('cb_inquiries', JSON.stringify(contactHistory));
  }, [contactHistory]);

  // Filter computation
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(pro => {
      const matchQuery =
        !searchQuery ||
        pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pro.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === 'all' || pro.category === selectedCategory;
      const matchState = selectedState === 'All Nigeria' || pro.state === selectedState;
      const matchRating = pro.rating >= minRating;

      return matchQuery && matchCat && matchState && matchRating;
    });
  }, [professionals, searchQuery, selectedCategory, selectedState, minRating]);

  // Actions
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedPros(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(item => item !== id) : [...prev, id];
      showToast(exists ? 'Removed from bookmarks' : 'Added to your bookmarked artisans ❤️');
      return next;
    });
  };

  const handleContactWhatsApp = (pro: Professional, serviceName: string = 'your professional services') => {
    const url = createWhatsAppUrl(
      pro.phone, 
      pro.name, 
      serviceName, 
      currentUser ? currentUser.name : undefined
    );

    const newHistoryItem: InquiryHistoryItem = {
      id: `inq-${Date.now()}`,
      proName: pro.name,
      proId: pro.id,
      date: 'Just now',
      service: serviceName,
      phone: pro.phone
    };

    setContactHistory(prev => [newHistoryItem, ...prev]);
    showToast(`Opening WhatsApp chat with ${pro.name}...`);
    window.open(url, '_blank');
  };

  const handleAddReview = (proId: string, rating: number, comment: string, author?: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      proId,
      author: author || (currentUser ? currentUser.name : 'Verified Client'),
      rating: Number(rating),
      date: 'Just now',
      comment,
      verifiedHire: true
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate average pro rating
    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === proId) {
          const proReviews = updatedReviews.filter(r => r.proId === proId);
          const sum = proReviews.reduce((acc, r) => acc + r.rating, 0);
          return {
            ...p,
            rating: parseFloat((sum / proReviews.length).toFixed(1)),
            reviewsCount: proReviews.length
          };
        }
        return p;
      })
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('cb_session');
    localStorage.removeItem('cb_current_view');
    setCurrentUser(null);
    navigateTo('home');
    showToast('Signed out successfully.');
  };

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
    showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
    navigateTo(user.role === 'provider' ? 'provider-dashboard' : 'customer-dashboard');
  };

  const handleRegisterSuccess = (user: UserSession, newPro?: Professional) => {
    setCurrentUser(user);
    if (newPro) {
      setProfessionals(prev => [newPro, ...prev]);
    }
    setAuthModalOpen(false);
    showToast(`Account created! Welcome to ClientBridge, ${user.name.split(' ')[0]}.`);
    navigateTo(user.role === 'provider' ? 'provider-dashboard' : 'customer-dashboard');
  };

  const handleUpdateUserAvatar = (avatarUrl: string) => {
    if (!currentUser) return;
    const updatedUser: UserSession = {
      ...currentUser,
      avatar: avatarUrl
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('cb_session', JSON.stringify(updatedUser));
    showToast('Profile picture updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#F7F1E5] text-[#26332D] flex flex-col font-sans selection:bg-[#123D32] selection:text-[#D5AE70]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Top Navbar */}
      <Navbar 
        currentUser={currentUser}
        currentView={currentView}
        savedCount={savedPros.length}
        onNavigate={navigateTo}
        onOpenAuth={(mode, role = 'customer') => {
          setAuthInitialMode(mode);
          setAuthInitialRole(role);
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenCalculator={() => setCalculatorModalOpen(true)}
      />

      {/* VIEW: HOME */}
      {currentView === 'home' && (
        <main className="flex-1 pb-16">
          
          {/* HERO SECTION */}
          <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#123D32]/10 bg-gradient-to-b from-[#F7F1E5] via-[#FAF7F0] to-[#F7F1E5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#123D32]/10 border border-[#123D32]/20 text-[#123D32] text-xs font-black uppercase tracking-wider mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D5AE70] animate-pulse"></span>
                  <span>Nigeria's Verified Artisans & Tech Experts 🇳🇬</span>
                </div>
                
                {/* Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#123D32] tracking-tight leading-tight">
                  Find Trusted Professionals Across{' '}
                  <span className="underline decoration-[#D5AE70] decoration-4 underline-offset-8">
                    Nigeria.
                  </span>
                </h1>
                
                {/* Subtitle */}
                <p className="mt-6 text-base sm:text-xl text-[#52635B] max-w-2xl mx-auto font-normal leading-relaxed">
                  Connect with skilled people and businesses ready to bring your ideas to life. Upfront rates in Naira (₦) and direct WhatsApp booking.
                </p>

                {/* Search Bar Container */}
                <div className="mt-10 bg-white p-3 rounded-3xl shadow-xl border border-[#123D32]/15 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-3">
                  
                  {/* Keyword */}
                  <div className="flex items-center gap-3 w-full md:w-5/12 px-3 py-2 border-b md:border-b-0 md:border-r border-[#123D32]/10">
                    <Search className="w-5 h-5 text-[#123D32] shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Skill, e.g. Electrician, Web Dev, Tailor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-[#7B8C85] font-semibold"
                    />
                  </div>

                  {/* State Dropdown */}
                  <div className="flex items-center gap-2 w-full md:w-3/12 px-3 py-2 border-b md:border-b-0 md:border-r border-[#123D32]/10">
                    <MapPin className="w-4 h-4 text-[#123D32] shrink-0" />
                    <select 
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm focus:outline-none font-bold cursor-pointer text-[#26332D]"
                    >
                      {NIGERIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category Dropdown */}
                  <div className="flex items-center gap-2 w-full md:w-4/12 px-3 py-2">
                    <Layers className="w-4 h-4 text-[#123D32] shrink-0" />
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm focus:outline-none font-bold cursor-pointer text-[#26332D]"
                    >
                      {SERVICE_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Search Button */}
                  <button 
                    onClick={() => navigateTo('browse')}
                    className="w-full md:w-auto px-8 py-3.5 bg-[#123D32] hover:bg-[#1B5445] text-[#D5AE70] font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 border border-[#D5AE70]/40 cursor-pointer shrink-0"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Pills */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-[#52635B] font-semibold">
                  <span className="text-[11px] uppercase tracking-wider text-[#7B8C85]">Popular:</span>
                  {['Fashion Designers', 'Electricians & Solar', 'Web Developers', 'Bakers & Caterers', 'Photographers'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => {
                        const found = SERVICE_CATEGORIES.find(c => c.name.toLowerCase().includes(tag.toLowerCase()));
                        if (found) setSelectedCategory(found.id);
                        navigateTo('browse');
                      }}
                      className="bg-[#EDE3D1]/80 hover:bg-[#123D32] hover:text-[#D5AE70] px-3.5 py-1 rounded-full transition-colors font-bold text-xs cursor-pointer shadow-2xs"
                    >
                      {tag}
                    </button>
                  ))}
                  <button
                    onClick={() => setCalculatorModalOpen(true)}
                    className="bg-[#D5AE70]/25 hover:bg-[#D5AE70] hover:text-[#123D32] text-[#123D32] px-3 py-1 rounded-full transition font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Price Calculator</span>
                  </button>
                </div>

              </div>
            </div>
          </section>

          {/* DEDICATED SECTION: CREATE YOUR DASHBOARD */}
          <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#123D32] to-[#1B5445] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-[#D5AE70]/30 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="max-w-xl space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D5AE70] text-[#123D32] text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Get Started Today</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#F7F1E5]">
                    Where to Create Your Dashboard
                  </h2>
                  <p className="text-xs sm:text-sm text-[#FAF7F0]/80 leading-relaxed font-medium">
                    Whether you are a skilled Nigerian artisan ready to receive WhatsApp clients, or an individual/business looking to hire vetted professionals — create your dashboard in 2 minutes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 shrink-0 w-full lg:w-auto">
                  <button
                    onClick={() => {
                      setAuthInitialMode('register');
                      setAuthInitialRole('provider');
                      setAuthModalOpen(true);
                    }}
                    className="bg-[#D5AE70] hover:bg-[#C49B5B] text-[#123D32] p-4 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-between gap-4 text-left group cursor-pointer"
                  >
                    <div>
                      <span className="block text-[10px] text-[#123D32]/70 font-bold uppercase tracking-wider">For Artisans & Pros</span>
                      <span className="text-sm font-black text-[#123D32]">Create Provider Dashboard</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#123D32] group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  <button
                    onClick={() => {
                      setAuthInitialMode('register');
                      setAuthInitialRole('customer');
                      setAuthModalOpen(true);
                    }}
                    className="bg-white hover:bg-[#FAF7F0] text-[#123D32] p-4 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-between gap-4 text-left group cursor-pointer border border-[#D5AE70]/40"
                  >
                    <div>
                      <span className="block text-[10px] text-[#52635B] font-bold uppercase tracking-wider">For Clients Hiring</span>
                      <span className="text-sm font-black text-[#123D32]">Create Client Dashboard</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#123D32] group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* VERIFIED CATEGORIES GRID */}
          <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#123D32]">
                  Explore Verified Categories
                </h2>
                <p className="text-[#52635B] text-xs sm:text-sm mt-1">
                  From certified artisans to high-growth digital professionals across all 36 Nigerian states.
                </p>
              </div>
              <button 
                onClick={() => { setSelectedCategory('all'); navigateTo('browse'); }}
                className="text-[#123D32] font-extrabold text-xs sm:text-sm hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>View All 15 Categories</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {SERVICE_CATEGORIES.slice(1).map(cat => (
                <div 
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    navigateTo('browse');
                  }}
                  className="bg-white p-5 rounded-3xl border border-[#123D32]/10 hover:border-[#D5AE70] hover:shadow-xl transition-all duration-300 cursor-pointer group text-center flex flex-col items-center justify-between"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#F7F1E5] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform mb-3 shadow-2xs border border-[#123D32]/5">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-[#26332D] group-hover:text-[#123D32] transition-colors leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-[#7B8C85] mt-1 font-medium">
                      Nationwide Coverage
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SPOTLIGHT FEATURED SECTION */}
          <section className="py-16 bg-[#FAF7F0] border-y border-[#123D32]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
                <div>
                  <div className="text-[#D5AE70] font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Spotlight of the Week</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#123D32]">
                    Featured Nigerian Service Providers
                  </h2>
                  <p className="text-[#52635B] text-xs sm:text-sm mt-1">
                    Background-checked, highly-rated, and ready to deploy for your projects.
                  </p>
                </div>
                <button 
                  onClick={() => navigateTo('browse')}
                  className="bg-[#123D32] text-[#D5AE70] text-xs font-black px-5 py-3 rounded-2xl border border-[#D5AE70]/40 hover:bg-[#1B5445] transition cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <span>Browse All {professionals.length} Professionals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professionals.slice(0, 3).map(pro => (
                  <ProfessionalCard 
                    key={pro.id} 
                    pro={pro}
                    isSaved={savedPros.includes(pro.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpenModal={() => setActiveProModal(pro)}
                    onContactWhatsApp={handleContactWhatsApp}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-black text-[#D5AE70] uppercase tracking-widest block mb-1">
                Straightforward & Transparent
              </span>
              <h2 className="text-3xl font-black text-[#123D32]">
                How ClientBridge Works
              </h2>
              <p className="text-[#52635B] mt-2 text-sm sm:text-base">
                Connecting Nigerian ambition with verified skill in three hassle-free steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-[#123D32]/10 shadow-sm relative space-y-3">
                <div className="w-12 h-12 bg-[#123D32] text-[#D5AE70] font-black text-xl rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-[#26332D]">
                  Search & Filter in Naira
                </h3>
                <p className="text-xs sm:text-sm text-[#52635B] leading-relaxed">
                  Select your state across Nigeria, filter by category or minimum rating, and review authentic portfolios with pricing stated upfront in Nigerian Naira (₦).
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-[#D5AE70]/40 shadow-sm relative space-y-3">
                <div className="w-12 h-12 bg-[#D5AE70] text-[#123D32] font-black text-xl rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-[#26332D]">
                  Direct WhatsApp Connection
                </h3>
                <p className="text-xs sm:text-sm text-[#52635B] leading-relaxed">
                  Tap "WhatsApp" to immediately start a direct conversation with the artisan or professional. Share voice notes, pictures, and agree on milestones without platform delays.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-[#123D32]/10 shadow-sm relative space-y-3">
                <div className="w-12 h-12 bg-[#123D32] text-[#D5AE70] font-black text-xl rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-[#26332D]">
                  Get Results & Leave Reviews
                </h3>
                <p className="text-xs sm:text-sm text-[#52635B] leading-relaxed">
                  Inspect the completed job, pay directly according to your agreed terms, and leave a verified review to help reputable Nigerian professionals build their name.
                </p>
              </div>
            </div>
          </section>

          {/* SOCIAL PROOF / TESTIMONIALS */}
          <section className="py-16 bg-[#123D32] text-white rounded-3xl mx-4 sm:mx-8 px-6 sm:px-12 my-10 shadow-2xl">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#D5AE70] uppercase tracking-widest text-xs font-black">
                  Nigerian Client Testimonials
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2 text-[#F7F1E5]">
                  Loved by Businesses in Lagos, Abuja & Beyond
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#1B5445]/60 p-6 rounded-2xl border border-[#D5AE70]/20 backdrop-blur-sm space-y-4">
                  <div className="flex text-[#D5AE70] gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D5AE70]" />
                    ))}
                  </div>
                  <p className="italic text-xs sm:text-sm text-[#FAF7F0]/90 leading-relaxed">
                    "Finding a vetted electrician in Gwarinpa used to mean asking three different gatekeepers. Found Engr Nura on ClientBridge, and our solar inverter was sorted the same afternoon. No stories, clean work!"
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-[#D5AE70] text-[#123D32] font-black flex items-center justify-center text-sm">
                      DA
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-[#F7F1E5]">Dr. Aliyu Danjuma</p>
                      <p className="text-[11px] text-[#FAF7F0]/70">Homeowner, Abuja FCT</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1B5445]/60 p-6 rounded-2xl border border-[#D5AE70]/20 backdrop-blur-sm space-y-4">
                  <div className="flex text-[#D5AE70] gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D5AE70]" />
                    ))}
                  </div>
                  <p className="italic text-xs sm:text-sm text-[#FAF7F0]/90 leading-relaxed">
                    "As a startup founder in Yaba, I urgently needed custom packaging and brand assets for our product rollout. Jay delivered high-res mockups within 48 hours. The WhatsApp direct integration is brilliant."
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-[#D5AE70] text-[#123D32] font-black flex items-center justify-center text-sm">
                      TO
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-[#F7F1E5]">Tunde Ogunleye</p>
                      <p className="text-[11px] text-[#FAF7F0]/70">Product Lead, Lagos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider Call to Action Banner */}
              <div className="mt-14 pt-10 border-t border-[#D5AE70]/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#F7F1E5]">
                    Are You a Skilled Nigerian Artisan or Professional?
                  </h3>
                  <p className="text-[#FAF7F0]/70 text-xs sm:text-sm mt-1 max-w-xl">
                    Your skills deserve customers. Create your digital profile and start receiving verified WhatsApp inquiries today.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setAuthInitialMode('register');
                    setAuthInitialRole('provider');
                    setAuthModalOpen(true);
                  }}
                  className="bg-[#D5AE70] hover:bg-[#C49B5B] text-[#123D32] font-black px-7 py-3.5 rounded-2xl shadow-xl transition-transform active:scale-95 whitespace-nowrap cursor-pointer text-xs sm:text-sm"
                >
                  Join as a Provider
                </button>
              </div>

            </div>
          </section>

        </main>
      )}

      {/* VIEW: BROWSE MARKETPLACE */}
      {currentView === 'browse' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#123D32]">
                Browse Nigerian Service Providers
              </h1>
              <p className="text-xs sm:text-sm text-[#52635B] mt-1 font-medium">
                Showing {filteredProfessionals.length} available verified professionals across Nigeria
              </p>
            </div>

            {(selectedCategory !== 'all' || selectedState !== 'All Nigeria' || searchQuery || minRating > 0) && (
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedState('All Nigeria');
                  setSearchQuery('');
                  setMinRating(0);
                }}
                className="text-xs font-bold text-[#123D32] underline hover:text-[#1B5445] self-start md:self-auto cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-[#123D32]/10 shadow-xs space-y-4">
                <h3 className="font-black text-xs text-[#123D32] uppercase tracking-wider">
                  Filter by Keyword
                </h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. Graphic, Tailor, Solar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#123D32]/20 focus:border-[#123D32] focus:outline-none bg-[#FAF7F0] font-semibold"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-3 text-[#7B8C85] text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#26332D] block mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#123D32]" />
                    <span>State (Nigeria)</span>
                  </label>
                  <select 
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#123D32]/20 focus:border-[#123D32] focus:outline-none bg-[#FAF7F0] font-bold cursor-pointer text-[#26332D]"
                  >
                    {NIGERIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#26332D] block mb-1.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#D5AE70]" />
                    <span>Minimum Rating</span>
                  </label>
                  <div className="flex gap-2">
                    {[0, 4.0, 4.5, 4.8].map(r => (
                      <button
                        key={r}
                        onClick={() => setMinRating(r)}
                        className={`flex-1 py-2 text-xs rounded-xl font-bold border transition cursor-pointer ${
                          minRating === r 
                            ? 'bg-[#123D32] text-[#D5AE70] border-[#123D32]' 
                            : 'bg-[#FAF7F0] text-[#26332D] border-[#123D32]/10 hover:border-[#D5AE70]'
                        }`}
                      >
                        {r === 0 ? 'Any' : `${r}★`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#123D32]/10">
                  <button
                    onClick={() => setCalculatorModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#EDE3D1] text-[#123D32] font-black text-xs border border-[#123D32]/20 flex items-center justify-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D5AE70]" />
                    <span>Calculate Market Rates</span>
                  </button>
                </div>
              </div>

              {/* Categories Sidebar List */}
              <div className="bg-white p-5 rounded-3xl border border-[#123D32]/10 shadow-xs">
                <h3 className="font-black text-xs text-[#123D32] uppercase tracking-wider mb-3">
                  Service Categories
                </h3>
                <div className="space-y-1 max-h-80 overflow-y-auto pr-1 no-scrollbar">
                  {SERVICE_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        selectedCategory === cat.id 
                          ? 'bg-[#123D32] text-[#D5AE70] shadow-sm' 
                          : 'text-[#26332D] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3">
              {filteredProfessionals.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-[#123D32]/10 shadow-sm space-y-4">
                  <div className="w-14 h-14 bg-[#F7F1E5] rounded-2xl flex items-center justify-center text-3xl mx-auto">
                    🔍
                  </div>
                  <h3 className="text-lg font-black text-[#123D32]">
                    No Nigerian Professionals Found
                  </h3>
                  <p className="text-xs text-[#52635B] max-w-md mx-auto leading-relaxed">
                    We could not find active profiles matching your filters in {selectedState}. Try resetting your search query or picking another Nigerian state.
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedState('All Nigeria');
                      setSearchQuery('');
                      setMinRating(0);
                    }}
                    className="px-6 py-3 bg-[#123D32] text-[#D5AE70] font-black text-xs rounded-xl border border-[#D5AE70]/30 hover:bg-[#1B5445] transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProfessionals.map(pro => (
                    <ProfessionalCard 
                      key={pro.id} 
                      pro={pro}
                      isSaved={savedPros.includes(pro.id)}
                      onToggleFavorite={toggleFavorite}
                      onOpenModal={() => setActiveProModal(pro)}
                      onContactWhatsApp={handleContactWhatsApp}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      )}

      {/* VIEW: CUSTOMER DASHBOARD */}
      {currentView === 'customer-dashboard' && currentUser && (
        <CustomerDashboard 
          currentUser={currentUser}
          savedPros={savedPros}
          professionals={professionals}
          contactHistory={contactHistory}
          reviews={reviews}
          onNavigate={navigateTo}
          onOpenModal={(pro) => setActiveProModal(pro)}
          onContactWhatsApp={handleContactWhatsApp}
          onToggleFavorite={toggleFavorite}
          onCreateProviderDashboard={() => {
            setAuthInitialMode('register');
            setAuthInitialRole('provider');
            setAuthModalOpen(true);
          }}
          onUpdateAvatar={handleUpdateUserAvatar}
        />
      )}

      {/* VIEW: PROVIDER DASHBOARD */}
      {currentView === 'provider-dashboard' && currentUser && (
        <ProviderDashboard 
          currentUser={currentUser}
          professionals={professionals}
          setProfessionals={setProfessionals}
          onBack={() => navigateTo('home')}
          onPreview={(pro) => setActiveProModal(pro)}
          showToast={showToast}
        />
      )}

      {/* UNLOGGED IN FALLBACK FOR DASHBOARDS */}
      {(currentView === 'customer-dashboard' || currentView === 'provider-dashboard') && !currentUser && (
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#123D32]/10 shadow-lg space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#123D32] text-[#D5AE70] font-black text-2xl flex items-center justify-center mx-auto shadow-md">
              CB
            </div>
            <h2 className="text-2xl font-black text-[#123D32]">
              Create or Access Your Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#52635B] leading-relaxed">
              You need an active account to view this dashboard. Create a Provider or Client dashboard in under two minutes, or sign in to your existing account.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setAuthInitialMode('register');
                  setAuthInitialRole(currentView === 'provider-dashboard' ? 'provider' : 'customer');
                  setAuthModalOpen(true);
                }}
                className="px-6 py-3 bg-[#123D32] text-[#D5AE70] font-black text-xs sm:text-sm rounded-xl border border-[#D5AE70]/40 hover:bg-[#1B5445] transition cursor-pointer shadow-md"
              >
                Create My Dashboard
              </button>
              <button
                onClick={() => {
                  setAuthInitialMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-6 py-3 bg-[#FAF7F0] text-[#123D32] font-black text-xs sm:text-sm rounded-xl border border-[#123D32]/20 hover:bg-[#EDE3D1] transition cursor-pointer"
              >
                Sign In to Existing
              </button>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: SAVED FAVORITES & INQUIRY HISTORY */}
      {currentView === 'saved' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-200">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#123D32]">Saved & Outreach History</h1>
            <p className="text-xs sm:text-sm text-[#52635B] mt-1 font-medium">
              Manage your bookmarked artisans and your direct WhatsApp interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Bookmarks */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-lg font-black text-[#123D32] flex items-center gap-2">
                <span>Bookmarked Artisans</span>
                <span className="text-xs bg-[#123D32] text-[#D5AE70] px-2.5 py-0.5 rounded-full font-bold">
                  {savedPros.length}
                </span>
              </h2>

              {savedPros.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl text-center border border-[#123D32]/10 space-y-2">
                  <p className="text-xs sm:text-sm text-[#52635B]">
                    You have not bookmarked any professionals yet.
                  </p>
                  <button 
                    onClick={() => navigateTo('browse')} 
                    className="text-xs font-black text-[#123D32] underline hover:text-[#1B5445] cursor-pointer"
                  >
                    Start exploring verified professionals
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {professionals.filter(p => savedPros.includes(p.id)).map(pro => (
                    <ProfessionalCard 
                      key={pro.id} 
                      pro={pro}
                      isSaved={true}
                      onToggleFavorite={toggleFavorite}
                      onOpenModal={() => setActiveProModal(pro)}
                      onContactWhatsApp={handleContactWhatsApp}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Inquiries */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl border border-[#123D32]/10 shadow-xs space-y-4">
                <h3 className="font-extrabold text-[#123D32] text-sm flex items-center gap-2 pb-2 border-b border-[#123D32]/10">
                  <MessageCircle className="w-4 h-4 text-[#123D32]" />
                  <span>Recent WhatsApp Outreach</span>
                </h3>

                {contactHistory.length === 0 ? (
                  <p className="text-xs text-[#52635B]">
                    No inquiries recorded yet. When you reach out to an artisan via WhatsApp, it gets logged here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {contactHistory.map(item => (
                      <div key={item.id} className="p-3.5 bg-[#FAF7F0] rounded-2xl border border-[#123D32]/10 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[#26332D]">{item.proName}</span>
                          <span className="text-[10px] text-[#D5AE70] font-black">{item.date}</span>
                        </div>
                        <div className="text-[#52635B] text-[11px]">
                          Service: <span className="font-bold text-[#26332D]">{item.service}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      )}

      {/* Footer */}
      <Footer 
        onSelectState={(st) => {
          setSelectedState(st);
          navigateTo('browse');
        }}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          navigateTo('browse');
        }}
      />

      {/* Mobile Navigation */}
      <MobileNav 
        currentView={currentView}
        currentUser={currentUser}
        savedCount={savedPros.length}
        onNavigate={navigateTo}
        onOpenAuth={(mode) => {
          setAuthInitialMode(mode);
          setAuthModalOpen(true);
        }}
      />

      {/* MODAL: PROFILE DETAIL */}
      {activeProModal && (
        <ProfileDetailModal 
          pro={activeProModal} 
          currentUser={currentUser}
          onClose={() => setActiveProModal(null)}
          onContactWhatsApp={handleContactWhatsApp}
          reviews={reviews.filter(r => r.proId === activeProModal.id)}
          onAddReview={handleAddReview}
          isSaved={savedPros.includes(activeProModal.id)}
          onToggleFavorite={toggleFavorite}
          showToast={showToast}
        />
      )}

      {/* MODAL: AUTHENTICATION */}
      {authModalOpen && (
        <AuthModal 
          initialMode={authInitialMode}
          initialRole={authInitialRole}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {/* MODAL: QUOTE CALCULATOR */}
      {calculatorModalOpen && (
        <QuoteCalculatorModal 
          onClose={() => setCalculatorModalOpen(false)}
          onApplyFilter={(catId) => {
            setSelectedCategory(catId);
            navigateTo('browse');
          }}
        />
      )}

    </div>
  );
}
