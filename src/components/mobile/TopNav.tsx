import image_1d3f7ac269fcb8922cef991f788ec0c45ba06aa3 from 'figma:asset/1d3f7ac269fcb8922cef991f788ec0c45ba06aa3.png';
import bietAlreefLogo from 'figma:asset/67fe2af1d169e9257cfb304dda040baf67b4e599.png';
import { ShoppingCart, Search, Bell, Menu, Mic, Check, CheckCheck, ChevronLeft, X, Clock, Sparkles, MessageSquare, AlertTriangle, Zap } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useTranslation } from '../../contexts/LanguageContext';
import { useSearchStore } from '../../stores/search-store';
import { WalletWidget } from './WalletWidget';
import { useShopStore } from './shop/ShopStore';
import { motion, AnimatePresence } from 'motion/react';

// ─── Notification Data Types ───
interface NotificationItem {
  id: string;
  category: 'platform' | 'weyaak' | 'other';
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  time: string;
  timeEn: string;
  read: boolean;
  icon: string;
}

// ─── Demo notifications (simulate real data) ───
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    category: 'platform',
    titleAr: 'مرحباً بك في بيت الريف',
    titleEn: 'Welcome to Beit Al Reef',
    messageAr: 'ابدأ باستكشاف الخدمات والأدوات الذكية',
    messageEn: 'Start exploring services and smart tools',
    time: 'منذ 5 دقائق',
    timeEn: '5 min ago',
    read: false,
    icon: '🏠',
  },
  {
    id: 'n2',
    category: 'platform',
    titleAr: 'تحديث التطبيق v2.0',
    titleEn: 'App Update v2.0',
    messageAr: 'ميزات جديدة: الأدوات الذكية ومدير السوشيال ميديا',
    messageEn: 'New features: Smart tools and Social media manager',
    time: 'منذ ساعة',
    timeEn: '1 hour ago',
    read: false,
    icon: '🚀',
  },
  {
    id: 'n3',
    category: 'weyaak',
    titleAr: 'وياك جاهز لمساعدتك',
    titleEn: 'Weyaak is ready to help',
    messageAr: 'جرّب السؤال عن تكلفة تجديد منزلك',
    messageEn: 'Try asking about your home renovation cost',
    time: 'منذ ساعتين',
    timeEn: '2 hours ago',
    read: false,
    icon: '🤖',
  },
  {
    id: 'n4',
    category: 'other',
    titleAr: 'رسالة من مقاول',
    titleEn: 'Message from contractor',
    messageAr: 'أحمد المهندس أرسل لك عرض سعر جديد',
    messageEn: 'Ahmed Engineer sent you a new quote',
    time: 'منذ 3 ساعات',
    timeEn: '3 hours ago',
    read: true,
    icon: '👤',
  },
  {
    id: 'n5',
    category: 'other',
    titleAr: 'تذكير: موعد الصيانة غداً',
    titleEn: 'Reminder: Maintenance tomorrow',
    messageAr: 'لديك موعد صيانة تكييف الساعة 10 صباحاً',
    messageEn: 'AC maintenance appointment at 10 AM',
    time: 'منذ 5 ساعات',
    timeEn: '5 hours ago',
    read: true,
    icon: '🔔',
  },
];

const CATEGORY_META: Record<string, { icon: string; labelAr: string; labelEn: string; color: string }> = {
  all:       { icon: '📬', labelAr: 'الكل',   labelEn: 'All',      color: 'from-[#2AA676] to-[#1F3D2B]' },
  platform:  { icon: '📨', labelAr: 'المنصة', labelEn: 'Platform', color: 'from-blue-500 to-blue-600' },
  weyaak:    { icon: '🤖', labelAr: 'وياك',   labelEn: 'Weyaak',   color: 'from-purple-500 to-purple-600' },
  other:     { icon: '🔔', labelAr: 'أخرى',   labelEn: 'Other',    color: 'from-amber-500 to-amber-600' },
};

interface TopNavProps {
  onOpenDrawer?: () => void;
  onOpenNotificationsCenter?: (category?: 'platform' | 'weyaak' | 'other' | 'all') => void;
  showCart?: boolean;
}

