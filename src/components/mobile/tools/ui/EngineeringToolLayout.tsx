import React from 'react';
import { 
  ChevronRight, ChevronLeft, MousePointer2, Square, 
  Circle, Type, Move, Settings, Share2, Download
} from 'lucide-react';
import { useTranslation } from '../../../../contexts/LanguageContext';

interface EngineeringToolLayoutProps {
  toolName: string;
  onBack: () => void;
  children?: React.ReactNode; // For future canvas content
}

export function EngineeringToolLayout({ toolName, onBack, children }: EngineeringToolLayoutProps) {
  const { dir } = useTranslation('tools');
  const isRTL = dir === 'rtl';

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden" dir={dir}>
      
      {/* 2) Top Bar */}
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            {isRTL ? <ChevronRight className="w-5 h-5 text-gray-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600" />}
          </button>
          <span className="font-bold text-sm md:text-base text-[#1A1A1A] font-cairo">
            {toolName}
          </span>
        </div>
        
        <div className="bg-gray-100 px-3 py-1 rounded-md text-[10px] font-mono text-gray-400">
          ID: #2025-DXF
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 3) Left Tools Bar */}
        <aside className="w-14 md:w-16 border-r border-gray-200 bg-white flex flex-col items-center py-4 gap-6 z-10 shrink-0">
          {/* Placeholders for Tools */}
          <div className="p-2 rounded-lg bg-blue-50 text-[#007AFF]">
            <MousePointer2 className="w-5 h-5" />
          </div>
          <div className="p-2 rounded-lg hover:bg-gray-50 text-gray-400">
            <Square className="w-5 h-5" />
          </div>
          <div className="p-2 rounded-lg hover:bg-gray-50 text-gray-400">
            <Circle className="w-5 h-5" />
          </div>
          <div className="p-2 rounded-lg hover:bg-gray-50 text-gray-400">
            <Type className="w-5 h-5" />
          </div>
          <div className="mt-auto p-2 rounded-lg hover:bg-gray-50 text-gray-400">
            <Settings className="w-5 h-5" />
          </div>
        </aside>

        {/* 1) Canvas Area */}
        <main className="flex-1 bg-[#F9FAFB] relative overflow-hidden flex items-center justify-center">
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* 5) Export Panel (Floating Bottom Right) */}
          <div className="absolute bottom-6 right-6 flex gap-2">
             <div className="h-10 px-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2 text-gray-400 text-xs font-bold">
                <Download className="w-4 h-4" />
                <span>Export</span>
             </div>
             <div className="h-10 w-10 bg-[#1A1A1A] text-white rounded-lg shadow-lg flex items-center justify-center">
                <Share2 className="w-4 h-4" />
             </div>
          </div>

          {/* Optional Children (Canvas Content) */}
          {children}
        </main>

        {/* 4) Right Properties Panel */}
        <aside className="w-64 border-l border-gray-200 bg-white hidden md:flex flex-col z-10 shrink-0">
          <div className="h-10 border-b border-gray-100 flex items-center px-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Properties</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
             <div className="text-center p-6">
                <div className="w-12 h-12 bg-gray-50 rounded-full mx-auto mb-3 border border-gray-100 border-dashed" />
                <span className="text-[10px] text-gray-300 block">No Selection</span>
             </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
