import { toast } from 'sonner@2.0.3';
import { AlertCircle } from 'lucide-react';
import { MapSearch, SearchFilters } from './MapSearch';
import { useTranslation } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../contexts/LanguageContext';

export function MapsScreen() {
  const { t, dir } = useTranslation('maps');
  const { language } = useLanguage();
  const isEn = language === 'en';
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    toast.info(isEn ? 'Map search is currently unavailable' : 'البحث في الخريطة غير مفعل حالياً');
  };

  const handleFilterChange = (filters: SearchFilters) => {
    // Placeholder
  };

  return (
    <div className="min-h-screen bg-white relative pb-24" dir={dir}>
      
      {/* Search */}
      <MapSearch
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onVoiceSearch={() => {}}
      />

      {/* Map Placeholder */}
      <div className="relative h-[calc(100vh-280px)] flex items-center justify-center bg-[#F5EEE1]">
        <div className="text-center p-8 bg-white/80 rounded-2xl shadow-lg backdrop-blur-sm max-w-sm mx-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn ? 'Maps Under Maintenance' : 'الخرائط قيد الصيانة'}
            </h3>
            <p className="text-gray-600 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn 
                  ? 'We are currently updating the maps system for a better experience. Please try again later.'
                  : 'نعمل حالياً على تحديث نظام الخرائط لتقديم تجربة أفضل. يرجى المحاولة لاحقاً.'
                }
            </p>
            <button 
                onClick={() => navigate('/home')}
                className="bg-[#2AA676] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#1F3D2B] transition-colors"
                style={{ fontFamily: 'Cairo, sans-serif' }}
            >
                {isEn ? 'Back to Home' : 'العودة للرئيسية'}
            </button>
        </div>
      </div>
    </div>
  );
}
