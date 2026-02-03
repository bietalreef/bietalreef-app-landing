import { useState, useEffect } from 'react';
import { PencilRuler } from 'lucide-react';
import { LanguageProvider } from './contexts/LanguageContext';
import { BottomNav } from './components/mobile/BottomNav';
import { TopNav } from './components/mobile/TopNav';
import { SideDrawer } from './components/mobile/SideDrawer';
import { WeyaakBubble } from './components/WeyaakBubble';
import { NewHomeContent } from './components/mobile/NewHomeContent';
import { ServicesContent } from './components/mobile/ServicesContent';
import { ServiceDetailPlumbing } from './components/mobile/ServiceDetailPlumbing';
import { ServiceDetailElectricity } from './components/mobile/ServiceDetailElectricity';
import { ServiceDetailAC } from './components/mobile/ServiceDetailAC';
import { ServiceDetailPainting } from './components/mobile/ServiceDetailPainting';
import { ServiceDetailCleaning } from './components/mobile/ServiceDetailCleaning';
import { ServiceDetailCarpentry } from './components/mobile/ServiceDetailCarpentry';
import { ServiceDetailInterior } from './components/mobile/ServiceDetailInterior';
import { ServiceDetailExterior } from './components/mobile/ServiceDetailExterior';
import { ServiceDetailConstruction } from './components/mobile/ServiceDetailConstruction';
import { ServiceDetailConsultation } from './components/mobile/ServiceDetailConsultation';
import { ServiceDetailConstructionContracting } from './components/mobile/ServiceDetailConstructionContracting';
import { ServiceDetailEngineeringConsultation } from './components/mobile/ServiceDetailEngineeringConsultation';
import { ServiceDetailMaintenance } from './components/mobile/ServiceDetailMaintenance';
import { ServiceDetailCraftsmen } from './components/mobile/ServiceDetailCraftsmen';
import { ServiceDetailWorkshops } from './components/mobile/ServiceDetailWorkshops';
import { ServiceDetailEquipmentRental } from './components/mobile/ServiceDetailEquipmentRental';
import { ServiceDetailBuildingMaterials } from './components/mobile/ServiceDetailBuildingMaterials';
import { ServiceDetailFurnitureDecor } from './components/mobile/ServiceDetailFurnitureDecor';
import { FullSearchScreen } from './components/mobile/FullSearchScreen';
import { YAKAssistant } from './components/mobile/YAKAssistant';
import { WayakScreen } from './components/mobile/WayakScreen';
import { ProjectsScreen } from './components/mobile/ProjectsScreen';
import { ProfileScreen } from './components/mobile/ProfileScreen';
import { ToolsScreen } from './components/mobile/ToolsScreen';
import { AIToolsDashboard } from './components/mobile/AIToolsDashboard';
import { RecommendationsScreen } from './components/mobile/RecommendationsScreen';
import { OffersScreen } from './components/mobile/OffersScreen';
import { RealEstateScreen } from './components/mobile/RealEstateScreen';
import { ShopScreen } from './components/mobile/ShopScreen';
import { MapsScreen } from './components/mobile/MapsScreen';
import { ProjectDetail } from './components/mobile/ProjectDetail';
import { RFQScreen } from './components/mobile/RFQScreen';
import { MarketplaceScreen } from './components/mobile/MarketplaceScreen';
import { StyleGuide } from './components/mobile/StyleGuide';
import { NotificationsCenter } from './components/mobile/NotificationsCenter';

import { useSearchStore } from './stores/search-store';

type TabType = 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'recommendations' | 'offers' | 'tools';
type AppScreen = 'main' | 'projectDetail' | 'rfq' | 'marketplace' | 'styleGuide' | 'serviceDetail' | 'fullSearch' | 'notificationsCenter';

interface MainAppProps {
  onLogout?: () => void;
}

