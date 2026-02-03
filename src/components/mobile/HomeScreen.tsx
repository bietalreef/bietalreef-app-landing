import { Search, ChevronRight, Star, MapPin, TrendingUp, Zap } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import logoImage from 'figma:asset/d512a20eff8d218ba0eff5a889eac0c02f3553c4.png';
import { ContractorIcon, ElectricityIcon, PlumbingIcon, PaintingIcon, CleaningIcon, EquipmentIcon, RealEstateIcon, Design3DIcon, ACIcon } from '../icons/ServiceIcons';
import { useTranslation } from '../../contexts/LanguageContext';

export function HomeScreen() {
  const { t, dir } = useTranslation('common');
  
  const categories = [
    { id: 1, name: t('contractors'), Icon: ContractorIcon, color: 'from-[#5B7FE8] to-[#7B5FE8]' },
    { id: 2, name: t('electricity'), Icon: ElectricityIcon, color: 'from-[#FFB800] to-[#FFA000]' },
    { id: 3, name: t('plumbing'), Icon: PlumbingIcon, color: 'from-[#0F6E4C] to-[#0D5A3E]' },
    { id: 4, name: t('painting'), Icon: PaintingIcon, color: 'from-[#FF6B9D] to-[#C44569]' },
    { id: 5, name: t('cleaning'), Icon: CleaningIcon, color: 'from-[#4FACFE] to-[#00F2FE]' },
    { id: 6, name: t('equipment'), Icon: EquipmentIcon, color: 'from-[#F7971E] to-[#FFD200]' },
    { id: 7, name: t('realEstate'), Icon: RealEstateIcon, color: 'from-[#667eea] to-[#764ba2]' },
    { id: 8, name: t('design3D'), Icon: Design3DIcon, color: 'from-[#C8A24A] to-[#D3A55A]' },
    { id: 9, name: t('ac'), Icon: ACIcon, color: 'from-[#56CCF2] to-[#2F80ED]' },
  ];

  const featuredCompanies = [
    {
      id: 1,
      name: dir === 'rtl' ? 'شركة البناء الحديث' : 'Modern Construction Company',
      rating: 4.9,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1762536859942-8076505f7c62?w=400',
      badge: t('verified'),
      location: t('dubai'),
      category: t('generalContracting'),
    },
    {
      id: 2,
      name: dir === 'rtl' ? 'مؤسسة الإتقان' : 'Perfection Foundation',
      rating: 5.0,
      reviews: 187,
      image: 'https://images.unsplash.com/photo-1659353589112-005e063abdaf?w=400',
      badge: t('featured'),
      location: t('abudhabi'),
      category: t('interiorDesign'),
    },
    {
      id: 3,
      name: dir === 'rtl' ? 'فريق الخبراء' : 'Experts Team',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1679797870465-b4eda40ead96?w=400',
      badge: t('fast'),
      location: t('sharjah'),
      category: t('comprehensiveMaintenance'),
    },
  ];

  return (
    <div className="flex-1 bg-[#F5EEE1] overflow-y-auto pb-24">
      {/* Offers Banner */}
      <div className="px-5 pt-6 mb-6">
        <div className="bg-gradient-to-r from-[#C8A24A] to-[#D3A55A] rounded-[32px] p-5 shadow-lg flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-white fill-white" />
              <span className="text-white text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                {t('specialOffer')}
              </span>
            </div>
            <h3 className="text-white text-base mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {t('firstConsultationFree')}
            </h3>
            <p className="text-white/90 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {t('withAnyCertifiedContractor')}
            </p>
          </div>
          <button className="bg-white text-[#C8A24A] px-4 py-2 rounded-full text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            {t('orderNow')}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#1A1A1A] text-base" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {t('services')}
          </h2>
          <button className="text-[#5B7FE8] text-xs flex items-center gap-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            <span>{t('more')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" dir={dir}>
          {categories.map((category) => {
            const Icon = category.Icon;
            return (
              <motion.button
                key={category.id}
                className="flex-shrink-0 w-[90px]"
                whileTap={{ scale: 0.95 }}
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-[28px] p-4 mb-2 shadow-md aspect-square flex items-center justify-center`}>
                  <Icon className="w-10 h-10" />
                </div>
                <p className="text-[#1A1A1A] text-xs text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  {category.name}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Featured Companies */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#1A1A1A] text-base" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {t('recommendedCompanies')}
          </h2>
          <button className="text-[#5B7FE8] text-xs flex items-center gap-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            <span>{t('viewAll')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {featuredCompanies.map((company) => (
            <motion.div
              key={company.id}
              className="bg-white rounded-[28px] p-4 shadow-md"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-[20px] overflow-hidden">
                    <ImageWithFallback 
                      src={company.image}
                      alt={company.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-gradient-to-br from-[#C8A24A] to-[#D3A55A] text-white text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                    {company.badge}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                    {company.name}
                  </h3>
                  <p className="text-[#5B7FE8] text-xs mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                    {company.category}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                      <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        {company.rating}
                      </span>
                      <span className="text-[#6B7280]">({company.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#6B7280]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span style={{ fontFamily: 'Cairo, sans-serif' }}>{company.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <h2 className="text-[#1A1A1A] text-base mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
          {t('quickActions')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white rounded-[24px] p-4 shadow-md flex flex-col items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#5B7FE8]" />
            <span className="text-[#1A1A1A] text-xs text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {t('requestQuote')}
            </span>
          </button>
          <button className="bg-white rounded-[24px] p-4 shadow-md flex flex-col items-center gap-2">
            <Zap className="w-6 h-6 text-[#C8A24A]" />
            <span className="text-[#1A1A1A] text-xs text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {t('aiConsultation')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
