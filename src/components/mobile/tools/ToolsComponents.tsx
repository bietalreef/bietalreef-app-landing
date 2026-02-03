import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../../contexts/LanguageContext';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

interface HeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  backgroundImage?: string;
}

export const ToolCategoryHeader = ({ title, subtitle, onBack, backgroundImage }: HeaderProps) => {
  const { dir, t } = useTranslation('tools');
  
  const defaultBg = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000";

  return (
    <div className="relative h-48 mb-6 overflow-hidden rounded-b-[30px] shadow-md group">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback 
          src={backgroundImage || defaultBg}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-5 z-10">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="self-start flex items-center gap-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full transition-all hover:bg-white/20 font-cairo text-sm font-bold"
        >
          {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {t('backToSmartTools')}
        </button>

        {/* Title & Subtitle */}
        <div className="text-white">
           <h1 className="text-2xl md:text-3xl font-bold font-cairo mb-1 shadow-black/10 drop-shadow-md">{title}</h1>
           <p className="text-white/80 text-xs md:text-sm font-cairo line-clamp-2 max-w-md">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export const BottomAdBanner = () => {
  const { t } = useTranslation('tools');
  
  return (
    <div className="w-full mt-8 mb-24 px-4">
       <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-6 shadow-lg border border-white/10">
          <div className="relative z-10 flex flex-col items-center text-center gap-3">
             <h3 className="text-white font-bold font-cairo text-lg">{t('proFeatures') || "Unlock Pro Features"}</h3>
             <p className="text-gray-400 text-xs max-w-xs font-cairo">
                {t('proDescription') || "Get unlimited access to all advanced AI tools and premium support."}
             </p>
             <button className="mt-2 bg-[#4DA3FF] hover:bg-[#3B82F6] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                {t('upgradeNow') || "Upgrade Now"}
             </button>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA3FF]/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -ml-10 -mb-10" />
       </div>
    </div>
  );
};
