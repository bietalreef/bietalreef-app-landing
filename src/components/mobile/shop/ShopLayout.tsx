import { ReactNode } from 'react';
import { Home, ShoppingCart, FileText, User } from 'lucide-react';
import { useShopStore } from './ShopStore';
import { useTranslation } from '../../../contexts/LanguageContext';

interface ShopLayoutProps {
  children: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  const { currentView, setCurrentView, cart } = useShopStore();
  const { dir } = useTranslation('shop');
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'cart', icon: ShoppingCart, label: 'السلة', badge: cartCount },
    { id: 'history', icon: FileText, label: 'طلباتي' },
    { id: 'profile', icon: User, label: 'حسابي' }, // Placeholder for profile
  ];

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-white" dir={dir}>
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
      
      {/* Store Bottom Nav */}
      <div className="bg-[#252525] border-t border-white/5 px-4 py-3 pb-6">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = currentView === item.id || (item.id === 'history' && (currentView === 'tracking' || currentView === 'rating'));
             
             return (
               <button
                 key={item.id}
                 onClick={() => {
                     if (item.id === 'home' || item.id === 'cart' || item.id === 'history') {
                         setCurrentView(item.id as any);
                     }
                 }}
                 className={`flex flex-col items-center gap-1 ${isActive ? 'text-[#D4AF37]' : 'text-gray-500'}`}
               >
                 <div className="relative">
                   <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                   {item.badge ? (
                     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                       {item.badge}
                     </span>
                   ) : null}
                 </div>
                 <span className="text-[10px] font-bold">{item.label}</span>
               </button>
             );
          })}
        </div>
      </div>
    </div>
  );
}
