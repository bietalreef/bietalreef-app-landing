import { Building2, MapPin, Bed, Bath, Maximize2, TrendingUp, Heart, Share2, Phone, Search, SlidersHorizontal, Grid3x3, List, Map, ChevronDown, X, Calendar, Eye, Camera, CheckCircle2, Sparkles, ArrowUpDown, Home, Key, Building, Landmark, Calculator } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../contexts/LanguageContext';
import { supabase } from '../../utils/supabase/client';
import { toast } from 'sonner';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'price-high' | 'price-low' | 'area-high' | 'area-low';
type MainTab = 'sale' | 'rent' | 'short-rent' | 'commercial' | 'land';

interface RealEstateScreenProps {
  activeTab?: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers';
  onTabChange?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
  onOpenSearch?: () => void;
  onOpenDrawer?: () => void;
}

export function RealEstateScreen({ activeTab = 'realestate', onTabChange, onOpenSearch, onOpenDrawer }: RealEstateScreenProps = {}) {
  const { t, dir } = useTranslation('realEstate');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [mainTab, setMainTab] = useState<MainTab>('sale');

  // Real Data State
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        // Attempt to fetch from 'real_estate' or 'properties' table
        // Similar to Shop, we assume empty if table doesn't exist
        const { data, error } = await supabase
            .from('real_estate_listings') // Hypothetical table name
            .select('*')
            .eq('listing_type', mainTab); // e.g. 'sale', 'rent'
        
        if (error && error.code !== '42P01' && error.code !== 'PGRST205') {
            // Log if it's a real error, but ignore 'table not found'
            console.error('Error fetching real estate:', error);
        }

        setProperties(data || []);
      } catch (err) {
        console.log("Real estate fetch simplified error:", err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [mainTab]);

  const mainTabs = [
    { id: 'sale' as MainTab, label: t('sale'), icon: Home },
    { id: 'rent' as MainTab, label: t('rent'), icon: Key },
    { id: 'short-rent' as MainTab, label: t('shortRent'), icon: Calendar },
    { id: 'commercial' as MainTab, label: t('commercial'), icon: Building },
    { id: 'land' as MainTab, label: t('land'), icon: Landmark },
  ];

  const propertyTypes = [
    { id: 'all', label: t('all') },
    { id: t('villa'), label: t('villa') },
    { id: t('apartment'), label: t('apartment') },
    { id: t('penthouse'), label: t('penthouse') },
    { id: t('studio'), label: t('studio') },
    { id: t('townhouse'), label: t('townhouse') },
  ];

  const quickFilters = [
    { id: 'featured', label: t('featured'), icon: Sparkles },
    { id: 'new', label: t('new'), icon: TrendingUp },
    { id: 'virtual', label: t('virtualTour'), icon: Eye },
    { id: 'verified', label: t('verified'), icon: CheckCircle2 },
  ];

  const sortOptions = [
    { id: 'newest', label: t('newest') },
    { id: 'price-high', label: t('priceHigh') },
    { id: 'price-low', label: t('priceLow') },
    { id: 'area-high', label: t('areaHigh') },
    { id: 'area-low', label: t('areaLow') },
  ];

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
    <div className="w-full" dir={dir}>
      {/* Header - Sticky */}
      <div className="sticky top-0 z-30 bg-gradient-to-br from-[#4A90E2] via-[#56CCF2] to-[#4A90E2] px-5 pt-6 pb-4 rounded-b-[32px] shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '26px', lineHeight: 1.2 }}>
              {t('realEstate')}
            </h1>
            <p className="text-white/90 text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {loading ? '...' : properties.length} {t('propertiesAvailable')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all ${
                viewMode === 'grid' ? 'bg-white text-[#4A90E2]' : 'bg-white/20 text-white'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all ${
                viewMode === 'list' ? 'bg-white text-[#4A90E2]' : 'bg-white/20 text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Category Tabs */}
        <div className="mb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setMainTab(tab.id);
                    setSelectedType('all');
                  }}
                  className={`px-4 py-2.5 rounded-[16px] whitespace-nowrap flex items-center gap-2 transition-all shadow-md ${
                    mainTab === tab.id
                      ? 'bg-white text-[#4A90E2]'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px' }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Filters Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickFilters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-[14px] text-xs whitespace-nowrap flex items-center gap-2 hover:bg-white/30 transition-all shadow-md"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Sort Bar - Sticky under header */}
      <div className="sticky top-[260px] z-20 bg-white px-5 py-4 shadow-md border-b-2 border-[#F5EEE1]">
        <div className="flex items-center gap-3">
          {/* Property Types Tabs */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2.5 rounded-[14px] text-xs whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
                    selectedType === type.id
                      ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white'
                      : 'bg-[#F5EEE1] text-[#1A1A1A]/70 hover:bg-[#4A90E2]/10'
                  }`}
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-11 h-11 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[14px] flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <ArrowUpDown className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Sort Options Dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 bg-[#F5EEE1] rounded-[20px] p-4 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                  {t('sortBy')}
                </span>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-[#1A1A1A]/50" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id as SortOption);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-3 rounded-[14px] text-xs transition-all ${
                      sortBy === option.id
                        ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
                        : 'bg-white text-[#1A1A1A]/70 hover:bg-[#4A90E2]/10'
                    }`}
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Properties Grid/List */}
      <div className="px-5 py-6">
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[28px] animate-pulse" />)}
             </div>
        ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-60">
                 <Building2 className="w-16 h-16 text-slate-300 mb-4" />
                 <h3 className="text-lg font-bold text-slate-500" style={{ fontFamily: 'Cairo, sans-serif' }}>لا توجد عقارات حالياً</h3>
                 <p className="text-sm text-slate-400" style={{ fontFamily: 'Cairo, sans-serif' }}>سيتم إضافة عقارات قريباً</p>
             </div>
        ) : (
            <motion.div 
            layout
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-4'}
            >
            {properties.map((property) => (
                <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative bg-white rounded-[28px] overflow-hidden shadow-lg border-2 border-[#F5EEE1] hover:border-[#4A90E2]/30 transition-all ${
                    viewMode === 'list' ? 'flex' : ''
                }`}
                >
                {/* Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-[140px] flex-shrink-0' : 'h-[220px]'}`}>
                    <ImageWithFallback 
                    src={property.image || 'https://via.placeholder.com/300'}
                    alt={t(property.title || 'Property')}
                    className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Price Badge */}
                    <div className={`absolute top-3 ${dir === 'rtl' ? 'left-3' : 'right-3'} bg-white/95 backdrop-blur-sm px-4 py-2 rounded-[16px] shadow-xl`}>
                    <span className="text-[#4A90E2]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '15px' }}>
                        {property.price}
                    </span>
                    <span className={`text-[#1A1A1A]/60 text-xs ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        {t('aed')}
                    </span>
                    </div>

                    {viewMode === 'grid' && (
                    <div className={`absolute bottom-3 ${dir === 'rtl' ? 'right-3' : 'left-3'}`}>
                        <h3 className="text-white mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '17px', lineHeight: 1.3 }}>
                        {property.title}
                        </h3>
                        <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-white/90" />
                        <span className="text-white/95 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            {property.location || 'Dubai'}
                        </span>
                        </div>
                    </div>
                    )}
                </div>

                {/* Details */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    {viewMode === 'list' && (
                    <div className="mb-3">
                        <h3 className="text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px', lineHeight: 1.3 }}>
                        {property.title}
                        </h3>
                    </div>
                    )}

                    {/* Property Stats */}
                    <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 bg-[#4A90E2]/10 rounded-[10px] flex items-center justify-center">
                        <Bed className="w-4 h-4 text-[#4A90E2]" />
                        </div>
                        <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px' }}>
                        {property.bedrooms || 0}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 bg-[#4A90E2]/10 rounded-[10px] flex items-center justify-center">
                        <Bath className="w-4 h-4 text-[#4A90E2]" />
                        </div>
                        <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px' }}>
                        {property.bathrooms || 0}
                        </span>
                    </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                    <button className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-4 py-3 rounded-[16px] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px' }}>
                        <Phone className="w-4 h-4" />
                        {t('call')}
                    </button>
                    </div>
                </div>
                </motion.div>
            ))}
            </motion.div>
        )}
      </div>
    </div>
  );
}
