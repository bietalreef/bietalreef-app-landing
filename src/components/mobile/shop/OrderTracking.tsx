import { useShopStore } from './ShopStore';
import { ArrowRight, MapPin, Truck, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

export function OrderTracking() {
  const { selectedOrder, setCurrentView } = useShopStore();

  if (!selectedOrder) return null;

  const steps = [
      { label: 'تم استلام الطلب', time: '10:30 AM', active: true },
      { label: 'جاري التجهيز', time: '11:45 AM', active: true },
      { label: 'خرج للتوصيل', time: '02:15 PM', active: selectedOrder.trackingStep && selectedOrder.trackingStep >= 1 },
      { label: 'تم التوصيل', time: '---', active: selectedOrder.trackingStep && selectedOrder.trackingStep >= 2 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white font-cairo overflow-y-auto pb-24 relative">
       {/* Map Background */}
       <div className="absolute top-0 left-0 w-full h-[60vh] z-0">
          <ImageWithFallback src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-30 grayscale invert" />
          {/* Driver Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-12 -translate-y-12">
             <div className="relative">
                <div className="w-12 h-12 bg-[#2AA676] rounded-full flex items-center justify-center shadow-lg shadow-[#2AA676]/30 animate-pulse">
                   <Truck className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2AA676] rotate-45"></div>
             </div>
             <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded-md mt-2 absolute left-1/2 -translate-x-1/2 whitespace-nowrap shadow-sm">
                مندوب التوصيل
             </div>
          </div>
          
          {/* Home Marker */}
          <div className="absolute top-1/3 right-1/4">
              <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <MapPin className="w-4 h-4 text-black" />
              </div>
          </div>
       </div>

       {/* Top Bar */}
       <div className="relative z-10 p-4 flex justify-between items-center">
          <button onClick={() => setCurrentView('home')} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
             <ArrowRight className="w-5 h-5" />
          </button>
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold border border-white/10">
             تتبع حالة الطلب المباشر
          </div>
       </div>

       {/* Bottom Sheet */}
       <div className="mt-auto relative z-10 bg-[#1A1A1A] rounded-t-[30px] p-6 pb-24 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/5 min-h-[45vh]">
           <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6"></div>
           
           <div className="flex justify-between items-start mb-6">
              <div>
                 <span className="text-gray-400 text-xs block mb-1">رقم الطلب</span>
                 <h2 className="text-xl font-bold text-[#D4AF37]">{selectedOrder.id}</h2>
              </div>
              <div className="text-left">
                  <span className="text-gray-400 text-xs block mb-1">موعد الوصول المتوقع</span>
                  <span className="font-bold">03:30 PM</span>
              </div>
           </div>

           {/* Timeline */}
           <div className="space-y-6 relative pl-4 border-r border-dashed border-white/10 mr-2 pr-6">
               {steps.map((step, idx) => (
                   <div key={idx} className="relative flex items-center justify-between">
                       <div className={`absolute -right-[29px] w-4 h-4 rounded-full border-2 ${step.active ? 'bg-[#2AA676] border-[#2AA676]' : 'bg-[#1A1A1A] border-gray-600'} flex items-center justify-center`}>
                           {step.active && <CheckCircle2 className="w-3 h-3 text-white" />}
                       </div>
                       <div className={`${step.active ? 'text-white' : 'text-gray-500'}`}>
                           <p className="font-bold text-sm">{step.label}</p>
                       </div>
                       <span className="text-xs text-gray-500 font-mono">{step.time}</span>
                   </div>
               ))}
           </div>

           {/* Driver Info */}
           <div className="mt-8 bg-[#252525] p-4 rounded-xl flex items-center justify-between">
               <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                   <div>
                       <p className="font-bold text-sm">غازي المجهر</p>
                       <p className="text-xs text-gray-400">مندوب التوصيل</p>
                   </div>
               </div>
               <div className="flex gap-2">
                   <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#2AA676] transition-colors"><Phone className="w-4 h-4"/></button>
                   <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors"><MessageCircle className="w-4 h-4"/></button>
               </div>
           </div>

           <button onClick={() => setCurrentView('rating')} className="w-full mt-4 bg-[#2AA676] text-white font-bold py-3.5 rounded-xl">
               تأكيد الاستلام
           </button>
       </div>
    </div>
  );
}
