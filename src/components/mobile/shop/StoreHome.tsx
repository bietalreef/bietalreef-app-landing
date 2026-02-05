import { useState } from 'react';
import { useShopStore } from './ShopStore';
import { Search, ShoppingCart, Heart, Plus } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

// Hardcoded products for demo, using the Unsplash images I got
const DEMO_PRODUCTS = [
  {
    id: 'p1',
    name: 'كنبة "ليجاسي" المخملية',
    price: 4250,
    category: 'أثاث غرفة المعيشة',
    image: 'https://images.unsplash.com/photo-1664817550935-79d3b6255a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwZGFyayUyMGJhY2tncm91bmQlMjBzdHVkaW8lMjBsaWdodGluZ3xlbnwxfHx8fDE3NzAxNDcwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'كنبة فاخرة بتصميم عصري مريح، مصنوعة من أجود أنواع المخمل.',
    specs: [
        { label: 'الأبعاد', value: '220 x 95 x 85 سم' },
        { label: 'اللون', value: 'بني محروق' },
        { label: 'الخامة', value: 'مخمل إيطالي' }
    ]
  },
  {
    id: 'p2',
    name: 'ثريا كريستال ذهبية',
    price: 1850,
    category: 'إضاءة',
    image: 'https://images.unsplash.com/photo-1761157994253-2cb718df73be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnb2xkJTIwY2hhbmRlbGllciUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MDE0NzAxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'ثريا بتصميم كلاسيكي مع لمسة عصرية، تضفي فخامة على أي مكان.',
    specs: [
        { label: 'القطر', value: '60 سم' },
        { label: 'عدد اللمبات', value: '8' },
        { label: 'اللون', value: 'ذهبي' }
    ]
  },
  {
    id: 'p3',
    name: 'كرسي استرخاء مودرن',
    price: 1200,
    category: 'كراسي',
    image: 'https://images.unsplash.com/photo-1651879253285-2c9e621e67a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2ZWx2ZXQlMjBhcm1jaGFpciUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MDE0NzAxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'كرسي مريح جداً للقراءة والاسترخاء، تصميم انسيابي.',
    specs: [
        { label: 'الارتفاع', value: '110 سم' },
        { label: 'الخامة', value: 'قماش كتان' }
    ]
  },
  {
    id: 'p4',
    name: 'سرير "رويال" المزدوج',
    price: 6500,
    category: 'غرف نوم',
    image: 'https://images.unsplash.com/photo-1617322686513-a0732c25f0c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBkZXNpZ24lMjBzdHVkaW8lMjBkYXJrfGVufDF8fHx8MTc3MDE0NzAxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'سرير ملكي بتصميم حديث، يوفر أقصى درجات الراحة.',
    specs: [
        { label: 'المقاس', value: '200 x 200 سم' },
        { label: 'الخامة', value: 'خشب زان طبيعي' }
    ]
  }
];

const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'furniture', label: 'أثاث' },
  { id: 'lighting', label: 'إضاءة' },
  { id: 'decor', label: 'ديكور' },
  { id: 'outdoor', label: 'خارجي' },
];

export function StoreHome() {
  const { setSelectedProduct, setCurrentView, addToCart } = useShopStore();
  const [activeCat, setActiveCat] = useState('all');

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white font-cairo overflow-y-auto pb-20">
      {/* Header */}
      <div className="p-5 sticky top-0 bg-[#1A1A1A]/95 backdrop-blur-md z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-[#D4AF37]">متجر بيت الريف</h1>
          <div className="w-10 h-10 bg-[#252525] rounded-full flex items-center justify-center">
             <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="ابحث عن منتجك المفضل..." 
            className="w-full bg-[#252525] border border-white/10 rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-[#D4AF37]"
          />
          <Search className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
           {CATEGORIES.map(cat => (
             <button
               key={cat.id}
               onClick={() => setActiveCat(cat.id)}
               className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                 activeCat === cat.id 
                 ? 'bg-[#D4AF37] text-black' 
                 : 'bg-[#252525] text-gray-400 hover:bg-[#333]'
               }`}
             >
               {cat.label}
             </button>
           ))}
        </div>
      </div>

      {/* Featured Banner */}
      <div className="px-5 mb-8">
        <div className="w-full h-40 bg-gradient-to-r from-[#D4AF37] to-[#8A701E] rounded-2xl flex items-center justify-between p-6 relative overflow-hidden">
           <div className="relative z-10">
              <span className="text-black/60 text-xs font-bold mb-1 block">تخفيضات الموسم</span>
              <h2 className="text-2xl font-black text-black mb-2">خصم 30%</h2>
              <button className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold">تسوق الآن</button>
           </div>
           <ImageWithFallback src={DEMO_PRODUCTS[0].image} className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-30 mix-blend-multiply" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-5 grid grid-cols-2 gap-4">
         {DEMO_PRODUCTS.map(product => (
           <div 
             key={product.id} 
             onClick={() => {
                setSelectedProduct(product);
                setCurrentView('product');
             }}
             className="bg-[#252525] rounded-xl overflow-hidden group cursor-pointer border border-transparent hover:border-[#D4AF37]/30 transition-all"
           >
              <div className="relative h-40 overflow-hidden">
                 <ImageWithFallback src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 <button className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors">
                    <Heart className="w-4 h-4" />
                 </button>
              </div>
              <div className="p-3">
                 <h3 className="font-bold text-sm mb-1 truncate">{product.name}</h3>
                 <p className="text-xs text-gray-500 mb-3">{product.category}</p>
                 <div className="flex items-center justify-between">
                    <span className="font-bold text-[#D4AF37]">{product.price.toLocaleString()} ر.س</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-7 h-7 bg-[#333] rounded-lg flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
