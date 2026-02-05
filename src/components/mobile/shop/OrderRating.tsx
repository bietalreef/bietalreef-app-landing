import { useState } from 'react';
import { useShopStore } from './ShopStore';
import { Star, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

export function OrderRating() {
  const { setCurrentView } = useShopStore();
  const [rating, setRating] = useState(0);

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white font-cairo overflow-y-auto pb-24 relative items-center justify-center p-6">
       <button onClick={() => setCurrentView('home')} className="absolute top-4 right-4 text-gray-400">
           <ArrowRight className="w-6 h-6" />
       </button>

       <div className="w-full max-w-sm bg-[#252525] rounded-3xl p-6 text-center shadow-2xl border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-[#2AA676]"></div>
           
           <div className="w-20 h-20 bg-[#2AA676]/20 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 className="w-10 h-10 text-[#2AA676]" />
           </div>

           <h2 className="text-2xl font-bold mb-2">تم التوصيل بنجاح!</h2>
           <p className="text-gray-400 text-sm mb-8">لقد وصل طلبك رقم #ORD-992519. نأمل أن يكون المنتج قد نال إعجابك.</p>

           <div className="mb-8">
               <p className="font-bold text-sm mb-4">كيف تقيم تجربتك؟</p>
               <div className="flex justify-center gap-2" dir="ltr">
                   {[1,2,3,4,5].map(star => (
                       <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                           <Star className={`w-8 h-8 ${rating >= star ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-600'}`} />
                       </button>
                   ))}
               </div>
           </div>

           <div className="mb-6">
               <p className="text-xs text-gray-500 mb-3 text-right">أضف صورة للمنتج (اختياري)</p>
               <div className="grid grid-cols-3 gap-2">
                   <div className="aspect-square bg-[#1A1A1A] rounded-xl border border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
                       <Upload className="w-6 h-6 mb-1" />
                       <span className="text-[10px]">رفع صورة</span>
                   </div>
                   <div className="aspect-square bg-[#1A1A1A] rounded-xl overflow-hidden relative">
                       <ImageWithFallback src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover opacity-50" />
                   </div>
               </div>
           </div>

           <div className="relative">
               <textarea placeholder="اكتب تعليقك هنا..." className="w-full bg-[#1A1A1A] rounded-xl p-3 text-sm min-h-[80px] border border-transparent focus:border-[#D4AF37] outline-none text-right"></textarea>
           </div>

           <button onClick={() => setCurrentView('history')} className="w-full bg-[#2AA676] text-white font-bold py-3.5 rounded-xl mt-6 shadow-lg shadow-[#2AA676]/20">
               إرسال التقييم
           </button>
           
           <button onClick={() => setCurrentView('home')} className="w-full text-gray-500 text-xs font-bold py-3 mt-2">
               العودة للرئيسية
           </button>
       </div>
    </div>
  );
}