export default function MainApp({ onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('main');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  
  // Optimized Zustand selectors to prevent unnecessary re-renders
  const showSearchScreen = useSearchStore((state) => state.isOpen);
  const setShowSearchScreen = useSearchStore((state) => state.setOpen);
  const setSearchScope = useSearchStore((state) => state.setScope);
  
  // const [showSearchScreen, setShowSearchScreen] = useState(false); // REMOVED
  // const [searchContext, setSearchContext] = useState<string>('home'); // Can be derived or kept for backup

  const [notificationCategory, setNotificationCategory] = useState<'platform' | 'weyaak' | 'crm' | 'user' | 'alerts' | 'offers' | 'all'>('all');
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);

  // --- PWA Logic ---
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const checkStandalone = () => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone === true || 
                           document.referrer.includes('android-app://');
        setIsInstalled(isStandalone);
    };
    checkStandalone();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

    const handler = (e: any) => {
        e.preventDefault();
        setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
      if (installPrompt) installPrompt.prompt();
  };

  const handleServiceClick = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCurrentScreen('serviceDetail');
  };

  const handleOpenNotificationsCenter = (category: 'platform' | 'weyaak' | 'crm' | 'user' | 'alerts' | 'offers' | 'all' = 'all') => {
    setNotificationCategory(category);
    setCurrentScreen('notificationsCenter');
  };

  const handleCloseNotificationsCenter = () => {
    setCurrentScreen('main');
  };

  // Context-Aware Search Logic
  useEffect(() => {
      let scope: any = 'GLOBAL';
      if (activeTab === 'projects') scope = 'PROJECTS';
      else if (activeTab === 'shop') scope = 'store'; // Mapping to store scope format if needed or use new enum
      else if (activeTab === 'realestate') scope = 'realEstate';
      // ... map other tabs
      
      // For now, we just map main ones. If we want strict typing we should align SearchStore types
      // Let's assume 'GLOBAL' is default fallback
      setSearchScope(scope);
  }, [activeTab, setSearchScope]);

  const handleOpenFullSearch = () => {
    setShowSearchScreen(true);
  };

  const handleOpenServiceSearch = (serviceName: string) => {
    // setSearchContext(`service:${serviceName}`); // We might need to add a specialized scope or pass prop
    setShowSearchScreen(true);
  };

  const handleCloseFullSearch = () => {
    setShowSearchScreen(false);
  };

  // التنقل من شاشة البحث
  const handleSearchNavigate = (route: string, id?: string) => {
    if (route === 'service' && id) {
      // فتح صفحة الخدمة
      setSelectedServiceId(id);
      setCurrentScreen('serviceDetail');
      setShowSearchScreen(false);
    } else if (route === 'shop') {
      // فتح المتجر
      setActiveTab('shop');
      setCurrentScreen('main');
      setShowSearchScreen(false);
    } else if (route === 'provider') {
      // في المستقبل، سيتم فتح صفحة المزود
      console.log('Open provider:', id);
      setShowSearchScreen(false);
    } else if (route === '/maps') {
      // فتح الخرائط
      setActiveTab('maps');
      setCurrentScreen('main');
      setShowSearchScreen(false);
    }
  };

  // Render the appropriate service detail component based on serviceId
  const renderServiceDetail = () => {
    switch (selectedServiceId) {
      case 'plumbing':
        return <ServiceDetailPlumbing onBack={() => setCurrentScreen('main')} onOpenSearch={() => handleOpenServiceSearch('Plumbing')} />;
      case 'electricity':
        return <ServiceDetailElectricity onBack={() => setCurrentScreen('main')} onOpenSearch={() => handleOpenServiceSearch('Electricity')} />;
      case 'ac':
        return <ServiceDetailAC onBack={() => setCurrentScreen('main')} onOpenSearch={() => handleOpenServiceSearch('Air Conditioning')} />;
      case 'painting':
        return <ServiceDetailPainting onBack={() => setCurrentScreen('main')} onOpenSearch={() => handleOpenServiceSearch('Painting')} />;
      case 'cleaning':
        return <ServiceDetailCleaning onBack={() => setCurrentScreen('main')} onNavigate={(tab) => setActiveTab(tab)} onOpenSearch={() => handleOpenServiceSearch('Cleaning Services')} />;
      case 'carpentry':
        return <ServiceDetailCarpentry onBack={() => setCurrentScreen('main')} />;
      case 'interior':
        return <ServiceDetailInterior onBack={() => setCurrentScreen('main')} />;
      case 'exterior':
        return <ServiceDetailExterior onBack={() => setCurrentScreen('main')} />;
      case 'construction':
        return <ServiceDetailConstruction onBack={() => setCurrentScreen('main')} onOpenSearch={() => handleOpenServiceSearch('Construction')} />;
      case 'consultation':
        return <ServiceDetailConsultation onBack={() => setCurrentScreen('main')} />;
      case 'constructionContracting':
        return <ServiceDetailConstructionContracting onBack={() => setCurrentScreen('main')} onNavigate={(tab) => setActiveTab(tab)} onOpenSearch={() => handleOpenServiceSearch('Construction Contracting')} />;
      case 'engineeringConsultation':
        return <ServiceDetailEngineeringConsultation onBack={() => setCurrentScreen('main')} onNavigate={(tab) => setActiveTab(tab)} onOpenSearch={() => handleOpenServiceSearch('Engineering Consultation')} />;
      case 'maintenance':
        return <ServiceDetailMaintenance onBack={() => setCurrentScreen('main')} onNavigate={(tab) => setActiveTab(tab)} onOpenSearch={() => handleOpenServiceSearch('Maintenance Companies')} />;
      case 'craftsmen':
        return <ServiceDetailCraftsmen onBack={() => setCurrentScreen('main')} onNavigate={(tab) => setActiveTab(tab)} onOpenSearch={() => handleOpenServiceSearch('Craftsmen')} />;
      case 'workshops':
        return <ServiceDetailWorkshops onBack={() => setCurrentScreen('main')} onNavigate={(tab) => setActiveTab(tab)} onOpenSearch={() => handleOpenServiceSearch('Workshops')} />;
      case 'equipmentRental':
        return <ServiceDetailEquipmentRental onBack={() => setCurrentScreen('main')} onNavigate={(tab) => setActiveTab(tab)} onOpenSearch={() => handleOpenServiceSearch('Equipment Rental')} />;
      case 'buildingMaterials':
        return <ServiceDetailBuildingMaterials onBack={() => setCurrentScreen('main')} onNavigate={(tab) => setActiveTab(tab)} onOpenSearch={() => handleOpenServiceSearch('Building Materials')} />;
      case 'furnitureDecor':
        return <ServiceDetailFurnitureDecor onBack={() => setCurrentScreen('main')} onNavigate={(tab) => setActiveTab(tab)} onOpenSearch={() => handleOpenServiceSearch('Furniture & Decor')} />;
      default:
        return <ServiceDetailPlumbing onBack={() => setCurrentScreen('main')} onOpenSearch={() => handleOpenServiceSearch('Plumbing')} />;
    }
  };

  // --- Gatekeeper UI ---
  // Removed as per user request
  // if (!isInstalled && !bypassInstall) { ... }

  return (
    <LanguageProvider>
      <div className="relative w-full min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white flex flex-col">
        {/* Side Drawer */}
        <SideDrawer 
          isOpen={isSideDrawerOpen}
          onClose={() => setIsSideDrawerOpen(false)}
          onNavigate={(route) => {
            // التنقل حسب المسار
            console.log('Navigate to:', route);
            
            // ربط الأقسام الرئيسية
            if (route === '/realestate') {
              setActiveTab('realestate');
              setCurrentScreen('main');
            } else if (route === '/shop') {
              setActiveTab('shop');
              setCurrentScreen('main');
            } else if (route === '/maps') {
              setActiveTab('maps');
              setCurrentScreen('main');
            } else if (route === '/profile') {
              setActiveTab('profile');
              setCurrentScreen('main');
            } else if (route === '/services') {
              setActiveTab('services');
              setCurrentScreen('main');
            } else if (route === '/home') {
              setActiveTab('home');
              setCurrentScreen('main');
            } else if (route === '/yak') {
              setActiveTab('yak');
              setCurrentScreen('main');
            } else if (route === '/tools') {
              // Open Tools screen
              setActiveTab('tools');
              setCurrentScreen('main');
            } else if (route === '/projects') {
              setActiveTab('projects');
              setCurrentScreen('main');
            } else if (route === '/design') {
              // Design section - will be implemented
              console.log('Design section clicked - coming soon');
            } else if (route === '/3d-library') {
              // 3D Library section - will be implemented  
              console.log('3D Library section clicked - coming soon');
            } else if (route === '/search') {
              // Smart search
              handleOpenFullSearch();
            }
            // ربط الأقسام الفرعية للخدمات
            else if (route === '/services/construction-contracting') {
              handleServiceClick('constructionContracting');
            } else if (route === '/services/engineering-consultation') {
              handleServiceClick('engineeringConsultation');
            } else if (route === '/services/maintenance-companies') {
              handleServiceClick('maintenance');
            } else if (route === '/services/craftsmen') {
              handleServiceClick('craftsmen');
            } else if (route === '/services/workshops') {
              handleServiceClick('workshops');
            } else if (route === '/services/equipment-rental') {
              handleServiceClick('equipmentRental');
            } else if (route === '/services/building-materials') {
              handleServiceClick('buildingMaterials');
            } else if (route === '/services/furniture-stores') {
              handleServiceClick('furnitureDecor');
            } else if (route === '/services/cleaning-services') {
              handleServiceClick('cleaning');
            }
            
            setIsSideDrawerOpen(false);
          }}
          currentRoute={`/${activeTab}`}
        />

        {/* Top Navigation Bar - Hidden in Fullscreen Mode */}
        {!isFullscreenMode && activeTab !== 'yak' && (
          <TopNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            onOpenDrawer={() => setIsSideDrawerOpen(true)}
            onOpenSearch={handleOpenFullSearch}
            onOpenNotificationsCenter={handleOpenNotificationsCenter}
            onInstallClick={handleInstallClick}
            isInstalled={isInstalled}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto ${isFullscreenMode || activeTab === 'yak' ? '' : 'md:pb-0 pb-20'}`}>
          {currentScreen === 'main' && (
            <>
              {activeTab === 'home' && <NewHomeContent />}
              {activeTab === 'services' && (
                <ServicesContent 
                  onServiceClick={handleServiceClick} 
                  onOpenFullSearch={handleOpenFullSearch}
                />
              )}
              {activeTab === 'yak' && <WayakScreen onClose={() => setActiveTab('home')} />}
              {activeTab === 'projects' && <ProjectsScreen />}
              {activeTab === 'profile' && <ProfileScreen />}
              {activeTab === 'realestate' && <RealEstateScreen />}
              {activeTab === 'shop' && <ShopScreen />}
              {activeTab === 'maps' && (
                <MapsScreen 
                  onMenuClick={() => setIsSideDrawerOpen(true)}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              )}
              {activeTab === 'recommendations' && <RecommendationsScreen />}
              {activeTab === 'offers' && <OffersScreen />}
              {activeTab === 'tools' && <ToolsScreen />}
            </>
          )}
          {currentScreen === 'projectDetail' && (
            <ProjectDetail onBack={() => setCurrentScreen('main')} />
          )}
          {currentScreen === 'rfq' && (
            <RFQScreen onBack={() => setCurrentScreen('main')} />
          )}
          {currentScreen === 'marketplace' && <MarketplaceScreen />}
          {currentScreen === 'styleGuide' && (
            <StyleGuide onBack={() => setCurrentScreen('main')} />
          )}
          {currentScreen === 'serviceDetail' && (
            renderServiceDetail()
          )}
          {showSearchScreen && (
            <FullSearchScreen onClose={handleCloseFullSearch} onNavigate={handleSearchNavigate} />
          )}
          {currentScreen === 'notificationsCenter' && (
            <NotificationsCenter 
              onBack={handleCloseNotificationsCenter}
              initialCategory={notificationCategory}
            />
          )}
        </div>

        {/* Weyaak AI Floating Bubble - Bottom Right - Hidden in Fullscreen */}
        {!isFullscreenMode && activeTab !== 'yak' && <WeyaakBubble position="fixed" />}

        {/* Bottom Navigation - موحد - Hidden in Fullscreen */}
        {!isFullscreenMode && activeTab !== 'yak' && (
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          />
        )}
      </div>
    </LanguageProvider>
  );
}