import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router';
import { supabase } from './utils/supabase/client';
import { SEOHead } from './components/seo/SEOHead';
import { UserProvider } from './utils/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { WalletProvider } from './contexts/WalletContext';
import { ZoomProvider } from './contexts/ZoomContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

// Security
import { SecurityGuard } from './components/security/SecurityGuard';
import { ImageViewerProvider } from './components/security/ImageViewer';

// Layouts
import { BrowserLayout } from './components/layout/BrowserLayout';

// Screens / Content
import LoginApp from './LoginApp';
import { NewHomeContent } from './components/mobile/NewHomeContent';
import { ServicesContent } from './components/mobile/ServicesContent';
import { ServiceRouteHandler } from './components/ServiceRouteHandler';
import { ShopScreen } from './components/mobile/ShopScreen';
import { ToolsScreen } from './components/mobile/ToolsScreen';
import { WayakScreen } from './components/mobile/WayakScreen';
import { ProjectsScreen } from './components/mobile/ProjectsScreen';
import { ProfileScreen } from './components/mobile/ProfileScreen';
import { MapsScreen } from './components/mobile/MapsScreen';
import { RecommendationsScreen } from './components/mobile/RecommendationsScreen';
import { OffersScreen } from './components/mobile/OffersScreen';
import { MarketplaceScreen } from './components/mobile/MarketplaceScreen';
import { RFQScreen } from './components/mobile/RFQScreen';
import { ProjectDetail } from './components/mobile/ProjectDetail';
import { WalletScreen } from './components/mobile/WalletScreen';
import { PlatformShowcase } from './components/mobile/PlatformShowcase';
import SystemTest from './components/SystemTest';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function AppInner() {
  const [view, setView] = useState<'loading' | 'login' | 'main' | 'test'>('loading');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setView('main');
      } else {
        setView('login');
      }
    });
  }, []);

  const handleLoginComplete = () => {
    setView('main');
    navigate('/home', { replace: true });
  };

  if (view === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2AA676]"></div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
      <ZoomProvider>
        <SecurityGuard />
        <SEOHead />
        <UserProvider>
          <WalletProvider>
            <ImageViewerProvider>
            {view === 'login' ? (
              <LoginApp onComplete={handleLoginComplete} />
            ) : view === 'test' ? (
              <SystemTest />
            ) : (
              <Routes>
                {/* Main Browser App Layout */}
                <Route element={<BrowserLayout />}>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<NewHomeContent />} />
                  
                  {/* Services Routes */}
                  <Route path="/services" element={<ServicesContent />} />
                  <Route path="/services/:id" element={<ServiceRouteHandler />} />
                  <Route path="/services/:id/:city" element={<ServiceRouteHandler />} />
                  
                  {/* Other Main Sections */}
                  <Route path="/yak" element={<WayakScreen onClose={() => window.history.back()} />} />
                  <Route path="/projects" element={<ProjectsScreen />} />
                  <Route path="/projects/:id" element={<ProjectDetail onBack={() => window.history.back()} />} />
                  <Route path="/rfq" element={<RFQScreen onBack={() => window.history.back()} />} />
                  <Route path="/marketplace" element={<MarketplaceScreen />} />
                  
                  {/* Store & Tools */}
                  <Route path="/shop" element={<ShopScreen />} />
                  <Route path="/store/*" element={<ShopScreen />} />
                  <Route path="/tools" element={<ToolsScreen />} />
                  
                  {/* Wallet */}
                  <Route path="/wallet" element={<WalletScreen />} />
                  
                  {/* User & Maps */}
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/maps" element={<MapsScreen />} />
                  
                  {/* Extras */}
                  <Route path="/recommendations" element={<RecommendationsScreen />} />
                  <Route path="/offers" element={<OffersScreen />} />
                  
                  {/* Platform Showcase */}
                  <Route path="/platform" element={<PlatformShowcase onBack={() => window.history.back()} />} />
                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Route>
              </Routes>
            )}
            <Toaster />
            </ImageViewerProvider>
          </WalletProvider>
        </UserProvider>
      </ZoomProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}