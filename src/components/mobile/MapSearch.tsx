import { useState } from 'react';
import { 
  Search, 
  Mic, 
  SlidersHorizontal,
  X,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Building2,
  Compass,
  Wrench,
  HardHat,
  Settings,
  Package,
  Armchair,
  Truck,
  Home,
  Sparkles,
} from 'lucide-react';

// ====================================
// 📌 Types & Interfaces
// ====================================

interface MapSearchProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: SearchFilters) => void;
  onVoiceSearch?: () => void;
}

interface SearchFilters {
  category?: string;
  distance?: number;
  minRating?: number;
  verifiedOnly?: boolean;
  availability?: 'now' | 'later' | 'all';
}

// ====================================
// 🔍 Map Search Component
// ====================================

export function MapSearch({
  onSearch,
  onFilterChange,
  onVoiceSearch,
}: MapSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullSearch, setShowFullSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Filter states
  const [filters, setFilters] = useState<SearchFilters>({
    category: undefined,
    distance: 50,
    minRating: 0,
    verifiedOnly: false,
    availability: 'all',
  });

  // ====================================
  // 📋 Categories & Recent Searches
  // ====================================
  
  const categories = [
    { id: 'all', label: 'الكل', Icon: Sparkles, color: '#2AA676' },
    { id: 'construction', label: 'مقاولات', Icon: Building2, color: '#1F3D2B' },
    { id: 'engineering', label: 'استشارات هندسية', Icon: Compass, color: '#4A90E2' },
    { id: 'maintenance', label: 'شركات صيانة', Icon: Wrench, color: '#F59E0B' },
    { id: 'craftsmen', label: 'العمالة الحرفية', Icon: HardHat, color: '#EF4444' },
    { id: 'workshops', label: 'الورش', Icon: Settings, color: '#6B7280' },
    { id: 'building-materials', label: 'مواد البناء', Icon: Package, color: '#D97706' },
    { id: 'furniture', label: 'الأثاث والديكور', Icon: Armchair, color: '#8B5CF6' },
    { id: 'equipment', label: 'تأجير معدات', Icon: Truck, color: '#059669' },
    { id: 'realestate', label: 'عقارات', Icon: Home, color: '#0EA5E9' },
    { id: 'cleaning', label: 'خدمات النظافة', Icon: Sparkles, color: '#14B8A6' },
  ];

  const recentSearches = [
    'سباكة',
    'كهرباء',
    'مواد بناء',
    'ورش صيانة',
  ];

  const suggestedCategories = [
    'سباكة',
    'كهرباء',
    'دهانات',
    'نجارة',
    'حدادة',
    'تكييف',
  ];

  // ====================================
  // 🎯 Handlers
  // ====================================
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleFilterUpdate = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    if (onFilterChange) {
      onFilterChange(updated);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    handleFilterUpdate({ category: categoryId === 'all' ? undefined : categoryId });
  };

  // ====================================
  // 🎨 Render Simple Search Bar
  // ====================================
  
  if (!showFullSearch) {
    return (
      <div className="w-full" dir="rtl">
        {/* Search Bar */}
        <div className="px-4 py-3 bg-white border-b border-[#F5EEE1]">
          <div className="flex items-center gap-2 bg-[#F5EEE1] rounded-full px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            
            <input
              type="text"
              placeholder="ابحث عن مزود أو محل بالقرب منك…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowFullSearch(true)}
              className="flex-1 bg-transparent outline-none text-[#1F3D2B] placeholder:text-gray-400 text-right"
            />
            
            <button
              onClick={onVoiceSearch}
              className="flex-shrink-0 text-[#2AA676] hover:text-[#1F3D2B] transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0 text-[#2AA676] hover:text-[#1F3D2B] transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="px-4 py-3 bg-white border-b border-[#F5EEE1] overflow-x-auto">
          <div className="flex gap-2 whitespace-nowrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white'
                    : 'bg-[#F5EEE1] text-[#1F3D2B] hover:bg-[#2AA676]/10'
                }`}
              >
                <cat.Icon className="w-3.5 h-3.5" style={{ color: selectedCategory === cat.id ? 'white' : cat.color }} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-4 py-4 bg-white border-b border-[#F5EEE1] space-y-4">
            {/* Distance Slider */}
            <div>
              <label className="block text-sm font-semibold text-[#1F3D2B] mb-2">
                المسافة: {filters.distance} كم
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={filters.distance}
                onChange={(e) => handleFilterUpdate({ distance: parseInt(e.target.value) })}
                className="w-full h-2 bg-[#F5EEE1] rounded-lg appearance-none cursor-pointer accent-[#2AA676]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 كم</span>
                <span>100 كم</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-semibold text-[#1F3D2B] mb-2">
                التقييم الأدنى
              </label>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleFilterUpdate({ minRating: rating })}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.minRating === rating
                        ? 'bg-[#C8A86A] text-white'
                        : 'bg-[#F5EEE1] text-[#1F3D2B]'
                    }`}
                  >
                    {rating === 0 ? 'الكل' : (
                      <span className="flex items-center gap-1">{rating}+ <Star className="w-3 h-3 fill-amber-400 text-amber-400" /></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Only */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1F3D2B]">
                مزودون موثّقون فقط
              </span>
              <button
                onClick={() => handleFilterUpdate({ verifiedOnly: !filters.verifiedOnly })}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  filters.verifiedOnly ? 'bg-[#2ECC71]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                    filters.verifiedOnly ? 'right-0.5' : 'right-6'
                  }`}
                />
              </button>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-semibold text-[#1F3D2B] mb-2">
                الحالة
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'now', label: 'متاح الآن' },
                  { id: 'later', label: 'متاح لاحقاً' },
                ].map((avail) => (
                  <button
                    key={avail.id}
                    onClick={() => handleFilterUpdate({ availability: avail.id as any })}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.availability === avail.id
                        ? 'bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white'
                        : 'bg-[#F5EEE1] text-[#1F3D2B]'
                    }`}
                  >
                    {avail.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Filters */}
            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-gradient-to-l from-[#4A90E2] to-[#56CCF2] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              تطبيق الفلاتر
            </button>
          </div>
        )}
      </div>
    );
  }

  // ====================================
  // 🎨 Render Full Search Screen
  // ====================================
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-[#F5EEE1] z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setShowFullSearch(false)}
            className="flex-shrink-0 text-[#1F3D2B] hover:text-[#2AA676] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex items-center gap-2 bg-[#F5EEE1] rounded-full px-4 py-2">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            
            <input
              type="text"
              placeholder="اكتب نوع الخدمة أو اسم النشاط…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent outline-none text-[#1F3D2B] placeholder:text-gray-400 text-right"
            />
            
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="flex-shrink-0 text-gray-400 hover:text-[#1F3D2B]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Near Me */}
        <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-l from-[#2AA676]/10 to-[#1F3D2B]/10 rounded-xl hover:from-[#2AA676]/20 hover:to-[#1F3D2B]/20 transition-colors">
          <div className="w-10 h-10 bg-[#2AA676] rounded-full flex items-center justify-center text-white">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1 text-right">
            <div className="font-semibold text-[#1F3D2B]">بالقرب مني</div>
            <div className="text-sm text-gray-500">اعرض المزودين القريبين من موقعك</div>
          </div>
        </button>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#1F3D2B]">عمليات البحث الأخيرة</h3>
              <button className="text-sm text-[#2AA676] hover:underline">
                مسح الكل
              </button>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(search)}
                  className="w-full flex items-center gap-3 p-3 bg-[#F5EEE1] rounded-xl hover:bg-[#2AA676]/10 transition-colors"
                >
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="flex-1 text-right text-[#1F3D2B]">{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Categories */}
        <div>
          <h3 className="font-semibold text-[#1F3D2B] mb-3">فئات مقترحة</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(cat)}
                className="px-4 py-2 bg-[#F5EEE1] text-[#1F3D2B] rounded-full text-sm hover:bg-gradient-to-l hover:from-[#2AA676] hover:to-[#1F3D2B] hover:text-white transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================
// 📦 Export Types
// ====================================

export type { SearchFilters, MapSearchProps };