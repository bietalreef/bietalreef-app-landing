import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Upload, Sparkles, ChevronRight } from 'lucide-react';

// --- Constants ---
export const UAE_PALETTE = {
  gold: '#C8A86A',
  green: '#2AA676',
  black: '#1A1A1A',
  sand: '#FAFAF9',
  white: '#FFFFFF',
  grey: '#F3F4F6',
};

export const SHADOW_PREMIUM = "0 10px 30px -10px rgba(0,0,0,0.08)";
export const GLASS_BG = "bg-white/80 backdrop-blur-xl border border-white/20";

// --- Typography & Headers ---

export const SectionHeader = ({ title, subtitle, action }: { title: string, subtitle?: string, action?: React.ReactNode }) => (
  <div className="flex items-end justify-between mb-5 px-1">
    <div>
      <h2 className="text-2xl font-bold text-[#1A1A1A] font-cairo leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-400 font-cairo mt-1 font-medium">
          {subtitle}
        </p>
      )}
    </div>
    {action}
  </div>
);

// --- Cards ---

export const PremiumCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`bg-white rounded-[24px] p-5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-50/50 relative overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

export const ToolCard = ({ title, subtitle, icon: Icon, onClick, tag }: any) => (
  <button 
    onClick={onClick}
    className="w-full group bg-white rounded-[24px] p-4 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-50 transition-all duration-300 flex flex-col items-start relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full -mr-8 -mt-8 z-0" />
    
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-sm flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
       <Icon className="w-7 h-7 text-[#1A1A1A]" strokeWidth={1.5} />
    </div>
    
    <div className="text-right w-full relative z-10">
      {tag && <span className="text-[10px] font-bold bg-[#C8A86A]/10 text-[#C8A86A] px-2 py-1 rounded-full mb-2 inline-block">{tag}</span>}
      <h3 className="text-lg font-bold text-[#1A1A1A] font-cairo leading-tight mb-1">{title}</h3>
      <p className="text-xs text-gray-400 font-cairo line-clamp-2 leading-relaxed">{subtitle}</p>
    </div>

    <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
       <ChevronLeft className="w-4 h-4 text-[#1A1A1A]" />
    </div>
  </button>
);

// --- Upload Box ---

export const UploadBox = ({ label, onUpload, icon: Icon = Upload }: any) => (
  <div 
    onClick={onUpload}
    className="w-full h-48 rounded-[24px] border-2 border-dashed border-gray-200 bg-gray-50/30 hover:bg-gray-50/80 hover:border-[#C8A86A]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
  >
    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#C8A86A] group-hover:scale-110 transition-all duration-300 z-10">
      <Icon className="w-7 h-7" strokeWidth={1.5} />
    </div>
    <div className="text-center z-10">
      <p className="text-sm font-bold text-gray-600 font-cairo group-hover:text-gray-800">{label}</p>
      <p className="text-xs text-gray-400 font-cairo mt-1">JPG, PNG (Max 10MB)</p>
    </div>
    
    {/* Background Glow */}
    <div className="absolute inset-0 bg-gradient-to-tr from-[#C8A86A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

// --- Buttons ---

export const MainActionButton = ({ onClick, text, loading, disabled }: any) => (
  <button 
    onClick={onClick} 
    disabled={loading || disabled}
    className="w-full bg-[#007AFF] text-white font-bold font-cairo py-4 rounded-[20px] shadow-[0_10px_20px_-5px_rgba(0,122,255,0.3)] hover:shadow-xl hover:bg-[#006ce6] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100 relative overflow-hidden"
  >
    {loading ? (
       <span className="flex items-center gap-2">
         <Sparkles className="w-5 h-5 animate-spin" />
         جاري المعالجة...
       </span>
    ) : (
       <>
         <span className="text-lg">{text}</span>
         <span className="bg-white/20 rounded-full p-1"><Sparkles className="w-4 h-4" fill="currentColor" /></span>
       </>
    )}
  </button>
);

// --- Navigation ---

export const SoftTab = ({ active, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 px-4 rounded-[16px] text-sm font-bold font-cairo transition-all duration-300 ${
      active 
        ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-200 scale-105' 
        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
    }`}
  >
    {label}
  </button>
);

export const BackHeader = ({ title, onBack }: any) => (
  <div className="flex items-center gap-4 mb-6">
    <button 
      onClick={onBack}
      className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
    >
      <ChevronRight className="w-6 h-6 text-[#1A1A1A]" />
    </button>
    <h1 className="text-2xl font-bold font-cairo text-[#1A1A1A]">{title}</h1>
  </div>
);
