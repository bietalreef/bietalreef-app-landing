import { useState } from 'react';
import { useShopStore } from './ShopStore';
import { ArrowRight, ShoppingCart, Heart, Box, Share2, Star, Minus, Plus, Truck, ShieldCheck, CreditCard, Camera } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { VRProductViewer } from './VRProductViewer';

export function ProductDetails() {
  const { selectedProduct, setCurrentView, addToCart } = useShopStore();
  const [quantity, setQuantity] = useState(1);
  const [showVR, setShowVR] = useState(false);

  if (!selectedProduct) return null;

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white font-cairo overflow-y-auto pb-24 relative">
      {/* Header Image */}
      <div className="relative h-[45vh]">
         <ImageWithFallback src={selectedProduct.image} className="w-full h-full object-cover" />
         
         <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
            <button onClick={() => setCurrentView('home')} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20">
               <ArrowRight className="w-5 h-5 text-white" />
            </button>
            <div className="flex gap-2">
               <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20">
                  <Share2 className="w-5 h-5 text-white" />
               </button>
               <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20">
                  <Heart className="w-5 h-5 text-white" />
               </button>
            </div>
         </div>

         {/* VR Button */}
         <button 
           onClick={() => setShowVR(true)}
           className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] border border-[#D4AF37] text-black px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2.5 hover:bg-[#B5952F] transition-all shadow-lg shadow-[#D4AF37]/30"
         >
            <Camera className="w-5 h-5" />
            <span>مشاهدة الواقع المعزز</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#1A1A1A] -mt-6 rounded-t-[30px] relative z-10 px-6 py-8">
         <div className="flex justify-between items-start mb-4">
            <div>
               <h1 className="text-2xl font-bold mb-1">{selectedProduct.name}</h1>
               <div className="flex items-center gap-1 text-[#D4AF37]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">4.8</span>
                  <span className="text-gray-500 text-xs">(125 تقييم)</span>
               </div>
            </div>
            <div className="text-left">
               <div className="text-2xl font-bold text-[#D4AF37]">{selectedProduct.price.toLocaleString()}</div>
               <div className="text-xs text-gray-500">ريال سعودي</div>
            </div>
         </div>

         {/* Quantity & Add */}
         <div className="flex gap-4 mb-8">
            <div className="flex items-center bg-[#252525] rounded-xl px-2 h-12 border border-white/5">
               <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-white"><Minus className="w-4 h-4"/></button>
               <span className="w-8 text-center font-bold">{quantity}</span>
               <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-white"><Plus className="w-4 h-4"/></button>
            </div>
            <button 
               onClick={() => {
                  for(let i=0; i<quantity; i++) addToCart(selectedProduct);
               }}
               className="flex-1 bg-[#D4AF37] hover:bg-[#B5952F] text-black font-bold rounded-xl h-12 flex items-center justify-center gap-2 transition-colors"
            >
               <ShoppingCart className="w-5 h-5" />
               <span>أضف للسلة</span>
            </button>
         </div>

         {/* Specs */}
         <div className="space-y-6">
            <div>
               <h3 className="font-bold text-lg mb-3 border-r-4 border-[#D4AF37] pr-3">المواصفات الفنية</h3>
               <div className="grid grid-cols-2 gap-3">
                  {selectedProduct.specs?.map((spec, idx) => (
                      <div key={idx} className="bg-[#252525] p-3 rounded-lg border border-white/5">
                         <span className="text-gray-500 text-xs block mb-1">{spec.label}</span>
                         <span className="font-bold text-sm">{spec.value}</span>
                      </div>
                  ))}
               </div>
            </div>

            <div>
               <h3 className="font-bold text-lg mb-3 border-r-4 border-[#D4AF37] pr-3">عن المنتج</h3>
               <p className="text-gray-400 text-sm leading-relaxed">
                  {selectedProduct.description}
               </p>
            </div>

            <div className="flex gap-4 overflow-x-auto py-4">
               <div className="flex items-center gap-2 min-w-max text-xs text-gray-400 bg-[#252525] px-3 py-2 rounded-lg">
                  <Truck className="w-4 h-4 text-[#D4AF37]" /> توصيل مجاني
               </div>
               <div className="flex items-center gap-2 min-w-max text-xs text-gray-400 bg-[#252525] px-3 py-2 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> ضمان سنتين
               </div>
               <div className="flex items-center gap-2 min-w-max text-xs text-gray-400 bg-[#252525] px-3 py-2 rounded-lg">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" /> دفع آمن
               </div>
            </div>
         </div>
      </div>
      
      {showVR && <VRProductViewer product={selectedProduct} onClose={() => setShowVR(false)} />}
    </div>
  );
}