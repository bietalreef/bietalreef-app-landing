import { useShopStore, Order } from './ShopStore';
import { ArrowRight, Package, RefreshCw, ChevronLeft } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

export function OrderHistory() {
  const { orders, setCurrentView, addToCart } = useShopStore();

  const handleReorder = (order: Order) => {
      order.items.forEach(item => addToCart(item));
      setCurrentView('cart');
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white font-cairo overflow-y-auto pb-24">
       <div className="p-4 flex items-center gap-4 sticky top-0 bg-[#1A1A1A] z-10 border-b border-white/5">
          <button onClick={() => setCurrentView('home')} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
             <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">طلباتي السابقة</h1>
       </div>

       <div className="p-5 space-y-4">
          {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>لا توجد طلبات سابقة</p>
              </div>
          ) : (
              orders.map(order => (
                  <div key={order.id} className="bg-[#252525] rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <h3 className="font-bold text-sm text-gray-300">طلب رقم #{order.id}</h3>
                              <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                          </div>
                          <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                              order.status === 'delivered' ? 'bg-[#2AA676]/20 text-[#2AA676]' : 
                              order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' : 
                              'bg-orange-500/20 text-orange-400'
                          }`}>
                              {order.status === 'delivered' ? 'تم التوصيل' : 
                               order.status === 'shipped' ? 'جاري التوصيل' : 'قيد المعالجة'}
                          </div>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
                          {/* Placeholders since we don't have real item history in the simplified store type yet, or assuming items array exists */}
                          <div className="w-12 h-12 bg-black rounded-lg flex-shrink-0 relative overflow-hidden">
                              <ImageWithFallback src="https://images.unsplash.com/photo-1664817550935-79d3b6255a82?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                          </div>
                          <div className="w-12 h-12 bg-black rounded-lg flex-shrink-0 relative overflow-hidden">
                              <ImageWithFallback src="https://images.unsplash.com/photo-1761157994253-2cb718df73be?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                          </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                          <span className="font-bold text-[#D4AF37]">{order.total.toLocaleString()} ر.س</span>
                          <button 
                            onClick={() => handleReorder(order)}
                            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          >
                             <RefreshCw className="w-3 h-3" /> إعادة الطلب
                          </button>
                      </div>
                  </div>
              ))
          )}
       </div>
    </div>
  );
}
