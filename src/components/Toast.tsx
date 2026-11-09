import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="fixed top-24 right-4 z-50 flex items-center gap-3 bg-[#123D32] text-[#D5AE70] px-5 py-3.5 rounded-2xl shadow-2xl border border-[#D5AE70]/40 text-xs font-bold transition-all animate-in fade-in slide-in-from-top-4 duration-300">
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#D5AE70] shrink-0" />}
      {type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
      {type === 'info' && <Info className="w-4 h-4 text-[#D5AE70] shrink-0" />}
      <span className="text-white tracking-wide">{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 text-[#D5AE70]/70 hover:text-[#D5AE70] p-1 rounded-full transition"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
