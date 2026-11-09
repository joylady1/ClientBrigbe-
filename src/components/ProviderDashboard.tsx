import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserSession, Professional } from '../types';
import { NIGERIAN_STATES, SERVICE_CATEGORIES } from '../data/seedData';
import { processImageFile, AVATAR_PRESETS, PORTFOLIO_PRESETS } from '../utils/imageUpload';
import { 
  ShieldCheck, ArrowLeft, Eye, MessageCircle, Star, 
  Plus, Trash2, CheckCircle2, Briefcase, Camera, 
  Upload, Image as ImageIcon, Link as LinkIcon, X, ZoomIn 
} from 'lucide-react';

interface ProviderDashboardProps {
  currentUser: UserSession;
  professionals: Professional[];
  setProfessionals: React.Dispatch<React.SetStateAction<Professional[]>>;
  onBack: () => void;
  onPreview: (pro: Professional) => void;
  showToast: (text: string) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  currentUser,
  professionals,
  setProfessionals,
  onBack,
  onPreview,
  showToast
}) => {
  const myProfile = useMemo(() => {
    return (
      professionals.find(p => p.id === currentUser.proId || p.userId === currentUser.id) ||
      professionals[0]
    );
  }, [currentUser, professionals]);

  // Basic Info States
  const [name, setName] = useState(myProfile ? myProfile.name : '');
  const [businessName, setBusinessName] = useState(myProfile ? myProfile.businessName : '');
  const [phone, setPhone] = useState(myProfile ? myProfile.phone : '');
  const [state, setState] = useState(myProfile ? myProfile.state : 'Lagos');
  const [city, setCity] = useState(myProfile ? myProfile.city : '');
  const [category, setCategory] = useState(myProfile ? myProfile.category : 'graphic-design');
  const [startingPrice, setStartingPrice] = useState<number | string>(
    myProfile ? myProfile.startingPrice : 25000
  );
  const [bio, setBio] = useState(myProfile ? myProfile.bio : '');
  const [servicesList, setServicesList] = useState<string[]>(
    myProfile?.servicesList || []
  );

  // Pictures States
  const [avatar, setAvatar] = useState<string>(
    myProfile?.avatar || AVATAR_PRESETS[0].url
  );
  const [portfolio, setPortfolio] = useState<string[]>(
    myProfile?.portfolio || []
  );

  // Image Inputs & Lightbox
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);
  const [portfolioUrlInput, setPortfolioUrlInput] = useState('');
  const [activeZoomImage, setActiveZoomImage] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const portfolioFileInputRef = useRef<HTMLInputElement>(null);

  // New service package input
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  useEffect(() => {
    if (myProfile) {
      setName(myProfile.name);
      setBusinessName(myProfile.businessName);
      setPhone(myProfile.phone);
      setState(myProfile.state);
      setCity(myProfile.city);
      setCategory(myProfile.category);
      setStartingPrice(myProfile.startingPrice);
      setBio(myProfile.bio);
      setServicesList(myProfile.servicesList || []);
      setAvatar(myProfile.avatar || AVATAR_PRESETS[0].url);
      setPortfolio(myProfile.portfolio || []);
    }
  }, [myProfile]);

  // Avatar Upload Handlers
  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      const dataUrl = await processImageFile(file, 600, 600, 0.85);
      setAvatar(dataUrl);
      showToast('Profile picture uploaded successfully! Remember to save changes.');
    } catch (err: any) {
      showToast(err.message || 'Failed to process image');
    } finally {
      setIsProcessingImage(false);
      if (avatarFileInputRef.current) avatarFileInputRef.current.value = '';
    }
  };

  const handleApplyAvatarUrl = () => {
    if (!avatarUrlInput.trim()) return;
    setAvatar(avatarUrlInput.trim());
    setAvatarUrlInput('');
    showToast('Profile picture URL updated!');
  };

  // Portfolio Pictures Handlers
  const handlePortfolioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      const dataUrl = await processImageFile(file, 1200, 1000, 0.82);
      setPortfolio(prev => [dataUrl, ...prev]);
      showToast('Project picture added to your portfolio!');
    } catch (err: any) {
      showToast(err.message || 'Failed to process image');
    } finally {
      setIsProcessingImage(false);
      if (portfolioFileInputRef.current) portfolioFileInputRef.current.value = '';
    }
  };

  const handleAddPortfolioUrl = () => {
    if (!portfolioUrlInput.trim()) return;
    setPortfolio(prev => [portfolioUrlInput.trim(), ...prev]);
    setPortfolioUrlInput('');
    showToast('New project picture added to your portfolio!');
  };

  const handleRemovePortfolioItem = (index: number) => {
    setPortfolio(prev => prev.filter((_, i) => i !== index));
    showToast('Picture removed from portfolio.');
  };

  // Service package handlers
  const handleAddServicePackage = () => {
    if (!newServiceName.trim() || !newServicePrice) return;
    const formatted = `${newServiceName.trim()} - ₦${Number(newServicePrice).toLocaleString()}`;
    setServicesList([...servicesList, formatted]);
    setNewServiceName('');
    setNewServicePrice('');
    showToast('Package added to service menu!');
  };

  const handleRemoveServicePackage = (index: number) => {
    setServicesList(servicesList.filter((_, i) => i !== index));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = SERVICE_CATEGORIES.find(c => c.id === category) || SERVICE_CATEGORIES[1];

    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === myProfile.id) {
          return {
            ...p,
            name: name.trim(),
            businessName: businessName.trim(),
            phone: phone.trim().replace(/^0/, ''),
            state,
            city: city.trim(),
            category,
            categoryLabel: catObj.name,
            startingPrice: Number(startingPrice) || 20000,
            bio: bio.trim(),
            avatar,
            portfolio,
            servicesList
          };
        }
        return p;
      })
    );
    showToast('Provider profile and pictures saved & published live!');
  };

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-200">
      
      {/* Lightbox for zooming portfolio photos */}
      {activeZoomImage && (
        <div 
          onClick={() => setActiveZoomImage(null)}
          className="fixed inset-0 z-60 bg-black/90 p-4 flex items-center justify-center cursor-zoom-out"
        >
          <img 
            src={activeZoomImage} 
            alt="Enlarged project" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" 
          />
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <button 
              onClick={onBack} 
              className="text-xs font-bold text-[#123D32] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </button>
            <span className="text-[10px] bg-[#123D32] text-[#D5AE70] font-black px-2.5 py-0.5 rounded-full">
              Provider Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#123D32]">
            Provider Business Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#52635B] mt-0.5">
            Manage your public listing, profile pictures, project portfolio, and rates across Nigeria.
          </p>
        </div>
        
        <button 
          onClick={() => onPreview({
            ...myProfile,
            name,
            businessName,
            avatar,
            portfolio,
            servicesList,
            bio,
            state,
            city,
            startingPrice: Number(startingPrice)
          })}
          className="bg-[#123D32] text-[#D5AE70] px-5 py-3 rounded-2xl font-bold text-xs border border-[#D5AE70]/40 hover:bg-[#1B5445] transition flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Eye className="w-4 h-4" />
          <span>Preview Public Profile</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-[#123D32]/10 shadow-xs">
          <span className="text-[11px] font-bold text-[#52635B] uppercase tracking-wider block">Profile Views</span>
          <span className="text-2xl font-black text-[#123D32] mt-1 block">942</span>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <Eye className="w-3 h-3" />
            +28% this month
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D5AE70]/40 shadow-xs">
          <span className="text-[11px] font-bold text-[#52635B] uppercase tracking-wider block">WhatsApp Leads</span>
          <span className="text-2xl font-black text-[#D5AE70] mt-1 block">56</span>
          <span className="text-[10px] text-[#52635B] font-semibold flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-[#123D32]" />
            Direct customer clicks
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#123D32]/10 shadow-xs">
          <span className="text-[11px] font-bold text-[#52635B] uppercase tracking-wider block">Average Rating</span>
          <span className="text-2xl font-black text-[#123D32] mt-1 block flex items-center gap-1">
            <Star className="w-5 h-5 fill-[#D5AE70] text-[#D5AE70]" />
            {myProfile.rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-[#52635B] font-semibold">
            From {myProfile.reviewsCount} reviews
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#123D32]/10 shadow-xs">
          <span className="text-[11px] font-bold text-[#52635B] uppercase tracking-wider block">Portfolio Pictures</span>
          <span className="text-2xl font-black text-[#123D32] mt-1 block">
            {portfolio.length}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">
            Showcase active
          </span>
        </div>
      </div>

      {/* Main Profile Form */}
      <div className="bg-white rounded-3xl border border-[#123D32]/15 p-6 sm:p-8 shadow-sm space-y-8">
        <div>
          <h2 className="text-lg font-black text-[#123D32] pb-2 border-b border-[#123D32]/10 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#D5AE70]" />
            <span>Edit Profile & Upload Pictures</span>
          </h2>
          <p className="text-xs text-[#52635B] mt-1">
            Upload your profile photo and portfolio project images to attract more high-paying Nigerian clients.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-8">
          
          {/* SECTION 1: PROFILE PICTURE / AVATAR */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF7F0] border border-[#123D32]/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-xs sm:text-sm text-[#123D32] uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#D5AE70]" />
                  <span>Profile Picture (Avatar)</span>
                </h3>
                <p className="text-[11px] text-[#52635B]">
                  Clients see this photo on your marketplace card and WhatsApp profile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarPresets(!showAvatarPresets)}
                className="text-xs font-bold text-[#123D32] underline hover:text-[#1B5445] cursor-pointer"
              >
                {showAvatarPresets ? 'Hide Sample Avatars' : 'Choose Sample Photo'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
              {/* Picture Display */}
              <div className="relative shrink-0 group">
                <img 
                  src={avatar} 
                  alt="Profile" 
                  className="w-24 h-24 sm:w-28 sm:sm:h-28 rounded-2xl object-cover border-4 border-[#D5AE70] shadow-md group-hover:brightness-95 transition"
                />
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 text-[10px] font-bold cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Change</span>
                </button>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Hidden file input */}
                  <input 
                    ref={avatarFileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarFileUpload}
                    className="hidden" 
                  />

                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="px-4 py-2.5 bg-[#123D32] text-[#D5AE70] font-black text-xs rounded-xl flex items-center gap-2 hover:bg-[#1B5445] transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Picture from Phone / PC</span>
                  </button>

                  <span className="text-[11px] text-[#7B8C85]">
                    Supports JPG, PNG, WEBP (Auto-optimized)
                  </span>
                </div>

                {/* Or enter URL */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-[#7B8C85] absolute left-3 top-3" />
                    <input 
                      type="url" 
                      placeholder="Or paste an image URL (e.g. from Google, Unsplash, Cloudinary)..."
                      value={avatarUrlInput}
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-[#123D32]/20 bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyAvatarUrl}
                    className="px-3.5 py-2 bg-white text-[#123D32] border border-[#123D32]/20 rounded-xl font-bold text-xs hover:bg-[#EDE3D1] transition cursor-pointer shrink-0"
                  >
                    Apply URL
                  </button>
                </div>

                {/* Sample Avatar Presets */}
                {showAvatarPresets && (
                  <div className="pt-2 border-t border-[#123D32]/10 animate-in fade-in duration-200">
                    <span className="text-[10px] font-bold text-[#52635B] uppercase block mb-1.5">
                      Select a Preset Profile Picture:
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <div 
                          key={idx}
                          onClick={() => { setAvatar(preset.url); showToast(`Selected ${preset.name}`); }}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border cursor-pointer transition ${
                            avatar === preset.url 
                              ? 'border-[#123D32] bg-[#123D32]/10 ring-2 ring-[#D5AE70]' 
                              : 'border-[#123D32]/15 bg-white hover:border-[#D5AE70]'
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-[10px] font-bold text-[#26332D] pr-1.5">{preset.name.split(' ')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: PORTFOLIO PROJECT PICTURES */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF7F0] border border-[#123D32]/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-black text-xs sm:text-sm text-[#123D32] uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#D5AE70]" />
                  <span>Portfolio Project Pictures ({portfolio.length})</span>
                </h3>
                <p className="text-[11px] text-[#52635B]">
                  Showcase your real craft: garments sewn, cakes baked, solar panels installed, or app UI designs.
                </p>
              </div>
            </div>

            {/* Hidden file input for portfolio */}
            <input 
              ref={portfolioFileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handlePortfolioFileUpload}
              className="hidden" 
            />

            {/* Current Portfolio Grid */}
            {portfolio.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#123D32]/25 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#F7F1E5] text-[#123D32] flex items-center justify-center mx-auto text-lg">
                  📷
                </div>
                <h4 className="text-xs font-bold text-[#26332D]">No portfolio pictures uploaded yet</h4>
                <p className="text-[11px] text-[#7B8C85]">
                  Profiles with at least 2 pictures receive 4x more WhatsApp inquiries from Nigerian clients.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {portfolio.map((imgUrl, idx) => (
                  <div 
                    key={idx} 
                    className="relative group rounded-2xl overflow-hidden border border-[#123D32]/15 shadow-2xs aspect-video bg-stone-100"
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Project ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveZoomImage(imgUrl)}
                        className="p-1.5 bg-white/90 text-[#123D32] rounded-lg hover:bg-white transition"
                        title="Zoom Image"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePortfolioItem(idx)}
                        className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                        title="Delete Picture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="absolute bottom-1 left-1.5 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.2 rounded">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Add Picture to Portfolio Action Bar */}
            <div className="pt-2 border-t border-[#123D32]/10 space-y-3">
              <span className="text-[11px] font-bold text-[#26332D] block">
                Add New Picture to Portfolio:
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => portfolioFileInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="px-4 py-2 bg-[#123D32] text-[#D5AE70] font-black text-xs rounded-xl flex items-center gap-1.5 hover:bg-[#1B5445] transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Project Picture</span>
                </button>

                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <input 
                    type="url" 
                    placeholder="Or paste project image URL..."
                    value={portfolioUrlInput}
                    onChange={(e) => setPortfolioUrlInput(e.target.value)}
                    className="flex-1 text-xs p-2 rounded-xl border border-[#123D32]/20 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddPortfolioUrl}
                    className="px-3 py-2 bg-white text-[#123D32] border border-[#123D32]/20 rounded-xl font-bold text-xs hover:bg-[#EDE3D1] transition cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Sample Work Presets */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                <span className="text-[#7B8C85] font-semibold">Quick Nigerian Samples:</span>
                {PORTFOLIO_PRESETS.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPortfolio(prev => [sample.url, ...prev]);
                      showToast(`Added sample: ${sample.name}`);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-white border border-[#123D32]/15 text-[#123D32] font-semibold hover:border-[#D5AE70] transition cursor-pointer"
                  >
                    + {sample.name.split(' / ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: BASIC BUSINESS & CONTACT INFO */}
          <div className="space-y-6">
            <h3 className="font-black text-xs sm:text-sm text-[#123D32] uppercase tracking-wider">
              Business & Service Credentials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-[#26332D] block mb-1.5">
                  Lead Specialist / Artisan Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-[#FAF7F0] font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#26332D] block mb-1.5">
                  Registered Brand / Business Name
                </label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-[#FAF7F0] font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-[#26332D] block mb-1.5">
                  Service Category
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-[#FAF7F0] font-medium"
                >
                  {SERVICE_CATEGORIES.slice(1).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#26332D] block mb-1.5">
                  State (Nigeria)
                </label>
                <select 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-[#FAF7F0] font-medium"
                >
                  {NIGERIAN_STATES.filter(s => s !== "All Nigeria").map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#26332D] block mb-1.5">
                  City / LGA / Neighborhood
                </label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Ikeja, Wuse 2, GRA"
                  className="w-full text-xs p-3.5 rounded-2xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-[#FAF7F0] font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-[#26332D] block mb-1.5">
                  WhatsApp Phone Number (+234)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-xs font-black bg-[#EDE3D1] border border-r-0 border-[#123D32]/20 rounded-l-2xl text-[#26332D]">
                    +234
                  </span>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="8012345678"
                    className="w-full text-xs p-3.5 rounded-r-2xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-[#FAF7F0] font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#26332D] block mb-1.5">
                  Minimum Starting Rate (₦ Naira)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 text-xs font-black bg-[#EDE3D1] border border-r-0 border-[#123D32]/20 rounded-l-2xl text-[#123D32]">
                    ₦
                  </span>
                  <input 
                    type="number" 
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-r-2xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-[#FAF7F0] font-black text-[#123D32]"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="text-xs font-bold text-[#26332D] block mb-1.5">
                  Guaranteed Turnaround / Response
                </label>
                <input 
                  type="text" 
                  defaultValue="within 1 hour"
                  className="w-full text-xs p-3.5 rounded-2xl border border-[#123D32]/20 bg-[#FAF7F0] font-medium"
                  placeholder="e.g. within 30 mins"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#26332D] block mb-1.5">
                Professional Bio & Value Proposition
              </label>
              <textarea 
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs p-3.5 rounded-2xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-[#FAF7F0] font-medium leading-relaxed"
                required
              ></textarea>
            </div>
          </div>

          {/* SECTION 4: SERVICE PACKAGES */}
          <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#123D32]/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-[#123D32] text-xs uppercase tracking-wider">
                  Configured Service Packages (₦)
                </h3>
                <p className="text-[11px] text-[#52635B]">
                  Clients see these directly on your profile menu.
                </p>
              </div>
              <span className="text-xs font-bold bg-[#123D32] text-[#D5AE70] px-2.5 py-0.5 rounded-full">
                {servicesList.length} Packages
              </span>
            </div>

            <div className="space-y-2">
              {servicesList.map((svc, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#123D32]/10 text-xs"
                >
                  <span className="font-bold text-[#26332D]">{svc}</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveServicePackage(i)}
                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Remove Package"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new package fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#123D32]/10">
              <input 
                type="text" 
                placeholder="e.g. Express 24h Turnaround"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                className="text-xs p-2.5 rounded-xl border border-[#123D32]/20 bg-white"
              />
              <input 
                type="number" 
                placeholder="Price in Naira (e.g. 45000)"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(e.target.value)}
                className="text-xs p-2.5 rounded-xl border border-[#123D32]/20 bg-white font-bold text-[#123D32]"
              />
              <button 
                type="button"
                onClick={handleAddServicePackage}
                className="px-4 py-2 bg-[#123D32] text-[#D5AE70] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#1B5445] transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Package</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#123D32]/10">
            <button 
              type="button" 
              onClick={onBack}
              className="px-5 py-3 rounded-2xl border border-[#123D32]/20 text-xs font-bold text-[#26332D] hover:bg-[#FAF7F0] cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-7 py-3 rounded-2xl bg-[#123D32] hover:bg-[#1B5445] text-[#D5AE70] text-xs font-black shadow-lg border border-[#D5AE70]/40 transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D5AE70]" />
              <span>Save & Publish Changes</span>
            </button>
          </div>

        </form>
      </div>
    </main>
  );
};
