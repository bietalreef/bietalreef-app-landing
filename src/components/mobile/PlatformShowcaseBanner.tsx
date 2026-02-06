import { useNavigate } from 'react-router';
import { Crown, ChevronLeft, Shield, Video, FolderKanban, Wallet as WalletIcon, Sparkles, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../../contexts/LanguageContext';

// App screenshots
import screenshotHome from 'figma:asset/26d7eae296508fa5edee6b6abbff0d133c0ef3f5.png';
import screenshotDashboard from 'figma:asset/2a69f0cd081d8f1644f098152c707686afe3a976.png';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface PlatformShowcaseBannerProps {
  variant?: 'full' | 'compact' | 'mini';
  className?: string;
}

export function PlatformShowcaseBanner({ variant = 'full', className = '' }: PlatformShowcaseBannerProps) {
  const navigate = useNavigate();
  const { language } = useTranslation('common');
  const isEn = language === 'en';

  if (variant === 'mini') {
    return (
      <div className={`px-5 ${className}`}>
        <button
          onClick={() => navigate('/platform')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden border border-[#E6DCC8]"
        >
          <div className="absolute top-0 left-0 w-16 h-16 bg-[#2AA676]/8 rounded-full blur-xl" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-[#1F3D2B] font-bold text-sm" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
                {isEn ? 'Explore Features' : 'اكتشف المميزات'}
              </h3>
              <p className="text-[#1F3D2B]/40 text-[10px]" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
                {isEn ? 'AI • Projects • Wallet' : 'ذكاء اصطناعي • مشاريع • محفظة'}
              </p>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#2AA676] group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`px-5 ${className}`}>
        <button
          onClick={() => navigate('/platform')}
          className="w-full bg-white rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden border border-[#E6DCC8]"
        >
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#2AA676]/8 rounded-full blur-2xl group-hover:bg-[#2AA676]/12 transition-all" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#C8A86A]/8 rounded-full blur-2xl" />
          
          <div className="relative flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] rounded-2xl flex items-center justify-center shadow-lg">
                <div className="grid grid-cols-2 gap-1">
                  <Video className="w-4 h-4 text-white/80" />
                  <FolderKanban className="w-4 h-4 text-white/80" />
                  <WalletIcon className="w-4 h-4 text-[#C8A86A]" />
                  <Shield className="w-4 h-4 text-white/80" />
                </div>
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Crown className="w-4 h-4 text-[#C8A86A]" />
                <h3 className="text-[#1F3D2B] font-bold text-base" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
                  {isEn ? 'Explore Beit Al Reef Features' : 'اكتشف مميزات بيت الريف'}
                </h3>
              </div>
              <p className="text-[#1F3D2B]/50 text-xs leading-relaxed" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
                {isEn
                  ? 'AI Video Creator • Project Management • Financial Center • Verification & more'
                  : 'AI Video Creator • إدارة مشاريع • مركز مالي • نظام توثيق وأكثر'
                }
              </p>
            </div>
            <ChevronLeft className="w-5 h-5 text-[#2AA676] flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    );
  }

  // Full variant - with screenshots
  return (
    <div className={`px-5 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate('/platform')}
          className="w-full text-right bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all group relative border border-[#E6DCC8]"
        >
          {/* Glow */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#2AA676]/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-28 h-28 bg-[#C8A86A]/5 rounded-full blur-3xl" />

          <div className="relative p-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-[#2AA676]" />
              <span className="text-[#2AA676] text-[10px] font-bold uppercase tracking-wider">
                {isEn ? 'Platform Showcase' : 'عرض المنصة'}
              </span>
            </div>

            <div className="flex items-start gap-4">
              {/* Text Content */}
              <div className="flex-1">
                <h3 className="text-[#1F3D2B] font-black text-lg mb-1" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
                  {isEn ? 'Discover Beit Al Reef' : 'اكتشف بيت الريف'}
                </h3>
                <p className="text-[#1F3D2B]/50 text-xs mb-3 leading-relaxed" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
                  {isEn
                    ? '50+ professional tools for providers and clients'
                    : '+50 أداة احترافية لمزودي الخدمات والعملاء'
                  }
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    { icon: '🤖', text: isEn ? 'AI' : 'ذكاء' },
                    { icon: '📊', text: isEn ? 'Analytics' : 'تحليلات' },
                    { icon: '📋', text: isEn ? 'Tenders' : 'مناقصات' },
                    { icon: '🎬', text: isEn ? 'Video' : 'فيديو' },
                  ].map((pill, idx) => (
                    <span key={idx} className="bg-[#F5EEE1] border border-[#E6DCC8] text-[#1F3D2B]/70 text-[9px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                      <span>{pill.icon}</span>
                      {pill.text}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-[#2AA676] group-hover:text-[#1F3D2B] transition-colors">
                  <span className="text-xs font-bold" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
                    {isEn ? 'Explore Now' : 'اكتشف الآن'}
                  </span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Screenshots Preview */}
              <div className="flex-shrink-0 w-[100px] relative">
                <div className="relative">
                  <div className="rounded-xl overflow-hidden border border-[#E6DCC8] shadow-sm rotate-3 group-hover:rotate-1 transition-transform">
                    <ImageWithFallback
                      src={screenshotHome}
                      alt=""
                      className="w-full h-auto object-cover"
                      style={{ maxHeight: '120px' }}
                    />
                  </div>
                  <div className="absolute top-4 -right-3 rounded-xl overflow-hidden border border-[#C8A86A]/20 shadow-sm -rotate-3 w-[80px] group-hover:-rotate-1 transition-transform">
                    <ImageWithFallback
                      src={screenshotDashboard}
                      alt=""
                      className="w-full h-auto object-cover"
                      style={{ maxHeight: '90px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
      </motion.div>
    </div>
  );
}