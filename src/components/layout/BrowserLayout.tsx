import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { TopNav } from '../mobile/TopNav';
import { SideDrawer } from '../mobile/SideDrawer';
import { FullSearchScreen } from '../mobile/FullSearchScreen';
import { NotificationsCenter } from '../mobile/NotificationsCenter';
import { FooterDirectory } from '../seo/FooterDirectory';
import { useSearchStore } from '../../stores/search-store';
import { useTranslation } from '../../contexts/LanguageContext';
import { X } from 'lucide-react';

// Page title mapping
const PAGE_TITLES: Record<string, { ar: string; en: string; icon: string }> = {
  '/services': { ar: 'الخدمات', en: 'Services', icon: '🔧' },
  '/shop': { ar: 'المتجر', en: 'Store', icon: '🛒' },
  '/store': { ar: 'المتجر', en: 'Store', icon: '🛒' },
  '/tools': { ar: 'الأدوات', en: 'Tools', icon: '🛠️' },
  '/wallet': { ar: 'محفظة ريف', en: 'Reef Wallet', icon: '🪙' },
  '/profile': { ar: 'الملف الشخصي', en: 'Profile', icon: '👤' },
  '/maps': { ar: 'الخرائط', en: 'Maps', icon: '🗺️' },
  '/yak': { ar: 'وياك AI', en: 'Weyaak AI', icon: '🤖' },
  '/projects': { ar: 'المشاريع', en: 'Projects', icon: '📁' },
  '/rfq': { ar: 'طلب عرض سعر', en: 'RFQ', icon: '📋' },
  '/marketplace': { ar: 'السوق', en: 'Marketplace', icon: '🏪' },
  '/recommendations': { ar: 'التوصيات', en: 'Recommendations', icon: '⭐' },
  '/offers': { ar: 'العروض', en: 'Offers', icon: '🔥' },
};

function getPageInfo(pathname: string): { ar: string; en: string; icon: string } | null {
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
    <div className="relative w-full min-h-screen bg-background flex flex-col">
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
      {!isHome && pageInfo && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-[#F5EEE1] px-4 py-2.5 flex items-center justify-between sticky top-0 z-30">
          {/* Page Title */}
          <div className="flex items-center gap-2">
            <span className="text-lg">{pageInfo.icon}</span>
            <h2 
              className="text-sm font-bold text-[#1F3D2B]"
              style={{ fontFamily }}
            >
              {isEn ? pageInfo.en : pageInfo.ar}
            </h2>
          </div>

          {/* Close Button X */}
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-1.5 bg-[#1F3D2B]/8 hover:bg-red-50 hover:text-red-600 text-[#1F3D2B]/70 px-3 py-1.5 rounded-xl transition-all duration-200 group"
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
      )}

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