export function TopNav({ onOpenDrawer, onOpenNotificationsCenter, showCart = false }: TopNavProps) {
  const { t, language, textAlign } = useTranslation('common');
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, Segoe UI, sans-serif' : 'Cairo, sans-serif';

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Shop store for cart count
  const cart = useShopStore((state) => state.cart);
  const setCurrentView = useShopStore((state) => state.setCurrentView);
  const cartCount = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
  
  // Search store
  const setOpen = useSearchStore((state) => state.setOpen);
  const scope = useSearchStore((state) => state.scope);
  const openSearch = () => setOpen(true);

  // ─── Click outside to close ───
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  // ─── Dynamic counts ───
  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = notifications.length;

  const getFilteredNotifications = useCallback(() => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter(n => n.category === activeFilter);
  }, [notifications, activeFilter]);

  const filteredNotifications = getFilteredNotifications();

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return notifications.filter(n => !n.read).length;
    return notifications.filter(n => n.category === catId && !n.read).length;
  };

  // ─── Actions ───
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleViewAll = (category?: string) => {
    setShowNotifications(false);
    if (onOpenNotificationsCenter) {
      onOpenNotificationsCenter((category || 'all') as any);
    }
  };

  const getPlaceholder = () => {
    switch(scope) {
      case 'PROJECTS': return t('search.placeholderProjects') || (isEn ? 'Search projects...' : 'بحث في المشاريع...');
      case 'MATERIALS': return t('search.placeholderMaterials') || (isEn ? 'Search materials...' : 'بحث في المواد...');
      case 'CLIENTS': return t('search.placeholderClients') || (isEn ? 'Search clients...' : 'بحث في العملاء...');
      default: return t('search.placeholder');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md px-3 md:px-6 py-3 sticky top-0 z-40 shadow-sm border-b border-[#F5EEE1]">
      {/* Single Row: Logo | Search | Icons — Layout always RTL */}
      <div className="flex items-center justify-between gap-2 md:gap-4" dir="rtl">
        {/* Right Side (RTL) - Side Drawer Button + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={onOpenDrawer}
            className="p-2 hover:bg-[#2AA676]/10 rounded-lg transition-colors"
            aria-label={isEn ? 'Open menu' : 'فتح القائمة'}
          >
            <Menu className="w-6 h-6 text-[#1F3D2B]" />
          </button>
          <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <ImageWithFallback 
              src={bietAlreefLogo}
              alt="بيت الريف"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 min-w-0 max-w-xl mx-2 md:mx-4">
          <button
            onClick={openSearch}
            className="w-full bg-gradient-to-r from-[#F5EEE1] to-[#E5DED1] rounded-2xl px-3 md:px-4 py-2 md:py-2.5 flex items-center gap-2 md:gap-3 hover:shadow-md transition-all border border-[#4A90E2]/20 h-9 md:h-11"
          >
            <Search className="w-4 h-4 md:w-5 md:h-5 text-[#4A90E2] flex-shrink-0" />
            <span 
              className="flex-1 text-[#1F3D2B]/60 text-xs md:text-sm truncate block" 
              style={{ fontFamily, fontWeight: 600, textAlign }}
            >
              {getPlaceholder()}
            </span>
            <Mic className="w-4 h-4 md:w-5 md:h-5 text-[#2AA676] flex-shrink-0" />
          </button>
        </div>

        {/* Left Side (RTL) - Icons */}
        <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
          
          {/* Wallet Widget */}
          <WalletWidget />

          {/* Language Switch */}
          <div className="transform scale-90 md:scale-100">
             <LanguageSwitcher variant="compact" />
          </div>

          {/* Cart Icon - ONLY SHOWN IF showCart IS TRUE */}
          {showCart && (
            <button 
              className="relative flex-shrink-0 p-1.5 md:p-2"
              onClick={() => {
                if (!location.pathname.startsWith('/store') && !location.pathname.startsWith('/shop')) {
                  navigate('/store');
                }
                setCurrentView('cart');
              }}
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-[#1A5490]" />
              {cartCount > 0 && (
                <div className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-[#D4AF37] to-[#B5952F] rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                  <span className="text-black text-[8px] md:text-[9px]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                </div>
              )}
            </button>
          )}

          {/* ═══════════ NOTIFICATIONS ═══════════ */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative flex-shrink-0 p-1.5 md:p-2 rounded-xl transition-colors ${showNotifications ? 'bg-[#2AA676]/10' : 'hover:bg-gray-50'}`}
              aria-label={isEn ? 'Notifications' : 'الإشعارات'}
            >
              <Bell className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${showNotifications ? 'text-[#2AA676]' : 'text-[#1A5490]'}`} />
              {unreadCount > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-full flex items-center justify-center shadow-md"
                >
                  <span className="text-white text-[8px] md:text-[9px]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                </motion.div>
              )}
            </button>

            {/* ─── Notification Panel ─── */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 w-[340px] md:w-[400px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50"
                  dir="rtl"
                >
                  {/* Panel Header */}
                  <div className="bg-gradient-to-l from-[#1F3D2B] to-[#2AA676] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-white" />
                        <h3 className="text-white font-bold text-base" style={{ fontFamily }}>
                          {isEn ? 'Notifications' : 'الإشعارات'}
                        </h3>
                        {unreadCount > 0 && (
                          <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ fontFamily }}>
                            {unreadCount} {isEn ? 'new' : 'جديد'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-1 text-white/80 hover:text-white text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
                            style={{ fontFamily }}
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            {isEn ? 'Read all' : 'قراءة الكل'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                      {Object.entries(CATEGORY_META).map(([catId, meta]) => {
                        const count = getCategoryCount(catId);
                        const isActive = activeFilter === catId;
                        return (
                          <button
                            key={catId}
                            onClick={() => setActiveFilter(catId)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                              isActive
                                ? 'bg-white text-[#1F3D2B] shadow-md'
                                : 'bg-white/15 text-white/90 hover:bg-white/25'
                            }`}
                            style={{ fontFamily }}
                          >
                            <span className="text-sm">{meta.icon}</span>
                            <span>{isEn ? meta.labelEn : meta.labelAr}</span>
                            {count > 0 && (
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                isActive ? 'bg-[#2AA676] text-white' : 'bg-white/25 text-white'
                              }`}>
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-[380px] overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm font-semibold" style={{ fontFamily }}>
                          {isEn ? 'No notifications' : 'لا توجد إشعارات'}
                        </p>
                      </div>
                    ) : (
                      filteredNotifications.map((notif, index) => (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className={`group relative px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors cursor-pointer ${
                            !notif.read ? 'bg-[#2AA676]/[0.03]' : ''
                          }`}
                          onClick={() => {
                            if (!notif.read) markAsRead(notif.id);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              !notif.read ? 'bg-gradient-to-br from-[#2AA676]/15 to-[#2AA676]/5' : 'bg-gray-50'
                            }`}>
                              <span className="text-lg">{notif.icon}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm leading-tight ${!notif.read ? 'font-bold text-[#1F3D2B]' : 'font-semibold text-gray-600'}`} style={{ fontFamily }}>
                                  {isEn ? notif.titleEn : notif.titleAr}
                                </h4>
                                {!notif.read && (
                                  <div className="w-2 h-2 rounded-full bg-[#2AA676] flex-shrink-0 mt-1.5" />
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-1" style={{ fontFamily }}>
                                {isEn ? notif.messageEn : notif.messageAr}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <Clock className="w-3 h-3 text-gray-300" />
                                <span className="text-[10px] text-gray-300" style={{ fontFamily }}>
                                  {isEn ? notif.timeEn : notif.time}
                                </span>
                                {!notif.read && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notif.id);
                                    }}
                                    className="text-[10px] text-[#2AA676] hover:text-[#1F3D2B] font-semibold flex items-center gap-0.5 transition-colors"
                                    style={{ fontFamily }}
                                  >
                                    <Check className="w-3 h-3" />
                                    {isEn ? 'Mark read' : 'قراءة'}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Remove Button (on hover) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notif.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all flex-shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Panel Footer */}
                  <div className="border-t border-gray-100 p-3 bg-gray-50/50">
                    <button
                      onClick={() => handleViewAll(activeFilter)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-[#1F3D2B] to-[#2AA676] text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                      style={{ fontFamily }}
                    >
                      <span>{isEn ? 'View All Notifications' : 'عرض جميع الإشعارات'}</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}