import React, { useState, useMemo } from 'react';
import { SERVICE_CATEGORIES } from '../data/seedData';
import { formatNaira } from '../utils/auth';
import { X, Calculator, ArrowRight, Check, Sparkles } from 'lucide-react';

interface QuoteCalculatorModalProps {
  onClose: () => void;
  onApplyFilter: (categoryId: string) => void;
}

export const QuoteCalculatorModal: React.FC<QuoteCalculatorModalProps> = ({
  onClose,
  onApplyFilter
}) => {
  const [selectedCategory, setSelectedCategory] = useState('graphic-design');
  const [scope, setScope] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [urgency, setUrgency] = useState<'normal' | 'rush' | 'emergency'>('normal');
  const [locationTier, setLocationTier] = useState<'lagos-abuja' | 'major' | 'others'>('lagos-abuja');

  const baseRates: Record<string, number> = {
    'graphic-design': 35000,
    'web-dev': 95000,
    'photography': 50000,
    'videography': 70000,
    'fashion': 30000,
    'baking': 25000,
    'makeup': 25000,
    'hair': 20000,
    'electrical': 20000,
    'plumbing': 15000,
    'cleaning': 20000,
    'mechanic': 25000,
    'tutoring': 18000,
    'training': 22000,
    'digital-marketing': 45000,
    'all': 30000
  };

  const calculatedEstimate = useMemo(() => {
    const base = baseRates[selectedCategory] || 30000;
    
    // Scope multiplier
    let scopeMult = 1.0;
    if (scope === 'basic') scopeMult = 0.7;
    if (scope === 'premium') scopeMult = 1.8;

    // Urgency multiplier
    let urgencyMult = 1.0;
    if (urgency === 'rush') urgencyMult = 1.35;
    if (urgency === 'emergency') urgencyMult = 1.6;

    // Location modifier
    let locationMult = 1.0;
    if (locationTier === 'lagos-abuja') locationMult = 1.15;
    if (locationTier === 'others') locationMult = 0.85;

    const mid = Math.round(base * scopeMult * urgencyMult * locationMult);
    const low = Math.round(mid * 0.85 / 1000) * 1000;
    const high = Math.round(mid * 1.25 / 1000) * 1000;

    return { low, high, mid };
  }, [selectedCategory, scope, urgency, locationTier]);

  const handleSearchProfessionals = () => {
    onApplyFilter(selectedCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#D5AE70]/40 relative my-6 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F1E5] text-[#26332D] flex items-center justify-center font-bold text-sm hover:bg-[#EDE3D1] transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#123D32] text-[#D5AE70] flex items-center justify-center shadow-md border border-[#D5AE70]/30 shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#123D32]">
              Nigerian Naira (₦) Rate Estimator
            </h3>
            <p className="text-xs text-[#52635B] font-medium">
              Fair benchmark pricing based on verified artisan quotes in Nigeria.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Select Category */}
          <div>
            <label className="font-extrabold text-[#26332D] block mb-1.5 uppercase tracking-wider text-[11px]">
              Service Type
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 rounded-2xl border border-[#123D32]/20 focus:outline-none focus:border-[#123D32] bg-[#FAF7F0] font-bold text-[#123D32]"
            >
              {SERVICE_CATEGORIES.slice(1).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Project Scope */}
          <div>
            <label className="font-extrabold text-[#26332D] block mb-1.5 uppercase tracking-wider text-[11px]">
              Project Scope
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'basic', label: 'Starter / Minor', sub: 'Simple fix' },
                { id: 'standard', label: 'Standard', sub: 'Most common' },
                { id: 'premium', label: 'Comprehensive', sub: 'Luxury / Full scale' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScope(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    scope === opt.id 
                      ? 'bg-[#123D32] text-[#D5AE70] border-[#123D32] font-bold shadow-xs' 
                      : 'bg-[#FAF7F0] text-[#26332D] border-[#123D32]/10 hover:border-[#D5AE70]'
                  }`}
                >
                  <span className="block font-bold text-[11px] leading-tight">{opt.label}</span>
                  <span className="text-[9px] opacity-80 block mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Turnaround / Urgency */}
          <div>
            <label className="font-extrabold text-[#26332D] block mb-1.5 uppercase tracking-wider text-[11px]">
              Delivery Speed
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'Standard', time: '3 - 5 days' },
                { id: 'rush', label: 'Priority Rush', time: '24 - 48 hours' },
                { id: 'emergency', label: 'Same Day / Urgent', time: 'Immediate dispatch' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setUrgency(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    urgency === opt.id 
                      ? 'bg-[#123D32] text-[#D5AE70] border-[#123D32] font-bold shadow-xs' 
                      : 'bg-[#FAF7F0] text-[#26332D] border-[#123D32]/10 hover:border-[#D5AE70]'
                  }`}
                >
                  <span className="block font-bold text-[11px] leading-tight">{opt.label}</span>
                  <span className="text-[9px] opacity-80 block mt-0.5">{opt.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Tier */}
          <div>
            <label className="font-extrabold text-[#26332D] block mb-1.5 uppercase tracking-wider text-[11px]">
              Location Hub
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'lagos-abuja', label: 'Lagos / Abuja' },
                { id: 'major', label: 'PH / Ibadan / Kano' },
                { id: 'others', label: 'Other States' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLocationTier(opt.id as any)}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    locationTier === opt.id 
                      ? 'bg-[#123D32] text-[#D5AE70] border-[#123D32] font-bold shadow-xs' 
                      : 'bg-[#FAF7F0] text-[#26332D] border-[#123D32]/10 hover:border-[#D5AE70]'
                  }`}
                >
                  <span className="block font-bold text-[11px]">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Estimated Price Range Result Box */}
        <div className="mt-6 p-5 rounded-2xl bg-[#123D32] text-white border border-[#D5AE70]/40 space-y-2 text-center shadow-lg">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D5AE70] block flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Estimated Fair Nigerian Market Range
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {formatNaira(calculatedEstimate.low)} – {formatNaira(calculatedEstimate.high)}
          </div>
          <p className="text-[11px] text-[#FAF7F0]/80">
            Average benchmark is approximately <strong className="text-[#D5AE70]">{formatNaira(calculatedEstimate.mid)}</strong>. Exact milestones are finalized directly on WhatsApp with your chosen artisan.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-5">
          <button 
            onClick={handleSearchProfessionals}
            className="w-full py-3.5 rounded-2xl bg-[#D5AE70] hover:bg-[#C49B5B] text-[#123D32] font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Available Artisans for This Category</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
