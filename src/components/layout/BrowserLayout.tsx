/**
 * BrowserLayout.tsx — الهيكل الرئيسي لتطبيق المتصفح
 * ═══════════════════════════════════════════════════
 * - شريط TopNav + SideDrawer + شريط عنوان الصفحة (بدون emoji)
 * - كل الأيقونات Lucide — ممنوع emoji (القاعدة الذهبية)
 */

import { useState, useEffect, useRef, type ComponentType } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { TopNav } from '../mobile/TopNav';
import { SideDrawer } from '../mobile/SideDrawer';
import { FullSearchScreen } from '../mobile/FullSearchScreen';
import { NotificationsCenter } from '../mobile/NotificationsCenter';
import { FooterDirectory } from '../seo/FooterDirectory';
import { useSearchStore } from '../../stores/search-store';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  X, Wrench, ShoppingCart, Hammer, MapPin, MessageSquareText,
  Store, Star, Flame, Ruler, Smartphone, User, Wallet,
  FileText, type LucideProps,
} from 'lucide-react';

/* ══════════ Page Title Map — Lucide icons فقط ══════════ */
interface PageInfo {
  ar: string;
  en: string;
  Icon: ComponentType<LucideProps>;
  iconColor: string;
}

const PAGE_TITLES: Record<string, PageInfo> = {
  '/services':        { ar: 'الخدمات',          en: 'Services',        Icon: Wrench,            iconColor: '#2AA676' },
  '/shop':            { ar: 'المتجر',           en: 'Store',           Icon: ShoppingCart,      iconColor: '#4A90E2' },
  '/store':           { ar: 'المتجر',           en: 'Store',           Icon: ShoppingCart,      iconColor: '#4A90E2' },
  '/tools':           { ar: 'الأدوات الذكية',   en: 'Smart Tools',     Icon: Hammer,            iconColor: '#D4AF37' },
  '/maps':            { ar: 'خريطة المحلات',    en: 'Stores Map',      Icon: MapPin,            iconColor: '#EF4444' },
  '/yak':             { ar: 'وياك دليلك',       en: 'Weyaak Guide',    Icon: MessageSquareText, iconColor: '#2AA676' },
  '/marketplace':     { ar: 'السوق',            en: 'Marketplace',     Icon: Store,             iconColor: '#8B5CF6' },
  '/recommendations': { ar: 'التوصيات',         en: 'Recommendations', Icon: Star,              iconColor: '#F59E0B' },
  '/offers':          { ar: 'العروض',           en: 'Offers',          Icon: Flame,             iconColor: '#EF4444' },
  '/design':          { ar: 'استوديو التصميم',  en: 'Design Studio',   Icon: Ruler,             iconColor: '#9B7AED' },
  // ✅ Guest-Allowed pages
  '/wallet':          { ar: 'محفظة الدار',      en: 'Dar Wallet',      Icon: Wallet,            iconColor: '#D4AF37' },
  '/profile':         { ar: 'الملف الشخصي',     en: 'Profile',         Icon: User,              iconColor: '#2AA676' },
  // ❌ App-Only pages
  '/projects':        { ar: 'متوفر في التطبيق', en: 'Available in App', Icon: Smartphone,       iconColor: '#6B7280' },
  '/rfq':             { ar: 'متوفر في التطبيق', en: 'Available in App', Icon: FileText,          iconColor: '#6B7280' },
};

function getPageInfo(pathname: string): PageInfo | null {
  // Exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Prefix match (e.g. /services/plumbing → /services)
  for (const [prefix, info] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(prefix) && prefix !== '/') return info;
  }
  return null;
}

export function BrowserLayout() {
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCategory, setNotificationCategory] = useState<any>('all');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen: isSearchOpen, setOpen: setSearchOpen } = useSearchStore();
  const { language } = useTranslation('common');
  const { isDark } = useTheme();
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, Segoe UI, sans-serif' : 'Cairo, sans-serif';
  const mainRef = useRef<HTMLElement>(null);

  // ── Scroll to top on route change ──
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    mainRef.current?.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  const handleNavigate = (route: string) => {
    console.log("Navigating to:", route);
    navigate(route);
    setIsSideDrawerOpen(false);
  };

  const handleOpenNotifications = (category: any = 'all') => {
    setNotificationCategory(category);
    setShowNotifications(true);
  };

  const isStore = location.pathname.startsWith('/store') || location.pathname.startsWith('/shop');
  const isHome = location.pathname === '/home' || location.pathname === '/';
  const pageInfo = getPageInfo(location.pathname);

  // If notifications screen is open, show it full screen
  if (showNotifications) {
      return (
          <NotificationsCenter 
              onBack={() => setShowNotifications(false)}
              initialCategory={notificationCategory}
          />
      )
  }

  return (
    <div className={`relative w-full min-h-screen flex flex-col ${isDark ? 'bg-[var(--bait-bg)]' : 'bg-background'}`}>
      {/* Side Drawer */}
      <SideDrawer 
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        onNavigate={handleNavigate}
        currentRoute={location.pathname}
      />

      {/* Top Navigation */}
      <TopNav 
        onOpenDrawer={() => setIsSideDrawerOpen(true)}
        onOpenNotificationsCenter={handleOpenNotifications}
        showCart={isStore}
      />

      {/* Page Close Bar — appears on ALL pages except Home */}
      {!isHome && pageInfo && (() => {
        const { Icon, iconColor } = pageInfo;
        return (
          <div className={`backdrop-blur-sm border-b px-4 py-2.5 flex items-center justify-between sticky top-0 z-30 ${
            isDark
              ? 'bg-[var(--bait-glass)] border-[var(--bait-border)]'
              : 'bg-white/80 border-[#F5EEE1]'
          }`}>
            {/* Page Title with Lucide Icon */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${iconColor}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: iconColor }} />
              </div>
              <h2 
                className={`text-sm font-bold ${isDark ? 'text-[var(--bait-text)]' : 'text-[#1F3D2B]'}`}
                style={{ fontFamily }}
              >
                {isEn ? pageInfo.en : pageInfo.ar}
              </h2>
            </div>

            {/* Close Button X */}
            <button
              onClick={() => navigate('/home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 group ${
                isDark
                  ? 'bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400'
                  : 'bg-[#1F3D2B]/8 hover:bg-red-50 hover:text-red-600 text-[#1F3D2B]/70'
              }`}
              aria-label={isEn ? 'Close page' : 'إغلاق الصفحة'}
            >
              <span 
                className="text-xs font-semibold group-hover:text-red-600"
                style={{ fontFamily }}
              >
                {isEn ? 'Close' : 'إغلاق'}
              </span>
              <X className="w-4 h-4 group-hover:text-red-600 transition-colors" />
            </button>
          </div>
        );
      })()}

      {/* Main Content Area */}
      <main ref={mainRef} className="flex-1">
        <Outlet />
        {/* Footer SEO Directory — crawlable internal links */}
        <FooterDirectory />
      </main>

      {/* Search Screen Overlay */}
      {isSearchOpen && (
        <FullSearchScreen 
          onClose={() => setSearchOpen(false)}
          onNavigate={(route, id) => {
            setSearchOpen(false);
            if (route === 'service' && id) navigate(`/services/${id}`);
            else if (route === 'shop') navigate('/shop');
            else if (route === 'provider') navigate(`/provider/${id}`);
            else if (route.startsWith('/')) navigate(route);
          }}
        />
      )}
    </div>
  );
}