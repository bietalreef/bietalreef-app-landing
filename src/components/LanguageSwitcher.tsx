import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'icon';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleLanguage}
        className={`flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all ${className}`}
        title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      >
        <Globe className="w-5 h-5" />
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className={`flex items-center gap-1.5 px-3 py-1.5 bg-[#F5EEE1] text-[#1F3D2B] rounded-lg hover:bg-[#2AA676] hover:text-white transition-all ${className}`}
        style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}
      >
        <Globe className="w-4 h-4" />
        <span>{language === 'ar' ? 'EN' : 'ع'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#F5EEE1] rounded-xl hover:border-[#2AA676] hover:bg-[#F5EEE1] transition-all ${className}`}
      style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
    >
      <Globe className="w-5 h-5 text-[#2AA676]" />
      <span className="text-[#1F3D2B]">
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
}
