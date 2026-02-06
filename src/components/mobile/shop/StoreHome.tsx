import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useShopStore } from './ShopStore';
import { Search, Heart, Plus, Star, Flame, X } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { useTranslation } from '../../../contexts/LanguageContext';
import { useState } from 'react';
import { useNavigate } from 'react-router';

// Products relevant to construction & home finishing — UAE market
const DEMO_PRODUCTS = [
  {
    id: 'p1',
    name: 'كاونتر رخام كرارا إيطالي',
    nameEn: 'Italian Carrara Marble Countertop',
    price: 850,
    category: 'رخام وحجر',
    categoryEn: 'Marble & Stone',
    image: 'https://images.unsplash.com/photo-1760072513457-651955c7074d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'كاونتر مطبخ رخام كرارا إيطالي أصلي، سماكة 3 سم، مصقول بلمعان عالي. مثالي للمطابخ الفاخرة.',
    descriptionEn: 'Genuine Italian Carrara marble kitchen countertop, 3cm thickness, high-gloss polished. Ideal for luxury kitchens.',
    specs: [
      { label: 'السماكة', labelEn: 'Thickness', value: '3 سم', valueEn: '3 cm' },
      { label: 'التشطيب', labelEn: 'Finish', value: 'مصقول لامع', valueEn: 'Polished Gloss' },
      { label: 'الوحدة', labelEn: 'Unit', value: 'متر مربع', valueEn: 'sqm' }
    ]
  },
  {
    id: 'p2',
    name: 'طاولة طعام خشب جوز طبيعي',
    nameEn: 'Natural Walnut Wood Dining Table',
    price: 4200,
    category: 'أثاث',
    categoryEn: 'Furniture',
    image: 'https://images.unsplash.com/photo-1758977403438-1b8546560d31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'طاولة طعام من خشب الجوز الطبيعي تتسع لـ 8 أشخاص، تصميم عصري أنيق مع أرجل معدنية.',
    descriptionEn: 'Natural walnut wood dining table seats 8, elegant modern design with metal legs.',
    specs: [
      { label: 'الأبعاد', labelEn: 'Dimensions', value: '220 x 100 x 76 سم', valueEn: '220 x 100 x 76 cm' },
      { label: 'المادة', labelEn: 'Material', value: 'خشب جوز طبيعي', valueEn: 'Natural Walnut' },
      { label: 'السعة', labelEn: 'Seats', value: '8 أشخاص', valueEn: '8 persons' }
    ]
  },
  {
    id: 'p3',
    name: 'خزائن مطبخ MDF لاكر أبيض',
    nameEn: 'White Lacquer MDF Kitchen Cabinets',
    price: 12000,
    category: 'مطابخ',
    categoryEn: 'Kitchens',
    image: 'https://images.unsplash.com/photo-1682888818602-b4492fadf2f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'خزائن مطبخ MDF عالي الكثافة، لاكر أبيض لامع، مفصلات سوفت كلوز، أدراج بنظام البلام بوكس.',
    descriptionEn: 'High-density MDF kitchen cabinets, glossy white lacquer, soft-close hinges, Blum box drawer system.',
    specs: [
      { label: 'المادة', labelEn: 'Material', value: 'MDF عالي الكثافة', valueEn: 'High-density MDF' },
      { label: 'التشطيب', labelEn: 'Finish', value: 'لاكر لامع', valueEn: 'Glossy Lacquer' },
      { label: 'الوحدة', labelEn: 'Unit', value: 'متر طولي', valueEn: 'linear meter' }
    ]
  },
  {
    id: 'p4',
    name: 'بلاط بورسلان إيطالي 60×120',
    nameEn: 'Italian Porcelain Tiles 60×120',
    price: 95,
    category: 'أرضيات',
    categoryEn: 'Flooring',
    image: 'https://images.unsplash.com/photo-1604589977707-d161da2edb0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'بلاط بورسلان إيطالي عالي الجودة، مقاس 60×120 سم، تشطيب مات مقاوم للانزلاق.',
    descriptionEn: 'High-quality Italian porcelain tiles, 60x120cm, anti-slip matte finish.',
    specs: [
      { label: 'المقاس', labelEn: 'Size', value: '60 × 120 سم', valueEn: '60 × 120 cm' },
      { label: 'التشطيب', labelEn: 'Finish', value: 'مات مقاوم للانزلاق', valueEn: 'Anti-slip Matte' },
      { label: 'المنشأ', labelEn: 'Origin', value: 'إيطاليا', valueEn: 'Italy' }
    ]
  },
  {
    id: 'p5',
    name: 'وحدة حمام فاخرة مع مرآة LED',
    nameEn: 'Luxury Bathroom Vanity with LED Mirror',
    price: 3800,
    category: 'حمامات',
    categoryEn: 'Bathrooms',
    image: 'https://images.unsplash.com/photo-1768413292551-10011d6c354e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'وحدة حمام خشبية مع حوض سيراميك مدمج ومرآة LED مضيئة، أدراج سوفت كلوز، تصميم إيطالي.',
    descriptionEn: 'Wooden bathroom vanity with integrated ceramic basin and LED mirror, soft-close drawers, Italian design.',
    specs: [
      { label: 'المقاس', labelEn: 'Size', value: '120 × 50 سم', valueEn: '120 × 50 cm' },
      { label: 'المرآة', labelEn: 'Mirror', value: 'LED مع مفتاح لمس', valueEn: 'LED with touch switch' },
      { label: 'التصميم', labelEn: 'Design', value: 'إيطالي', valueEn: 'Italian' }
    ]
  },
  {
    id: 'p6',
    name: 'جبس بورد مودرن مع إضاءة مخفية',
    nameEn: 'Modern Gypsum Board with Hidden Lighting',
    price: 120,
    category: 'ديكور',
    categoryEn: 'Decor',
    image: 'https://images.unsplash.com/photo-1561208885-a4a5a0ccc359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'تصميم وتنفيذ أسقف جبس بورد مع إضاءة مخفية LED. تصاميم عصرية متنوعة، يشمل المواد والتركيب.',
    descriptionEn: 'Design and installation of gypsum board ceilings with hidden LED lighting. Various modern designs, includes materials and installation.',
    specs: [
      { label: 'النوع', labelEn: 'Type', value: 'جبس بورد مقاوم للرطوبة', valueEn: 'Moisture-resistant Gypsum' },
      { label: 'الإضاءة', labelEn: 'Lighting', value: 'LED مخفية', valueEn: 'Hidden LED' },
      { label: 'الوحدة', labelEn: 'Unit', value: 'متر مربع', valueEn: 'sqm' }
    ]
  }
];

