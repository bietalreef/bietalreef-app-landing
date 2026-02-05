import { useState } from 'react';
import { useShopStore } from './ShopStore';
import { ArrowRight, MapPin, Clock, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

export function Checkout() {
  const { cart, placeOrder, setCurrentView } = useShopStore();
  const [step, setStep] = useState<'address' | 'summary'>('address');
  
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = total * 0.15;
  const shipping = 50;
  const grandTotal = total + vat + shipping;

  if (cart.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-white font-cairo">
              <p className="mb-4">سلة التسوق فارغة</p>
              <button onClick={() => setCurrentView('home')} className="text-[#D4AF37] underline">تصفح المنتجات</button>
          </div>
      )
  }

  const handlePlaceOrder = () => {
     placeOrder({
         id: `ORD-${Math.floor(Math.random() * 100000)}`,
         items: [...cart],
         total: grandTotal,
         status: 'processing',
         date: new Date().toISOString().split('T')[0],
         trackingStep: 0
     });
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white font-cairo overflow-y-auto pb-24">
       {/* Header */}
       <div className="p-4 flex items-center gap-4 border-b border-white/5 bg-[#1A1A1A] sticky top-0 z-10">
          <button onClick={() => step === 'summary' ? setStep('address') : setCurrentView('home')} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
             <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">{step === 'address' ? 'عنوان الشحن' : 'ملخص الطلب'}</h1>
       </div>

       {step === 'address' ? (
           <div className="p-5 space-y-6">
              {/* Address Map Placeholder */}
              <div className="bg-[#252525] rounded-2xl overflow-hidden h-48 relative border border-white/5">
                 <ImageWithFallback src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-50" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-[#D4AF37]/20">
                       <MapPin className="w-4 h-4 text-black" />
                    </div>
                 </div>
                 <button className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg">تغيير الموقع</button>
              </div>

              <div className="space-y-4">
                  <div>
                      <label className="block text-gray-400 text-xs mb-2">اسم العنوان</label>
                      <input type="text" defaultValue="المنزل (الافتراضي)" className="w-full bg-[#252525] border border-white/10 rounded-xl p-3 text-sm focus:border-[#D4AF37] outline-none" />
                  </div>
                  <div>
                      <label className="block text-gray-400 text-xs mb-2">العنوان التفصيلي</label>
                      <input type="text" defaultValue="حي النرجس، شارع العليا، الرياض" className="w-full bg-[#252525] border border-white/10 rounded-xl p-3 text-sm focus:border-[#D4AF37] outline-none" />
                  </div>
                  <div>
                      <label className="block text-gray-400 text-xs mb-2">رقم الجوال</label>
                      <input type="tel" defaultValue="+966 55 123 4567" className="w-full bg-[#252525] border border-white/10 rounded-xl p-3 text-sm focus:border-[#D4AF37] outline-none" />
                  </div>
              </div>

              <button onClick={() => setStep('summary')} className="w-full bg-[#D4AF37] text-black font-bold py-3.5 rounded-xl mt-4">
                 الاستمرار للملخص
              </button>
           </div>
       ) : (
           <div className="p-5 space-y-6">
               {/* Cart Summary */}
               <div className="bg-[#252525] rounded-2xl p-4 border border-white/5">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-[#D4AF37]"><Clock className="w-4 h-4"/> سلة "ليجاسي" المخملية</h3>
                  {cart.map(item => (
                      <div key={item.id} className="flex gap-3 mb-3 pb-3 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
                          <ImageWithFallback src={item.image} className="w-16 h-16 rounded-lg object-cover bg-black" />
                          <div className="flex-1">
                              <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                              <p className="text-xs text-gray-500 mb-1">{item.quantity} x {item.price.toLocaleString()}</p>
                              <p className="text-sm font-bold text-[#D4AF37]">{(item.price * item.quantity).toLocaleString()} ر.س</p>
                          </div>
                      </div>
                  ))}
               </div>

               {/* Payment Method */}
               <div className="bg-[#252525] rounded-2xl p-4 border border-white/5">
                   <h3 className="font-bold mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400"/> طريقة الدفع</h3>
                   <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-[#D4AF37]/30">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                               <span className="text-[10px] text-blue-800 font-bold">VISA</span>
                           </div>
                           <span className="text-sm">**** 4242</span>
                       </div>
                       <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                   </div>
               </div>

               {/* Totals */}
               <div className="bg-[#252525] rounded-2xl p-4 border border-white/5 space-y-2 text-sm">
                   <div className="flex justify-between text-gray-400">
                       <span>المجموع الفرعي</span>
                       <span>{total.toLocaleString()} ر.س</span>
                   </div>
                   <div className="flex justify-between text-gray-400">
                       <span>ضريبة القيمة المضافة (15%)</span>
                       <span>{vat.toLocaleString()} ر.س</span>
                   </div>
                   <div className="flex justify-between text-gray-400">
                       <span>رسوم التوصيل</span>
                       <span>{shipping.toLocaleString()} ر.س</span>
                   </div>
                   <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10 mt-2">
                       <span>الإجمالي</span>
                       <span className="text-[#D4AF37]">{grandTotal.toLocaleString()} ر.س</span>
                   </div>
               </div>
               
               <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                   <Lock className="w-3 h-3" />
                   <span>جميع المعاملات مشفرة وآمنة</span>
               </div>

               <button onClick={handlePlaceOrder} className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-black font-bold py-3.5 rounded-xl shadow-lg shadow-[#D4AF37]/10 transition-all">
                  تأكيد ودفع آمن
               </button>
           </div>
       )}
    </div>
  );
}
