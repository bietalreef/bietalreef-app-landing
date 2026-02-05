import { Wrench, Calculator, Ruler, Package, FileText, ClipboardList, DollarSign, Hammer } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { AIToolsDashboard } from './AIToolsDashboard';

interface ToolsScreenProps {
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

export function ToolsScreen({ onFullscreenToggle }: ToolsScreenProps) {
  const { t, dir } = useTranslation('tools');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1F3D2B] to-[#2AA676] px-5 py-8">
        <h1 className="text-white text-center mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '28px' }}>
          🛠️ {t('title')}
        </h1>
        <p className="text-white/90 text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px' }}>
          {t('subtitle')}
        </p>
      </div>

      {/* AI Tools Dashboard with 6 Categories */}
      <AIToolsDashboard onFullscreenToggle={onFullscreenToggle} />
    </div>
  );
}
