import { useState, useEffect, useCallback } from 'react';
import { Search, X, MapPin, Clock, TrendingUp, Map, ChevronLeft, Mic, Filter, Star, DollarSign, CheckCircle, Zap, SlidersHorizontal, ChevronRight, Building2, Package, Wrench, HardHat } from 'lucide-react';
import { 
  searchAll, 
  SearchResult, 
  SearchFilters, 
  POPULAR_SEARCHES, 
  TRENDING_SEARCHES, 
  QUICK_CATEGORIES, 
  UAE_CITIES 
} from '../../data/searchData';
import { useSearchStore } from '../../stores/search-store';

interface FullSearchScreenProps {
  onClose?: () => void;
  context?: string; // 'home', 'services', 'realEstate', 'maps', 'store', 'service:serviceName'
  onNavigate?: (route: string, serviceId?: string) => void;
}

export function FullSearchScreen({ onClose, context: propContext, onNavigate }: FullSearchScreenProps) {
  const { scope, setOpen } = useSearchStore();
  const context = propContext || (scope === 'GLOBAL' ? 'home' : scope?.toLowerCase() || 'home');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'name' | 'map' | 'area'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({
    rating: 0,
    priceRange: 'all',
    verified: false,
    availability: 'all',
    type: 'all'
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(POPULAR_SEARCHES.slice(0, 4));
  const [selectedArea, setSelectedArea] = useState<string>('');

  // استخراج serviceCategory من context إذا كان موجوداً
  const serviceCategory = context?.startsWith('service:') ? context.replace('service:', '') : undefined;

  // البحث التلقائي عند تغيير النص أو الفلاتر
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300); // تأخير 300ms لتحسين الأداء

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedFilters, serviceCategory]);

  // دالة البحث الرئيسية
  const performSearch = useCallback(() => {
    if (!searchQuery.trim() && Object.values(selectedFilters).every(v => !v || v === 'all' || v === 0)) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // البحث مع الفلاتر
    let query = searchQuery;
    
    // إذا كانت هناك فئة خدمة محددة، أضفها للبحث
    if (serviceCategory) {
      query = serviceCategory + ' ' + query;
    }

    const results = searchAll(query.trim(), selectedFilters);
    setSearchResults(results);
    setIsSearching(false);
  }, [searchQuery, selectedFilters, serviceCategory]);

  // مسح البحث
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedFilters({
      rating: 0,
      priceRange: 'all',
      verified: false,
      availability: 'all',
      type: 'all'
    });
  };

  // مسح الفلاتر فقط
  const handleClearFilters = () => {
    setSelectedFilters({
      rating: 0,
      priceRange: 'all',
      verified: false,
      availability: 'all',
      type: 'all'
    });
  };

  // اختيار اقتراح بحث
  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    
    // إضافة للسجل
    setRecentSearches(prev => {
      const newRecent = [suggestion, ...prev.filter(s => s !== suggestion)].slice(0, 6);
      return newRecent;
    });
  };

  // اختيار تصنيف سريع
  const handleSelectCategory = (categoryQuery: string) => {
    setSearchQuery(categoryQuery);
  };

  // اختيار منطقة
  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    setSearchQuery(prev => {
      const withoutArea = prev.split(' في ')[0];
      return `${withoutArea} في ${area}`.trim();
    });
  };

  // البحث الصوتي (محاكاة)
  const handleVoiceSearch = () => {
    // في الإنتاج، سيتم دمج Web Speech API
    alert('البحث الصوتي قريباً! 🎤');
  };

  // فتح الخريطة
  const handleOpenMap = () => {
    // التنقل لصفحة الخرائط
    if (onNavigate) {
      onNavigate('/maps');
    }
    if (onClose) {
      onClose();
    }
    setOpen(false);
  };

  // اختيار نتيجة بحث
  const handleSelectResult = (result: SearchResult) => {
    // حفظ في السجل
    setRecentSearches(prev => {
      const newRecent = [result.titleAr, ...prev.filter(s => s !== result.titleAr)].slice(0, 6);
      return newRecent;
    });

    // التنقل حسب نوع النتيجة
    if (result.type === 'service' && result.serviceId && onNavigate) {
      onNavigate('service', result.serviceId);
    } else if (result.type === 'product' && onNavigate) {
      onNavigate('shop', result.id);
    } else if (result.type === 'provider' && onNavigate) {
      onNavigate('provider', result.id);
    }

    // إغلاق شاشة البحث
    if (onClose) {
      onClose();
    }
    setOpen(false);
  };

  // عدد الفلاتر النشطة
  const activeFiltersCount = Object.entries(selectedFilters).filter(
    ([key, value]) => value && value !== 'all' && value !== 0
  ).length;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto" dir="rtl">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] px-5 py-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => {
              if (onClose) onClose();
              setOpen(false);
            }}
            className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-[16px] flex items-center justify-center hover:bg-white/30 transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white flex-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
            {serviceCategory ? `البحث في ${serviceCategory}` : 'البحث الذكي'}
          </h1>
        </div>

        {/* Search Input */}
        <div className="bg-white rounded-[24px] px-5 py-3.5 flex items-center gap-3 shadow-xl">
          <Search className="w-5 h-5 text-[#4A90E2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن خدمة، مزود، أو منتج..."
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-[#1A1A1A] placeholder:text-[#1A1A1A]/50"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '16px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                performSearch();
              }
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="p-1 hover:bg-[#F5EEE1] rounded-lg transition-all active:scale-95"
            >
              <X className="w-5 h-5 text-[#1A1A1A]/50" />
            </button>
          )}
          <button 
            onClick={handleVoiceSearch}
            className="p-2 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[12px] shadow-md active:scale-95 transition-all"
          >
            <Mic className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* مسح الكل */}
        {(searchQuery || activeFiltersCount > 0) && (
          <button
            onClick={handleClearSearch}
            className="w-full mt-3 bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-[14px] hover:bg-white/30 transition-all active:scale-95"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
          >
            مسح الكل
          </button>
        )}
      </div>

      {/* Search Modes */}
      <div className="px-5 py-5 bg-[#F5EEE1]/50 border-b-2 border-[#F5EEE1]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchMode('name')}
            className={`flex-1 py-3 px-4 rounded-[18px] transition-all shadow-md active:scale-95 ${
              searchMode === 'name'
                ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white'
                : 'bg-white text-[#1A1A1A]'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
          >
            <div className="flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              <span>بالاسم</span>
            </div>
          </button>
          <button
            onClick={() => {
              setSearchMode('map');
              handleOpenMap();
            }}
            className={`flex-1 py-3 px-4 rounded-[18px] transition-all shadow-md active:scale-95 ${
              searchMode === 'map'
                ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white'
                : 'bg-white text-[#1A1A1A]'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
          >
            <div className="flex items-center justify-center gap-2">
              <Map className="w-4 h-4" />
              <span>بالخريطة</span>
            </div>
          </button>
          <button
            onClick={() => setSearchMode('area')}
            className={`flex-1 py-3 px-4 rounded-[18px] transition-all shadow-md active:scale-95 ${
              searchMode === 'area'
                ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white'
                : 'bg-white text-[#1A1A1A]'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
          >
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>بالمنطقة</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6">
        
        {/* Advanced Filters Button */}
        <div className="mb-6">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white rounded-[24px] px-6 py-4 shadow-lg flex items-center justify-between hover:shadow-xl transition-all active:scale-95"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-[14px] flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <span>فلاتر متقدمة</span>
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronLeft className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
            </div>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-[28px] p-6 shadow-xl border-2 border-[#F5EEE1]">
            
            {/* نوع النتيجة */}
            <div className="mb-6">
              <h4 className="text-[#1A1A1A] mb-3 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}>
                <Filter className="w-5 h-5 text-[#4A90E2]" />
                <span>نوع النتيجة</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'الكل', icon: <Filter className="w-4 h-4" /> },
                  { id: 'service', label: 'خدمات', icon: <Wrench className="w-4 h-4" /> },
                  { id: 'provider', label: 'مزودين', icon: <Building2 className="w-4 h-4" /> },
                  { id: 'product', label: 'منتجات', icon: <Package className="w-4 h-4" /> }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedFilters({ ...selectedFilters, type: type.id as any })}
                    className={`px-4 py-3 rounded-[16px] flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      selectedFilters.type === type.id
                        ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
                        : 'bg-[#F5EEE1] text-[#1A1A1A]'
                    }`}
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h4 className="text-[#1A1A1A] mb-3 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}>
                <Star className="w-5 h-5 text-[#4A90E2]" />
                <span>التقييم</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {[5, 4, 3, 2, 1, 0].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedFilters({ ...selectedFilters, rating: rating === selectedFilters.rating ? 0 : rating })}
                    className={`px-4 py-2.5 rounded-[14px] flex items-center gap-2 transition-all active:scale-95 ${
                      selectedFilters.rating === rating
                        ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
                        : 'bg-[#F5EEE1] text-[#1A1A1A]'
                    }`}
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
                  >
                    <Star className={`w-4 h-4 ${selectedFilters.rating === rating ? 'fill-white' : 'fill-[#4A90E2] text-[#4A90E2]'}`} />
                    <span>{rating === 0 ? 'الكل' : `${rating}+`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="text-[#1A1A1A] mb-3 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}>
                <DollarSign className="w-5 h-5 text-[#4A90E2]" />
                <span>السعر</span>
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'الكل', icon: '🔍' },
                  { id: 'budget', label: 'اقتصادي', icon: '💰' },
                  { id: 'mid', label: 'متوسط', icon: '💵' },
                  { id: 'premium', label: 'فاخر', icon: '💎' }
                ].map((price) => (
                  <button
                    key={price.id}
                    onClick={() => setSelectedFilters({ ...selectedFilters, priceRange: price.id as any })}
                    className={`px-3 py-3 rounded-[16px] transition-all active:scale-95 ${
                      selectedFilters.priceRange === price.id
                        ? 'bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
                        : 'bg-[#F5EEE1] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">{price.icon}</span>
                      <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '11px' }}>
                        {price.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Verified & Availability */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setSelectedFilters({ ...selectedFilters, verified: !selectedFilters.verified })}
                className={`px-4 py-3.5 rounded-[16px] flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  selectedFilters.verified
                    ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
                    : 'bg-[#F5EEE1] text-[#1A1A1A]'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
              >
                <CheckCircle className="w-4 h-4" />
                <span>موثق فقط</span>
              </button>
              <button
                onClick={() => setSelectedFilters({ 
                  ...selectedFilters, 
                  availability: selectedFilters.availability === 'online' ? 'all' : 'online' 
                })}
                className={`px-4 py-3.5 rounded-[16px] flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  selectedFilters.availability === 'online'
                    ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
                    : 'bg-[#F5EEE1] text-[#1A1A1A]'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
              >
                <Zap className="w-4 h-4" />
                <span>متاح الآن</span>
              </button>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="w-full bg-[#F5EEE1] text-[#4A90E2] px-6 py-3 rounded-[16px] hover:bg-[#4A90E2]/10 transition-all active:scale-95"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
              >
                مسح الفلاتر ({activeFiltersCount})
              </button>
            )}
          </div>
        )}

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#1A1A1A] mb-3 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
              <Search className="w-5 h-5 text-[#4A90E2]" />
              <span>نتائج البحث ({searchResults.length})</span>
            </h3>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className="w-full bg-white rounded-[20px] p-4 shadow-md hover:shadow-lg transition-all border-2 border-[#F5EEE1] hover:border-[#4A90E2]/30 active:scale-98"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon/Image */}
                    {result.image ? (
                      <div className="w-16 h-16 rounded-[14px] overflow-hidden flex-shrink-0 bg-[#F5EEE1]">
                        <img src={result.image} alt={result.titleAr} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-[14px] bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] flex items-center justify-center text-3xl flex-shrink-0">
                        {result.icon || '🔍'}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 text-right">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '16px' }}>
                          {result.titleAr}
                        </h4>
                        <ChevronLeft className="w-5 h-5 text-[#1A1A1A]/30 flex-shrink-0" />
                      </div>
                      
                      <p className="text-[#1A1A1A]/70 text-sm mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500 }}>
                        {result.descriptionAr}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Type Badge */}
                        <span className="px-2 py-1 bg-[#F5EEE1] rounded-lg text-xs flex items-center gap-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                          {result.type === 'service' ? (
                            <><Wrench className="w-3 h-3 text-[#4A90E2]" /> خدمة</>
                          ) : result.type === 'provider' ? (
                            <><HardHat className="w-3 h-3 text-[#2AA676]" /> مزود</>
                          ) : (
                            <><Package className="w-3 h-3 text-[#F2994A]" /> منتج</>
                          )}
                        </span>

                        {/* Rating */}
                        {result.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                              {result.rating}
                            </span>
                            {result.reviews && (
                              <span className="text-xs text-[#1A1A1A]/50" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500 }}>
                                ({result.reviews})
                              </span>
                            )}
                          </div>
                        )}

                        {/* Price */}
                        {result.price && (
                          <span className="text-[#4A90E2] text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                            {result.price} درهم
                          </span>
                        )}

                        {/* Distance */}
                        {result.distance && (
                          <div className="flex items-center gap-1 text-[#1A1A1A]/60">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                              {result.distance}
                            </span>
                          </div>
                        )}

                        {/* Verified */}
                        {result.verified && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-[#4A90E2]" />
                            <span className="text-xs text-[#4A90E2]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                              موثق
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="mb-6 bg-white rounded-[24px] p-8 text-center shadow-md">
            <Search className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
            <h3 className="text-[#1A1A1A] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
              لا توجد نتائج
            </h3>
            <p className="text-[#1A1A1A]/60 mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
              جرب كلمات بحث أخرى أو استخدم الفلاتر
            </p>
            <button
              onClick={handleClearSearch}
              className="bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-6 py-3 rounded-[16px] shadow-md active:scale-95 transition-all"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
            >
              مسح البحث
            </button>
          </div>
        )}

        {/* Quick Search Chips - فقط إذا لم يكن هناك نتائج */}
        {!searchQuery && (
          <>
            <div className="mb-6">
              <h3 className="text-[#1A1A1A] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                بحث سريع
              </h3>
              <div className="flex flex-wrap gap-2">
                {QUICK_CATEGORIES.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => handleSelectCategory(chip.searchQuery)}
                    className="flex items-center gap-2 bg-white border-2 border-[#F5EEE1] px-4 py-2.5 rounded-[16px] shadow-sm hover:shadow-md hover:border-[#4A90E2]/20 transition-all active:scale-95"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
                  >
                    <span>{chip.icon}</span>
                    <span className="text-[#1A1A1A]">{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {searchMode === 'name' && recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                    عمليات بحث سابقة
                  </h3>
                  <button 
                    onClick={() => setRecentSearches([])}
                    className="text-[#4A90E2] text-sm active:scale-95 transition-all" 
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
                  >
                    مسح الكل
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(search)}
                      className="w-full bg-white rounded-[18px] px-5 py-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all border-2 border-[#F5EEE1] hover:border-[#4A90E2]/20 active:scale-98"
                    >
                      <Clock className="w-5 h-5 text-[#1A1A1A]/40" />
                      <span className="flex-1 text-right text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}>
                        {search}
                      </span>
                      <ChevronLeft className="w-5 h-5 text-[#1A1A1A]/30" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Area Search */}
            {searchMode === 'area' && (
              <div className="mb-6">
                <h3 className="text-[#1A1A1A] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  اختر المنطقة
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {UAE_CITIES.map((area, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectArea(area)}
                      className={`rounded-[20px] px-5 py-4 shadow-md hover:shadow-lg transition-all border-2 active:scale-95 ${
                        selectedArea === area
                          ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white border-[#4A90E2]'
                          : 'bg-white border-[#F5EEE1] hover:border-[#4A90E2]/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className={`w-5 h-5 ${selectedArea === area ? 'text-white' : 'text-[#4A90E2]'}`} />
                        <span className={selectedArea === area ? 'text-white' : 'text-[#1A1A1A]'} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                          {area}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending */}
            <div className="mb-6">
              <h3 className="text-[#1A1A1A] mb-3 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                <TrendingUp className="w-5 h-5 text-[#4A90E2]" />
                <span>الأكثر بحثاً اليوم</span>
              </h3>
              <div className="bg-white rounded-[20px] p-5 shadow-md border-2 border-[#F5EEE1]">
                <div className="space-y-3">
                  {TRENDING_SEARCHES.slice(0, 5).map((trend, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(trend)}
                      className="w-full flex items-center gap-3 hover:bg-[#F5EEE1]/50 p-2 rounded-lg transition-all active:scale-98"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '14px' }}>
                          {idx + 1}
                        </span>
                      </div>
                      <span className="flex-1 text-right text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}>
                        {trend}
                      </span>
                      <ChevronLeft className="w-5 h-5 text-[#1A1A1A]/30" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}