const CATEGORIES = {
  ar: [
    { id: 'all', label: 'الكل' },
    { id: 'marble', label: 'رخام' },
    { id: 'kitchens', label: 'مطابخ' },
    { id: 'flooring', label: 'أرضيات' },
    { id: 'bathrooms', label: 'حمامات' },
    { id: 'decor', label: 'ديكور' },
    { id: 'furniture', label: 'أثاث' },
  ],
  en: [
    { id: 'all', label: 'All' },
    { id: 'marble', label: 'Marble' },
    { id: 'kitchens', label: 'Kitchens' },
    { id: 'flooring', label: 'Flooring' },
    { id: 'bathrooms', label: 'Bathrooms' },
    { id: 'decor', label: 'Decor' },
    { id: 'furniture', label: 'Furniture' },
  ]
};

export function StoreHome() {
  const { setSelectedProduct, setCurrentView, addToCart, favorites, toggleFavorite } = useShopStore();
  const [activeCat, setActiveCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { language, textAlign } = useTranslation('store');
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, Segoe UI, sans-serif' : 'Cairo, sans-serif';
  const currency = isEn ? 'AED' : 'د.إ';
  const cats = isEn ? CATEGORIES.en : CATEGORIES.ar;
  const navigate = useNavigate();

  const filteredProducts = DEMO_PRODUCTS.filter(p => {
    const matchesCat = activeCat === 'all' || 
      (activeCat === 'marble' && p.category === 'رخام وحجر') ||
      (activeCat === 'kitchens' && p.category === 'مطابخ') ||
      (activeCat === 'flooring' && p.category === 'أرضيات') ||
      (activeCat === 'bathrooms' && p.category === 'حمامات') ||
      (activeCat === 'decor' && p.category === 'ديكور') ||
      (activeCat === 'furniture' && p.category === 'أثاث');
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(isEn ? 'Added to cart!' : 'تمت الإضافة للسلة!', {
      duration: 1500,
      style: { background: '#252525', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white overflow-y-auto pb-4" style={{ fontFamily }}>
      {/* Header */}
      <div className="p-5 sticky top-0 bg-[#1A1A1A]/95 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#D4AF37]" style={{ fontFamily, textAlign }}>
              {isEn ? 'Bait Al Reef Store' : 'متجر بيت الريف'}
            </h1>
            <p className="text-gray-500 text-xs mt-0.5" style={{ fontFamily, textAlign }}>
              {isEn ? `${DEMO_PRODUCTS.length} products available` : `${DEMO_PRODUCTS.length} منتج متاح`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#D4AF37]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs font-bold" style={{ fontFamily }}>
                {isEn ? 'Sale' : 'عروض'}
              </span>
            </div>
            {/* Close Store Button */}
            <button
              onClick={() => navigate('/home')}
              className="w-9 h-9 bg-white/10 hover:bg-red-500/20 rounded-full flex items-center justify-center transition-all group border border-white/10"
              aria-label={isEn ? 'Close store' : 'إغلاق المتجر'}
            >
              <X className="w-4.5 h-4.5 text-gray-400 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search for your product...' : 'ابحث عن منتجك المفضل...'} 
            className="w-full bg-[#252525] border border-white/10 rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
            style={{ fontFamily, textAlign }}
          />
          <Search className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
        </div>

        {/* Categories */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
           {cats.map(cat => (
             <button
               key={cat.id}
               onClick={() => setActiveCat(cat.id)}
               className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                 activeCat === cat.id 
                 ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' 
                 : 'bg-[#252525] text-gray-400 hover:bg-[#333] border border-white/5'
               }`}
               style={{ fontFamily }}
             >
               {cat.label}
             </button>
           ))}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="px-5 mb-6">
        <div className="w-full h-36 bg-gradient-to-r from-[#D4AF37] to-[#8A701E] rounded-2xl flex items-center justify-between p-6 relative overflow-hidden">
           <div className="relative z-10">
              <span className="text-black/60 text-xs font-bold mb-1 block" style={{ fontFamily, textAlign }}>
                {isEn ? 'Season Sale' : 'تخفيضات الموسم'}
              </span>
              <h2 className="text-2xl font-black text-black mb-2" style={{ fontFamily }}>
                {isEn ? '30% OFF' : 'خصم 30%'}
              </h2>
              <button 
                onClick={() => setActiveCat('all')}
                className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-black/80 transition-colors" 
                style={{ fontFamily }}
              >
                {isEn ? 'Shop Now' : 'تسوق الآن'}
              </button>
           </div>
           <ImageWithFallback src={DEMO_PRODUCTS[0].image} className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-30 mix-blend-multiply" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-5 grid grid-cols-2 gap-3">
         {filteredProducts.map((product, idx) => {
           const isFav = favorites.includes(product.id);
           return (
             <motion.div 
               key={product.id} 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05, duration: 0.3 }}
               onClick={() => {
                  setSelectedProduct(product);
                  setCurrentView('product');
               }}
               className="bg-[#252525] rounded-2xl overflow-hidden group cursor-pointer border border-transparent hover:border-[#D4AF37]/30 transition-all"
             >
                <div className="relative h-36 overflow-hidden">
                   <ImageWithFallback src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       toggleFavorite(product.id);
                     }}
                     className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                       isFav ? 'bg-red-500 text-white' : 'bg-black/50 backdrop-blur-sm text-white hover:bg-[#D4AF37] hover:text-black'
                     }`}
                   >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                   </button>
                   {product.isNew && (
                     <div className="absolute top-2 left-2 bg-[#2AA676] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                       {isEn ? 'NEW' : 'جديد'}
                     </div>
                   )}
                </div>
                <div className="p-3">
                   <h3 className="font-bold text-sm mb-0.5 truncate" style={{ fontFamily, textAlign }}>
                     {isEn ? product.nameEn : product.name}
                   </h3>
                   <p className="text-xs text-gray-500 mb-2" style={{ fontFamily, textAlign }}>
                     {isEn ? product.categoryEn : product.category}
                   </p>
                   <div className="flex items-center gap-1 mb-2">
                     <Star className="w-3 h-3 text-[#D4AF37] fill-current" />
                     <span className="text-[11px] text-gray-400">4.8</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="font-bold text-[#D4AF37] text-sm" style={{ fontFamily }}>
                        {product.price.toLocaleString()} {currency}
                      </span>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-8 h-8 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </motion.div>
           );
         })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Search className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-sm" style={{ fontFamily }}>{isEn ? 'No products found' : 'لا توجد منتجات'}</p>
        </div>
      )}
    </div>
  );
}