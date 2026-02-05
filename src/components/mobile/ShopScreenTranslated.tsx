import { ShoppingBag, Star, Heart, ShoppingCart, Plus, Minus, Search, Grid3x3, List, Package, Truck, Award, Tag, Zap, Filter, TrendingUp, CheckCircle2, Box, Hammer, Paintbrush, Wrench, Sparkles, PercentCircle, Users, Store, ArrowUpDown, X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../contexts/LanguageContext';
import { TopNav } from './TopNav';

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

  // All products data organized by main tab
  const allProductsData = {
    materials: [
      {
        id: 'MAT-001',
        nameKey: 'premiumPortlandCement',
        category: t('cement'),
        price: '25',
        priceNum: 25,
        unitKey: 'bag50kg',
        rating: 4.8,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1762608675319-6f2116b4c8c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 15,
        badgeKey: 'bestSeller',
        supplierKey: 'emiratesFactory'
      },
      {
        id: 'MAT-002',
        nameKey: 'premiumInteriorPaint',
        category: t('paints'),
        price: '180',
        priceNum: 180,
        unitKey: 'gallon5L',
        rating: 4.9,
        reviews: 456,
        image: 'https://images.unsplash.com/photo-1643804475756-ca849847c78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 0,
        badgeKey: '',
        supplierKey: 'jotenPaints'
      },
      {
        id: 'MAT-003',
        nameKey: 'insulatedRedBrick',
        category: t('bricks'),
        price: '450',
        priceNum: 450,
        unitKey: 'thousandPieces',
        rating: 4.7,
        reviews: 189,
        image: 'https://images.unsplash.com/photo-1590845947670-c009801ffa74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 0,
        badgeKey: '',
        supplierKey: 'gulfFactory'
      },
      {
        id: 'MAT-004',
        nameKey: 'premiumPorcelainTiles',
        category: t('tiles'),
        price: '85',
        priceNum: 85,
        unitKey: 'squareMeter',
        rating: 4.9,
        reviews: 567,
        image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 20,
        badgeKey: 'specialOffer',
        supplierKey: 'rakCeramics'
      },
      {
        id: 'MAT-005',
        nameKey: 'highQualityReinforcementSteel',
        category: t('steel'),
        price: '2,850',
        priceNum: 2850,
        unitKey: 'ton',
        rating: 4.6,
        reviews: 123,
        image: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 0,
        badgeKey: '',
        supplierKey: 'emiratesSteel'
      },
      {
        id: 'MAT-006',
        nameKey: 'italianCarraraMarble',
        category: t('marble'),
        price: '320',
        priceNum: 320,
        unitKey: 'squareMeter',
        rating: 5.0,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 0,
        badgeKey: 'luxury',
        supplierKey: 'globalMarble'
      },
    ],
    services: [
      {
        id: 'SRV-001',
        nameKey: 'buildingMaterialsDelivery',
        category: t('services'),
        price: '150',
        priceNum: 150,
        unitKey: 'perOrder',
        rating: 4.8,
        reviews: 345,
        image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 0,
        badgeKey: 'fastDelivery',
        supplierKey: 'transportServices'
      },
      {
        id: 'SRV-002',
        nameKey: 'engineeringConsultation',
        category: t('services'),
        price: '500',
        priceNum: 500,
        unitKey: 'perHour',
        rating: 4.9,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 0,
        badgeKey: 'professional',
        supplierKey: 'gulfOffice'
      },
      {
        id: 'SRV-003',
        nameKey: 'tilesInstallation',
        category: t('services'),
        price: '45',
        priceNum: 45,
        unitKey: 'squareMeter',
        rating: 4.7,
        reviews: 567,
        image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 10,
        badgeKey: 'limitedOffer',
        supplierKey: 'installationTeam'
      },
    ],
    suppliers: [
      {
        id: 'SUP-001',
        nameKey: 'emiratesConstruction',
        category: t('mainSupplier'),
        price: '',
        priceNum: 0,
        unitKey: 'products500',
        rating: 4.9,
        reviews: 1234,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 0,
        badgeKey: 'verified',
        supplierKey: 'since1995'
      },
      {
        id: 'SUP-002',
        nameKey: 'gulfMaterialsGroup',
        category: t('certifiedSupplier'),
        price: '',
        priceNum: 0,
        unitKey: 'products350',
        rating: 4.8,
        reviews: 876,
        image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 0,
        badgeKey: 'featured',
        supplierKey: 'since2005'
      },
      {
        id: 'SUP-003',
        nameKey: 'dubaiPaintsInsulation',
        category: t('specialist'),
        price: '',
        priceNum: 0,
        unitKey: 'products200',
        rating: 4.7,
        reviews: 654,
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 0,
        badgeKey: 'trusted',
        supplierKey: 'since2010'
      },
    ],
    deals: [
      {
        id: 'DEAL-001',
        nameKey: 'cementBricksOffer',
        category: t('package'),
        price: '2,500',
        priceNum: 2500,
        unitKey: 'fullPackage',
        rating: 4.8,
        reviews: 234,
        image: 'https://images.unsplash.com/photo-1590845947670-c009801ffa74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 30,
        badgeKey: 'save30',
        supplierKey: 'limitedOfferText'
      },
      {
        id: 'DEAL-002',
        nameKey: 'fullPaintPackage',
        category: t('specialOffer'),
        price: '1,200',
        priceNum: 1200,
        unitKey: 'apartment3Rooms',
        rating: 4.9,
        reviews: 456,
        image: 'https://images.unsplash.com/photo-1643804475756-ca849847c78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 25,
        badgeKey: 'save25',
        supplierKey: 'untilStockLasts'
      },
      {
        id: 'DEAL-003',
        nameKey: 'seasonalTilesDiscounts',
        category: t('discounts'),
        price: '65',
        priceNum: 65,
        unitKey: 'squareMeter',
        rating: 4.7,
        reviews: 789,
        image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
        inStock: true,
        discount: 35,
        badgeKey: 'save35',
        supplierKey: 'daysOnly3'
      },
    ],
  };

  const products = allProductsData[mainTab];

  const mainTabs = [
    { id: 'materials' as MainTab, label: t('buildingMaterials'), icon: Box, count: allProductsData.materials.length },
    { id: 'services' as MainTab, label: t('services'), icon: Wrench, count: allProductsData.services.length },
    { id: 'suppliers' as MainTab, label: t('bestSuppliers'), icon: Award, count: allProductsData.suppliers.length },
    { id: 'deals' as MainTab, label: t('bestDeals'), icon: PercentCircle, count: allProductsData.deals.length },
  ];

  const categories = [
    { id: 'all', label: t('all'), count: products.length },
    { id: t('cement'), label: t('cement') },
    { id: t('paints'), label: t('paints') },
    { id: t('bricks'), label: t('bricks') },
    { id: t('tiles'), label: t('tiles') },
    { id: t('steel'), label: t('steel') },
    { id: t('marble'), label: t('marble') },
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

  // Filter and sort products
  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return 0;
        case 'price-high': return b.priceNum - a.priceNum;
        case 'price-low': return a.priceNum - b.priceNum;
        case 'rating': return b.rating - a.rating;
        case 'popular': return b.reviews - a.reviews;
        default: return 0;
      }
    });

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#F5EEE1] to-white" dir={dir}>
      {/* TopNav */}
      <TopNav 
        activeTab={activeTab}
        onTabChange={onTabChange}
        onOpenDrawer={onOpenDrawer}
        onOpenSearch={onOpenSearch}
      />

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
                {filteredProducts.length} {t('productsAvailable')}
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
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      mainTab === tab.id ? 'bg-[#2AA676]/20 text-[#2AA676]' : 'bg-white/30'
                    }`}>
                      {tab.count}
                    </span>
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
          <motion.div 
            layout
            className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}
          >
            {filteredProducts.map((product) => (
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
                    src={product.image}
                    alt={t(product.nameKey)}
                    className="w-full h-full object-cover"
                  />
                  {product.discount > 0 && (
                    <div className={`absolute top-2 ${dir === 'rtl' ? 'right-2' : 'left-2'} bg-[#E63946] px-2.5 py-1 rounded-[10px] shadow-lg`}>
                      <span className="text-white text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        -{product.discount}%
                      </span>
                    </div>
                  )}
                  {product.badgeKey && (
                    <div className={`absolute top-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} bg-[#2AA676] px-2.5 py-1 rounded-[10px] shadow-lg`}>
                      <span className="text-white text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        {t(product.badgeKey)}
                      </span>
                    </div>
                  )}
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
                    {t(product.nameKey)}
                  </h3>
                  <p className="text-[#1A1A1A]/60 text-xs mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                    {t(product.unitKey)}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star className="w-3.5 h-3.5 fill-[#F2C94C] text-[#F2C94C]" />
                    <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '12px' }}>
                      {product.rating}
                    </span>
                    <span className="text-[#1A1A1A]/40 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    {product.price && (
                      <div>
                        <span className="text-[#2AA676]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}>
                          {product.price}
                        </span>
                        <span className={`text-[#1A1A1A]/60 text-xs ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                          {dir === 'rtl' ? 'د.إ' : 'AED'}
                        </span>
                      </div>
                    )}
                    {mainTab === 'materials' && product.price && (
                      cart[product.id] ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="w-7 h-7 bg-[#2AA676]/10 rounded-lg flex items-center justify-center"
                          >
                            <Minus className="w-3.5 h-3.5 text-[#2AA676]" />
                          </button>
                          <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                            {cart[product.id]}
                          </span>
                          <button
                            onClick={() => addToCart(product.id)}
                            className="w-7 h-7 bg-[#2AA676] rounded-lg flex items-center justify-center"
                          >
                            <Plus className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product.id)}
                          className="w-8 h-8 bg-[#2AA676] rounded-[10px] flex items-center justify-center shadow-md"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      )
                    )}
                    {(mainTab === 'suppliers' || mainTab === 'services') && (
                      <button className="bg-[#2AA676] text-white px-3 py-1.5 rounded-[10px] text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        {t('viewProducts')}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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

    </div>
  );
}
