import React, { useState } from 'react';
import { UserRole, UserSession, StoredUserAccount, Professional } from '../types';
import { hashPassword } from '../utils/auth';
import { SERVICE_CATEGORIES, NIGERIAN_STATES } from '../data/seedData';
import { 
  X, AlertCircle, ShieldCheck, Briefcase, UserCheck, 
  Sparkles, Zap, ArrowRight, CheckCircle2, Camera, Upload 
} from 'lucide-react';
import { processImageFile, AVATAR_PRESETS } from '../utils/imageUpload';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  initialRole?: UserRole;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
  onRegisterSuccess: (session: UserSession, newPro?: Professional) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  initialRole = 'provider',
  onClose,
  onLoginSuccess,
  onRegisterSuccess
}) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [role, setRole] = useState<UserRole>(initialRole);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Provider-specific fields
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('graphic-design');
  const [state, setState] = useState('Lagos');
  const [city, setCity] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0].url);
  const [showAvatarPresets, setShowAvatarPresets] = useState(false);
  const avatarFileInputRef = React.useRef<HTMLInputElement>(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Demo Dashboard Launchers for testing
  const handleLaunchDemo = (demoRole: UserRole) => {
    const demoId = demoRole === 'provider' ? 'seed-user-1' : 'client-demo-1';
    const sessionPayload: UserSession = {
      id: demoId,
      name: demoRole === 'provider' ? "Babajide 'Jay' Adeleke" : 'Chinedu Eze',
      email: demoRole === 'provider' ? 'jay@adelekevisuals.ng' : 'chinedu.eze@gmail.com',
      phone: demoRole === 'provider' ? '8032114455' : '8023344556',
      role: demoRole,
      proId: demoRole === 'provider' ? 'pro-1' : null,
      token: `demo_token_${Date.now()}`,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
    };

    localStorage.setItem('cb_session', JSON.stringify(sessionPayload));
    if (isLogin) {
      onLoginSuccess(sessionPayload);
    } else {
      onRegisterSuccess(sessionPayload);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail || !loginPassword) {
      setErrorMsg('Please enter both your email address and password.');
      setIsSubmitting(false);
      return;
    }

    try {
      const storedUsersRaw = localStorage.getItem('cb_users') || '[]';
      const users: StoredUserAccount[] = JSON.parse(storedUsersRaw);
      const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!foundUser) {
        setErrorMsg('No account found with this email. Please check your spelling or choose "Create Dashboard".');
        setIsSubmitting(false);
        return;
      }

      const hashed = await hashPassword(loginPassword);
      if (hashed !== foundUser.passwordHash) {
        setErrorMsg('Incorrect password. Please verify your credentials and try again.');
        setIsSubmitting(false);
        return;
      }

      const sessionPayload: UserSession = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        role: foundUser.role,
        proId: foundUser.proId || null,
        token: `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
      };

      localStorage.setItem('cb_session', JSON.stringify(sessionPayload));
      onLoginSuccess(sessionPayload);
    } catch {
      setErrorMsg('Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/^0/, '');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter matching passwords.');
      setIsSubmitting(false);
      return;
    }
    if (cleanPhone.length < 9) {
      setErrorMsg('Please enter a valid Nigerian WhatsApp/Phone number (e.g. 8031234567).');
      setIsSubmitting(false);
      return;
    }

    if (role === 'provider') {
      if (!businessName.trim() || !city.trim() || !startingPrice) {
        setErrorMsg('Please complete your Business Name, City/LGA, and Starting Rate to generate your dashboard.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const storedUsersRaw = localStorage.getItem('cb_users') || '[]';
      const users: StoredUserAccount[] = JSON.parse(storedUsersRaw);

      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        setErrorMsg('An account with this email address already exists. Please sign in instead.');
        setIsSubmitting(false);
        return;
      }

      const passwordHash = await hashPassword(password);
      const userId = `usr-${Date.now()}`;
      let newPro: Professional | undefined = undefined;
      let proId: string | null = null;

      if (role === 'provider') {
        proId = `pro-${Date.now()}`;
        const catObj = SERVICE_CATEGORIES.find(c => c.id === category) || SERVICE_CATEGORIES[1];
        
        newPro = {
          id: proId,
          userId: userId,
          name: name.trim(),
          businessName: businessName.trim(),
          category: category,
          categoryLabel: catObj.name,
          state: state,
          city: city.trim(),
          rating: 5.0,
          reviewsCount: 1,
          startingPrice: Number(startingPrice) || 20000,
          phone: cleanPhone,
          verified: true,
          completedJobs: 1,
          responseTime: 'within 1 hour',
          badges: ['Identity Verified', 'New Artisan on ClientBridge'],
          avatar: avatar || AVATAR_PRESETS[0].url,
          bio: bio.trim() || `Professional ${catObj.name.toLowerCase()} dedicated to quality craftsmanship and prompt delivery across ${state}.`,
          portfolio: [
            "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80"
          ],
          servicesList: [
            `Standard ${catObj.name} Service - ₦${Number(startingPrice || 20000).toLocaleString()}`,
            `Consultation & Project Milestone - ₦15,000`
          ]
        };
      }

      const newUser: StoredUserAccount = {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        role: role,
        proId: proId,
        avatar: avatar,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('cb_users', JSON.stringify(users));

      const sessionPayload: UserSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        proId: newUser.proId,
        avatar: avatar,
        token: `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
      };

      localStorage.setItem('cb_session', JSON.stringify(sessionPayload));
      onRegisterSuccess(sessionPayload, newPro);
    } catch {
      setErrorMsg('Could not complete dashboard creation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#D5AE70]/40 relative my-6 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F1E5] text-[#26332D] flex items-center justify-center font-bold text-sm hover:bg-[#EDE3D1] transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Top Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#123D32] text-[#D5AE70] font-black text-xl rounded-2xl mx-auto flex items-center justify-center mb-2.5 shadow-md border border-[#D5AE70]/30">
            CB
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#123D32]">
            {isLogin ? 'Sign In to Your Dashboard' : 'Create Your Dashboard'}
          </h3>
          <p className="text-xs text-[#52635B] mt-1 font-semibold">
            {isLogin 
              ? 'Access your saved artisans or provider business inquiries' 
              : 'Select your dashboard type below to get started in 2 minutes 🇳🇬'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-[#F7F1E5] p-1.5 rounded-2xl mb-5 text-xs font-bold text-[#26332D]">
          <button 
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              !isLogin 
                ? 'bg-[#123D32] text-[#D5AE70] shadow-md font-black' 
                : 'text-[#52635B] hover:text-[#123D32]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create New Dashboard</span>
          </button>
          
          <button 
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              isLogin 
                ? 'bg-[#123D32] text-[#D5AE70] shadow-md font-black' 
                : 'text-[#52635B] hover:text-[#123D32]'
            }`}
          >
            <span>Sign In to Existing</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* DASHBOARD TYPE SELECTION (When in Register mode) */}
        {!isLogin && (
          <div className="space-y-2 mb-5">
            <span className="text-[11px] font-extrabold text-[#26332D] uppercase tracking-wider block">
              1. Choose Dashboard Type:
            </span>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Option 1: Provider Dashboard */}
              <div 
                onClick={() => { setRole('provider'); setErrorMsg(''); }}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                  role === 'provider' 
                    ? 'border-[#123D32] bg-[#123D32]/5 shadow-sm' 
                    : 'border-[#123D32]/15 bg-white hover:border-[#D5AE70]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#123D32] text-[#D5AE70] flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  {role === 'provider' && (
                    <CheckCircle2 className="w-4 h-4 text-[#123D32]" />
                  )}
                </div>
                <div className="font-black text-xs text-[#123D32]">Provider Dashboard</div>
                <p className="text-[10px] text-[#52635B] mt-0.5 leading-snug">
                  For artisans & pros to get WhatsApp clients & manage rates.
                </p>
              </div>

              {/* Option 2: Customer Dashboard */}
              <div 
                onClick={() => { setRole('customer'); setErrorMsg(''); }}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                  role === 'customer' 
                    ? 'border-[#123D32] bg-[#123D32]/5 shadow-sm' 
                    : 'border-[#123D32]/15 bg-white hover:border-[#D5AE70]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D5AE70] text-[#123D32] flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  {role === 'customer' && (
                    <CheckCircle2 className="w-4 h-4 text-[#123D32]" />
                  )}
                </div>
                <div className="font-black text-xs text-[#123D32]">Client Dashboard</div>
                <p className="text-[10px] text-[#52635B] mt-0.5 leading-snug">
                  For clients to bookmark pros, track WhatsApp inquiries & quotes.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* FORM SECTION */}
        {isLogin ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#26332D] block mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. yourname@gmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#123D32]/20 focus:border-[#123D32] focus:outline-none bg-[#FAF7F0] font-medium"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#26332D] block mb-1">Password</label>
              <input 
                type="password" 
                placeholder="Enter your secret password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#123D32]/20 focus:border-[#123D32] focus:outline-none bg-[#FAF7F0] font-medium"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#123D32] hover:bg-[#1B5445] text-[#D5AE70] font-black text-xs sm:text-sm shadow-md border border-[#D5AE70]/40 transition mt-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Accessing Dashboard...' : 'Sign In to My Dashboard'}
            </button>
          </form>
        ) : (
          /* REGISTRATION / DASHBOARD CREATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs max-h-[55vh] overflow-y-auto pr-1">
            <span className="text-[11px] font-extrabold text-[#26332D] uppercase tracking-wider block">
              2. Enter Your Details:
            </span>

            {/* Profile Picture Option */}
            <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#123D32]/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-[#123D32] flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#D5AE70]" />
                  <span>Profile Picture (Optional)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAvatarPresets(!showAvatarPresets)}
                  className="text-[10px] font-bold text-[#123D32] underline hover:text-[#1B5445] cursor-pointer"
                >
                  {showAvatarPresets ? 'Hide presets' : 'Sample photos'}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <img 
                  src={avatar} 
                  alt="Avatar preview" 
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#D5AE70] shadow-xs shrink-0" 
                />
                
                <div className="flex-1">
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const dataUrl = await processImageFile(file, 400, 400, 0.85);
                        setAvatar(dataUrl);
                      } catch (err: any) {
                        setErrorMsg(err.message || 'Image error');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-[#123D32]/20 text-[#123D32] rounded-lg font-bold text-[11px] flex items-center gap-1.5 hover:bg-[#EDE3D1] transition cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-[#D5AE70]" />
                    <span>Upload from Phone/PC</span>
                  </button>
                </div>
              </div>

              {showAvatarPresets && (
                <div className="pt-2 border-t border-[#123D32]/10 flex flex-wrap gap-2 animate-in fade-in">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <img
                      key={idx}
                      src={p.url}
                      alt={p.name}
                      onClick={() => setAvatar(p.url)}
                      className={`w-8 h-8 rounded-lg object-cover cursor-pointer border-2 transition ${
                        avatar === p.url ? 'border-[#123D32] ring-2 ring-[#D5AE70]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title={p.name}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="font-bold text-[#26332D] block mb-1">
                {role === 'provider' ? 'Specialist / Owner Name' : 'Full Name'}
              </label>
              <input 
                type="text" 
                placeholder="e.g. Zainab Ibrahim"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#123D32]/20 focus:border-[#123D32] focus:outline-none bg-[#FAF7F0] font-medium"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#26332D] block mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#123D32]/20 focus:border-[#123D32] focus:outline-none bg-[#FAF7F0] font-medium"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#26332D] block mb-1">WhatsApp / Phone Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 font-bold bg-[#EDE3D1] border border-r-0 border-[#123D32]/20 rounded-l-xl text-[#26332D]">
                  +234
                </span>
                <input 
                  type="tel" 
                  placeholder="8012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-r-xl border border-[#123D32]/20 focus:border-[#123D32] focus:outline-none bg-[#FAF7F0] font-medium"
                  required
                />
              </div>
            </div>

            {/* Provider Additional Fields */}
            {role === 'provider' && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-[#123D32]/5 border border-[#123D32]/10">
                <span className="text-[11px] font-extrabold uppercase text-[#123D32] block flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#D5AE70]" />
                  <span>Provider Listing & Rates</span>
                </span>

                <div>
                  <label className="font-bold text-[#26332D] block mb-1">Registered Brand / Business Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ibrahim Stitches & Styles"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#123D32]/20 bg-white font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-[#26332D] block mb-1">Primary Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#123D32]/20 bg-white font-medium text-[#26332D]"
                    >
                      {SERVICE_CATEGORIES.slice(1).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#26332D] block mb-1">State</label>
                    <select 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#123D32]/20 bg-white font-medium text-[#26332D]"
                    >
                      {NIGERIAN_STATES.filter(s => s !== "All Nigeria").map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-[#26332D] block mb-1">City / LGA</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Lekki, Wuse 2"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#123D32]/20 bg-white font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#26332D] block mb-1">Starting Rate (₦)</label>
                    <input 
                      type="number" 
                      placeholder="25000"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#123D32]/20 bg-white font-black text-[#123D32]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#26332D] block mb-1">Short Professional Bio</label>
                  <textarea 
                    rows={2}
                    placeholder="Describe your craft, turnaround speed, and what makes your work stand out..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#123D32]/20 bg-white font-medium"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-[#26332D] block mb-1">Password</label>
                <input 
                  type="password" 
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#123D32]/20 focus:border-[#123D32] focus:outline-none bg-[#FAF7F0] font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#26332D] block mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#123D32]/20 focus:border-[#123D32] focus:outline-none bg-[#FAF7F0] font-medium"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#123D32] hover:bg-[#1B5445] text-[#D5AE70] font-black text-xs sm:text-sm shadow-md border border-[#D5AE70]/40 transition mt-2 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Creating Dashboard...' : `Create My ${role === 'provider' ? 'Provider' : 'Client'} Dashboard`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 1-CLICK INSTANT DEMO DASHBOARD SHORTCUTS */}
        <div className="mt-6 pt-4 border-t border-[#123D32]/10 bg-[#FAF7F0] -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-5 rounded-b-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black text-[#123D32] uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#D5AE70] fill-current" />
              <span>Or Test Instant Demo Dashboard</span>
            </span>
            <span className="text-[10px] text-[#7B8C85]">1-Click Preview</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button 
              type="button"
              onClick={() => handleLaunchDemo('provider')}
              className="p-2.5 rounded-xl bg-white border border-[#123D32]/20 text-[#123D32] font-black hover:border-[#D5AE70] hover:bg-[#F7F1E5] transition text-left cursor-pointer flex items-center justify-between shadow-2xs"
            >
              <span>⚡ Provider Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D5AE70]" />
            </button>

            <button 
              type="button"
              onClick={() => handleLaunchDemo('customer')}
              className="p-2.5 rounded-xl bg-white border border-[#123D32]/20 text-[#123D32] font-black hover:border-[#D5AE70] hover:bg-[#F7F1E5] transition text-left cursor-pointer flex items-center justify-between shadow-2xs"
            >
              <span>⚡ Client Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D5AE70]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
