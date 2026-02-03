import { ShoppingBag, Star, Heart, ShoppingCart, Plus, Minus, Search, Grid3x3, List, Package, Truck, Award, Tag, Zap, Filter, TrendingUp, CheckCircle2, Box, Hammer, Paintbrush, Wrench, Sparkles, PercentCircle, Users, Store, ArrowUpDown, X, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../contexts/LanguageContext';
import { BottomNav } from './BottomNav';
import { supabase } from '../../utils/supabase/client';
import { toast } from 'sonner';

type ViewMode = 'grid' | 'list';
type MainTab = 'materials' | 'services' | 'suppliers' | 'deals';
type SortOption = 'newest' | 'price-high' | 'price-low' | 'rating' | 'popular';

interface ShopScreenProps {
  activeTab?: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers';
  onTabChange?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
  onOpenSearch?: () => void;
  onOpenDrawer?: () => void;
}

export function ShopScreen({ activeTab = 'shop', onTabChange, onOpenSearch, onOpenDrawer }: ShopScreenProps = {}) {
  const { t, dir } = useTranslation('shop');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mainTab, setMainTab] = useState<MainTab>('materials');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // Real Data State
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShopItems() {
      setLoading(true);
      try {
        // Attempt to fetch from a hypothetically existing 'items' or 'products' table
        // If it doesn't exist, this will error, and we catch it to show empty state.
        // We also try to fetch 'profiles' for suppliers tab.
        
        let data: any[] = [];
        let error = null;

        if (mainTab === 'suppliers') {
            const response = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'supplier');
            data = response.data || [];
            error = response.error;
        } else {
             // For materials, services, deals - we look for an 'items' table
             // Note: In a real scenario, we'd check if the table exists first or have a known schema.
             // Since we are cleaning hardcoded data, we assume empty if fetch fails.
             const response = await supabase
                .from('items') 
                .select('*')
                .eq('type', mainTab) // assuming 'type' column distinguishes materials/services
                .limit(20);
             
             if (response.error && response.error.code !== '42P01' && response.error.code !== 'PGRST205') { // 42P01 is undefined_table, PGRST205 is relation not found
                 // Real error
                 console.error("Error fetching items:", response.error);
             }
             data = response.data || [];
        }

        setProducts(data);

      } catch (err) {
        console.log("Shop fetch simplified error (expected if table missing):", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchShopItems();
  }, [mainTab]);


  const mainTabs = [
    { id: 'materials' as MainTab, label: t('buildingMaterials'), icon: Box },
    { id: 'services' as MainTab, label: t('services'), icon: Wrench },
    { id: 'suppliers' as MainTab, label: t('bestSuppliers'), icon: Award },
    { id: 'deals' as MainTab, label: t('bestDeals'), icon: PercentCircle },
  ];

  const categories = [
    { id: 'all', label: t('all') },
    { id: 'cement', label: t('cement') },
    { id: 'paints', label: t('paints') },
    { id: 'bricks', label: t('bricks') },
    { id: 'tiles', label: t('tiles') },
    { id: 'steel', label: t('steel') },
  ];

  const quickFilters = [
    { id: 'deals', label: t('offers'), icon: Tag },
    { id: 'instock', label: t('inStock'), icon: CheckCircle2 },
    { id: 'trending', label: t('trending'), icon: TrendingUp },
    { id: 'premium', label: t('premium'), icon: Sparkles },
  ];

  const sortOptions = [
    { id: 'popular', label: t('mostPopular') },
    { id: 'newest', label: t('newest') },
    { id: 'price-low', label: t('cheapest') },
    { id: 'price-high', label: t('expensive') },
    { id: 'rating', label: t('highestRated') },
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

  const addToCart = (id: string) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    toast.success('تمت الإضافة للسلة');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#F5EEE1] to-white" dir={dir}>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-gradient-to-br from-[#2AA676] via-[#3ABC89] to-[#2AA676] px-5 pt-4 pb-3 shadow-xl rounded-b-[32px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '26px', lineHeight: 1.2 }}>
                {t('title')}
              </h1>
              <p className="text-white/90 text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                {loading ? '...' : products.length} {t('productsAvailable')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all ${
                  viewMode === 'grid' ? 'bg-white text-[#2AA676]' : 'bg-white/20 text-white'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all ${
                  viewMode === 'list' ? 'bg-white text-[#2AA676]' : 'bg-white/20 text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Tabs */}
          <div className="mb-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {mainTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setMainTab(tab.id);
                      setSelectedCategory('all');
                    }}
                    className={`px-4 py-2.5 rounded-[16px] whitespace-nowrap flex items-center gap-2 transition-all shadow-md ${
                      mainTab === tab.id
                        ? 'bg-white text-[#2AA676]'
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

          {/* Quick Filters */}
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

        {/* Filters Bar */}
        {mainTab === 'materials' && (
          <div className="sticky top-[220px] z-20 bg-white px-5 py-4 shadow-md border-b-2 border-[#F5EEE1]">
            <div className="flex items-center gap-3">
              <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2.5 rounded-[14px] text-xs whitespace-nowrap transition-all shadow-sm ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-[#2AA676] to-[#3ABC89] text-white'
                          : 'bg-[#F5EEE1] text-[#1A1A1A]/70 hover:bg-[#2AA676]/10'
                      }`}
                      style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="w-11 h-11 bg-gradient-to-br from-[#2AA676] to-[#3ABC89] rounded-[14px] flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <ArrowUpDown className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Sort Dropdown */}
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
                            ? 'bg-gradient-to-r from-[#2AA676] to-[#3ABC89] text-white shadow-md'
                            : 'bg-white text-[#1A1A1A]/70 hover:bg-[#2AA676]/10'
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
        )}

        {/* Products Grid */}
        <div className="px-5 py-6">
          {loading ? (
             <div className="grid grid-cols-2 gap-4">
                 {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[24px] animate-pulse" />)}
             </div>
          ) : products.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-60">
                 <Store className="w-16 h-16 text-slate-300 mb-4" />
                 <h3 className="text-lg font-bold text-slate-500" style={{ fontFamily: 'Cairo, sans-serif' }}>لا توجد منتجات حالياً</h3>
                 <p className="text-sm text-slate-400" style={{ fontFamily: 'Cairo, sans-serif' }}>نحن نعمل على إضافة منتجات {t(mainTab === 'materials' ? 'buildingMaterials' : mainTab)}</p>
             </div>
          ) : (
            <motion.div 
                layout
                className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}
            >
                {products.map((product) => (
                <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative bg-white rounded-[24px] overflow-hidden shadow-lg border-2 border-[#F5EEE1] hover:border-[#2AA676]/30 transition-all ${
                    viewMode === 'list' ? 'flex' : ''
                    }`}
                >
                    {/* Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-[120px] flex-shrink-0' : 'h-[160px]'}`}>
                    <ImageWithFallback 
                        src={product.image || 'https://via.placeholder.com/150'}
                        alt={product.name || 'Product'}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`absolute bottom-2 ${dir === 'rtl' ? 'right-2' : 'left-2'} w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md`}
                    >
                        <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-[#2AA676] text-[#2AA676]' : 'text-[#1A1A1A]/30'}`} />
                    </button>
                    </div>

                    {/* Details */}
                    <div className="p-3 flex-1">
                    <h3 className="text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px', lineHeight: 1.3 }}>
                        {product.name || (product.email ? product.email.split('@')[0] : 'منتج')}
                    </h3>
                    <p className="text-[#1A1A1A]/60 text-xs mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        {product.category || 'عام'}
                    </p>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between mt-2">
                        {product.price && (
                        <div>
                            <span className="text-[#2AA676]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}>
                            {product.price}
                            </span>
                            <span className={`text-[#1A1A1A]/60 text-xs ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                            AED
                            </span>
                        </div>
                        )}
                        <button
                            onClick={() => addToCart(product.id)}
                            className="w-8 h-8 bg-[#2AA676] rounded-[10px] flex items-center justify-center shadow-md"
                        >
                            <Plus className="w-4 h-4 text-white" />
                        </button>
                    </div>
                    </div>
                </motion.div>
                ))}
            </motion.div>
          )}
        </div>

        {/* Floating Cart */}
        {cartCount > 0 && (
          <motion.button
            className={`fixed bottom-28 ${dir === 'rtl' ? 'left-5' : 'right-5'} w-14 h-14 bg-gradient-to-br from-[#2AA676] to-[#3ABC89] rounded-[18px] flex items-center justify-center shadow-2xl z-20`}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E63946] rounded-full flex items-center justify-center text-white text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {cartCount}
            </span>
          </motion.button>
        )}

        <BottomNav activeTab={activeTab} onTabChange={onTabChange || (() => {})} />
      </div>
    </div>
  );
}
