import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { TopNav } from '../mobile/TopNav';
import { SideDrawer } from '../mobile/SideDrawer';
import { WeyaakBubble } from '../WeyaakBubble';
import { FullSearchScreen } from '../mobile/FullSearchScreen';
import { NotificationsCenter } from '../mobile/NotificationsCenter';
import { useSearchStore } from '../../stores/search-store';

export function BrowserLayout() {
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCategory, setNotificationCategory] = useState<any>('all');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen: isSearchOpen, setOpen: setSearchOpen } = useSearchStore();

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
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white flex flex-col">
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

      {/* Weyaak AI Bubble */}
      <WeyaakBubble position="fixed" />

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