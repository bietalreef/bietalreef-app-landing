import { useState } from 'react';
import { Star, MapPin, Heart } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTranslation } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router';

interface ServicesContentProps {
  onServiceClick?: (serviceId: string) => void;
  onOpenFullSearch?: () => void;
}

export function ServicesContent({ onServiceClick, onOpenFullSearch }: ServicesContentProps) {
  const { t, language } = useTranslation('services');
  const [activeFilter, setActiveFilter] = useState<'recommended' | 'offers' | 'nearby' | 'cheapest' | 'toprated'>('recommended');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // 9 Services - Categories
  const services = [
    { id: 'constructionContracting', name: t('constructionContracting'), icon: '🏗️', subsections: 4 },
    { id: 'engineeringConsultation', name: t('engineeringConsultation'), icon: '📐', subsections: 4 },
    { id: 'maintenance', name: t('maintenance'), icon: '🔧', subsections: 8 },
    { id: 'craftsmen', name: t('craftsmen'), icon: '👷', subsections: 8 },
    { id: 'workshops', name: t('workshops'), icon: '⚙️', subsections: 5 },
    { id: 'equipmentRental', name: t('equipmentRental'), icon: '🚜', subsections: 3 },
    { id: 'buildingMaterials', name: t('buildingMaterials'), icon: '🧱', subsections: 4 },
    { id: 'furnitureDecor', name: t('furnitureDecor'), icon: '🛋️', subsections: 4 },
    { id: 'cleaning', name: t('cleaning'), icon: '✨', subsections: 3 },
  ];

  // Demo providers (bilingual) - profiles table not yet configured
  const demoProviders = [
    {
      id: 'demo-srv-1',
      full_name: t('providers.ahmed.name'),
      specialty: t('providers.ahmed.service'),
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedSrv',
      is_verified: true,
      status: 'online',
      rating: 4.9,
      hourly_rate: 150,
      location: language === 'ar' ? 'دبي' : 'Dubai',
    },
    {
      id: 'demo-srv-2',
      full_name: t('providers.alnoor.name'),
      specialty: t('providers.alnoor.service'),
      avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=NE',
      is_verified: true,
      status: 'online',
      rating: 5.0,
      hourly_rate: 200,
      location: language === 'ar' ? 'أبوظبي' : 'Abu Dhabi',
    },
    {
      id: 'demo-srv-3',
      full_name: t('providers.khalid.name'),
      specialty: t('providers.khalid.service'),
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khalid',
      is_verified: false,
      status: 'busy',
      rating: 4.7,
      hourly_rate: 120,
      location: language === 'ar' ? 'الشارقة' : 'Sharjah',
    },
    {
      id: 'demo-srv-4',
      full_name: t('providers.colors.name'),
      specialty: t('providers.colors.service'),
      avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=BC',
      is_verified: true,
      status: 'online',
      rating: 4.8,
      hourly_rate: 180,
      location: language === 'ar' ? 'عجمان' : 'Ajman',
    },
  ];

  const filters = [
    { id: 'recommended', label: t('recommended'), icon: '⭐' },
    { id: 'offers', label: t('offers'), icon: '🔥' },
    { id: 'nearby', label: t('nearMe'), icon: '📍' },
    { id: 'cheapest', label: t('cheapest'), icon: '💰' },
    { id: 'toprated', label: t('topRated'), icon: '🏆' },
  ];

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-[#4A90E2]';
      case 'busy': return 'bg-[#F2994A]';
      case 'offline': return 'bg-[#EB5757]';
      default: return 'bg-[#6B7280]';
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'online': return t('online');
      case 'busy': return t('busy');
      case 'offline': return t('offline');
      default: return t('unavailable');
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#F5EEE1] to-white overflow-y-auto">
      
      {/* FILTER CHIPS */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap transition-all shadow-md ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white'
                  : 'bg-[#F5EEE1] text-[#1A1A1A] border-2 border-transparent'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px', height: '44px' }}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="px-5 py-2 pb-6">
        <h2 className="text-[#1A1A1A] mb-5" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
          {t('allServices')}
        </h2>

        {/* Responsive Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => navigate(`/services/${service.id}`)}
              className="group relative bg-white rounded-[24px] md:rounded-[28px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] transition-all border-2 border-transparent hover:border-[#4A90E2]/20 w-full"
              style={{ aspectRatio: '1/1.2' }}
            >
              <div className="w-full h-[70%] flex items-center justify-center bg-gradient-to-br from-[#F5EEE1] to-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-[#56CCF2]/10 group-hover:from-[#4A90E2]/10 group-hover:to-[#56CCF2]/20 transition-all" />
                <div className="relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-[16px] md:rounded-[20px] bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] flex items-center justify-center shadow-[0_8px_24px_rgba(74,144,226,0.4)] transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-2xl md:text-3xl relative z-10 filter drop-shadow-lg">{service.icon}</span>
                </div>
              </div>
              <div className="w-full h-[30%] flex items-center justify-center px-2 bg-white">
                <p className="text-[#1A1A1A] text-center line-clamp-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 'clamp(11px, 2vw, 13px)', lineHeight: 1.3 }}>
                  {service.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PROVIDER CARDS (Demo Data) */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
            {t('bestProviders')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoProviders.map((provider) => (
            <div
              key={provider.id}
              className="relative bg-white rounded-[28px] overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all border-2 border-[#F5EEE1]"
            >
              <div className="flex">
                {/* Image + Button + Price */}
                <div className="flex flex-col w-[140px] flex-shrink-0">
                  {/* Image */}
                  <div className="relative w-[140px] h-[120px] overflow-hidden">
                    <ImageWithFallback 
                      src={provider.avatar_url}
                      alt={provider.full_name}
                      className="w-full h-full object-cover"
                    />
                    {provider.is_verified && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className={`${getAvailabilityColor(provider.status)} text-white px-2 py-1 rounded-lg text-xs text-center shadow-md`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        {getAvailabilityText(provider.status)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Button */}
                  <div className="px-2 pt-2">
                    <button className="w-full bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-2 py-2 rounded-[14px] text-xs shadow-md hover:shadow-lg transition-all" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                      {t('viewDetails')}
                    </button>
                  </div>

                  {/* Price Box */}
                  <div className="px-2 pt-1.5 pb-2">
                    <div className="w-full bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[14px] py-2 px-2 shadow-md flex items-center justify-center gap-1">
                      <p className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: '18px', lineHeight: 1 }}>
                        {provider.hourly_rate}
                      </p>
                      <p className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '10px' }}>
                        {t('aed')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 p-4 flex flex-col">
                  <h3 className="text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '16px' }}>
                    {provider.full_name}
                  </h3>
                  <p className="text-[#1A1A1A]/70 text-sm mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                    {provider.specialty}
                  </p>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#56CCF2] text-[#56CCF2]" />
                      <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                        {provider.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#4A90E2]" />
                      <span className="text-[#1A1A1A]/70 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        {provider.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(provider.id);
                      }}
                      className="w-9 h-9 bg-white border-2 border-[#F5EEE1] rounded-[12px] flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                    >
                      <Heart className={`w-4.5 h-4.5 ${favorites.has(provider.id) ? 'fill-[#56CCF2] text-[#56CCF2]' : 'text-[#1A1A1A]/30'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-8" />

    </div>
  );
}