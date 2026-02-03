import { useState } from 'react';
import { 
  Building2, Calculator, Ruler, ClipboardCheck, Search, Activity, 
  Palette, Image as ImageIcon, Box, Layout, Eye, Layers, ScanLine, Trees, Glasses,
  Scale, FileText, FileSignature, ShieldCheck,
  DollarSign, CreditCard, TrendingUp, Receipt,
  Kanban, BarChart2, Users, FolderOpen, Package, CheckSquare,
  Megaphone, Video, PenTool, MessageCircle, Share2, Target, 
  ArrowRight, ArrowLeft,
  Download, Save, Copy
} from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { SmartConstructionTools } from './tools/SmartConstructionTools';
import { SmartDesignTools } from './tools/SmartDesignTools';
import { SmartGenericTools } from './tools/SmartGenericTools';
import { SmartMarketingTools } from './tools/SmartMarketingTools';

// Define types
type ToolId = string;

interface ToolItem {
  id: ToolId;
  icon: any;
}

interface CategoryItem {
  id: 'construction' | 'design' | 'legal' | 'financial' | 'project' | 'marketing';
  icon: any;
  color: string;
  gradient: string;
  tools: ToolItem[];
}

type ViewState = 'dashboard' | 'category' | 'tool';

interface AIToolsDashboardProps {
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

export function AIToolsDashboard({ onFullscreenToggle }: AIToolsDashboardProps) {
  const { t, dir } = useTranslation('tools'); 
  
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Data Structure
  // Note: We keep the structure here for the Dashboard Icons, but the tools list is now managed inside the sub-components or config maps
  const CATEGORIES: CategoryItem[] = [
    {
      id: 'construction',
      icon: Building2,
      color: 'bg-orange-500',
      gradient: 'from-orange-400 to-red-500',
      tools: [] 
    },
    {
      id: 'design',
      icon: Palette,
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-pink-500',
      tools: []
    },
    {
      id: 'legal',
      icon: Scale,
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-indigo-500',
      tools: []
    },
    {
      id: 'financial',
      icon: Calculator,
      color: 'bg-green-500',
      gradient: 'from-green-400 to-emerald-500',
      tools: []
    },
    {
      id: 'project',
      icon: Kanban,
      color: 'bg-teal-500',
      gradient: 'from-teal-400 to-cyan-500',
      tools: []
    },
    {
      id: 'marketing',
      icon: Megaphone,
      color: 'bg-rose-500',
      gradient: 'from-rose-400 to-pink-500',
      tools: []
    }
  ];

  const handleCategoryClick = (id: string) => {
    setSelectedCategoryId(id);
    setCurrentView('category'); 
    window.scrollTo(0, 0);
  };

  // --- Shared Components ---

  const StaticBanner = () => (
    <div className="px-4 mb-6 mt-4" dir={dir}>
      <div className="w-full h-[100px] bg-gradient-to-r from-[#2AA676] to-[#C8A86A] rounded-[16px] flex items-center justify-center p-4 shadow-md">
        <span className="text-white text-center font-cairo font-bold text-sm md:text-base leading-relaxed">
          {t('poweredBy') || "Powered by Weyaak Intelligent System – الذكاء الاصطناعي بين يديك"}
        </span>
      </div>
    </div>
  );

  // --- View Renderers ---

  // Main Dashboard
  const renderDashboard = () => (
    <div className="pb-32">
       <StaticBanner />

       <div className="px-5">
         <h2 className="text-[#1A1A1A] mb-5" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }} dir={dir}>
           {t('categories.title') || "Featured Categories"}
         </h2>

         <div className="grid grid-cols-3 gap-4" dir={dir}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-white rounded-[24px] p-4 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center gap-3 border border-[#F5EEE1] min-h-[140px] relative overflow-hidden group"
              >
                 <div className={`w-12 h-12 bg-gradient-to-br ${cat.gradient} rounded-[18px] flex items-center justify-center text-white shadow-lg mb-1 group-hover:scale-110 transition-transform`}>
                   <Icon className="w-6 h-6" />
                 </div>
                 <span className="text-[#1A1A1A] text-center line-clamp-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '12px', lineHeight: 1.4 }}>
                   {t(`categories.${cat.id}.title`)}
                 </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentView === 'dashboard' && renderDashboard()}
        
        {/* Construction Category */}
        {(currentView === 'category' || currentView === 'tool') && selectedCategoryId === 'construction' && (
          <SmartConstructionTools onBack={() => {
             setCurrentView('dashboard');
             setSelectedCategoryId(null);
          }} />
        )}

        {/* Design Category */}
        {(currentView === 'category' || currentView === 'tool') && selectedCategoryId === 'design' && (
          <SmartDesignTools 
            onBack={() => {
               setCurrentView('dashboard');
               setSelectedCategoryId(null);
            }} 
            onFullscreenToggle={onFullscreenToggle}
          />
        )}
        
        {/* Marketing Category */}
        {(currentView === 'category' || currentView === 'tool') && selectedCategoryId === 'marketing' && (
          <SmartMarketingTools 
            onBack={() => {
               setCurrentView('dashboard');
               setSelectedCategoryId(null);
            }} 
          />
        )}
        
        {/* Other Categories (Generic Logic) */}
        {(currentView === 'category' || currentView === 'tool') && selectedCategoryId && !['construction', 'design', 'marketing'].includes(selectedCategoryId) && (
           <SmartGenericTools 
              categoryId={selectedCategoryId as any}
              onBack={() => {
                 setCurrentView('dashboard');
                 setSelectedCategoryId(null);
              }}
           />
        )}
      </main>
    </div>
  );
}