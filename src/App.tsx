/**
 * App.tsx — بيت الريف (تطبيق المتصفح)
 * ═══════════════════════════════════════
 * القاعدة الذهبية:
 * "The Web App is a Guest Experience. The Mobile App is the Platform."
 *
 * • شاشة الدخول مطلوبة لكل المستخدمين
 * • بعد الدخول: المستخدم = زائر بصلاحيات محدودة
 * • الراوتات المسموحة: تصفح، متجر، خدمات، خرائط، تصميم، عروض، محفظة الدار
 * • الراوتات المحظورة: مشاريع → صفحة "حمّل التطبيق"
 * • كل request يُوسَم بـ platform: "web_guest"
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router';
import { supabase } from './utils/supabase/client';
import { SEOHead } from './components/seo/SEOHead';
import { UserProvider } from './utils/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { WalletProvider } from './contexts/WalletContext';
import { ZoomProvider } from './contexts/ZoomContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrowserSessionProvider } from './contexts/BrowserSession';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

// Security
import { SecurityGuard } from './components/security/SecurityGuard';
import { ImageViewerProvider } from './components/security/ImageViewer';

// Login
import LoginApp from './LoginApp';

// Layouts
import { BrowserLayout } from './components/layout/BrowserLayout';

// Guest-allowed screens
import { NewHomeContent } from './components/mobile/NewHomeContent';
import { ServicesContent } from './components/mobile/ServicesContent';
import { ServiceRouteHandler } from './components/ServiceRouteHandler';
import { ShopScreen } from './components/mobile/ShopScreen';
import { ToolsScreen } from './components/mobile/ToolsScreen';
import { WayakScreen } from './components/mobile/WayakScreen';
import { MapsScreen } from './components/mobile/MapsScreen';
import { RecommendationsScreen } from './components/mobile/RecommendationsScreen';
import { OffersScreen } from './components/mobile/OffersScreen';
import { MarketplaceScreen } from './components/mobile/MarketplaceScreen';
import { PlatformShowcase } from './components/mobile/PlatformShowcase';
import { DesignStudio } from './components/browser/DesignStudio';
import { ProfileScreen } from './components/mobile/ProfileScreen';
import { WalletScreen } from './components/mobile/WalletScreen';
import ATSDashboard from './components/mobile/ATSDashboard';

// App-Only gate (for verified-only routes)
import { AppOnlyPage } from './components/browser/GuestGuard';

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
  const [view, setView] = useState<'loading' | 'login' | 'main'>('loading');
  const navigate = useNavigate();

  // Check for existing session on mount
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
    navigate('/home');
  };

  if (view === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2AA676]"></div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <LanguageProvider>
        <ThemeProvider>
          <LoginApp onComplete={handleLoginComplete} />
          <Toaster />
        </ThemeProvider>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
      <BrowserSessionProvider>
      <ZoomProvider>
        <SecurityGuard />
        <SEOHead />
        <UserProvider>
          <WalletProvider>
            <ImageViewerProvider>
            <Routes>
              {/* Design Studio — Full screen, no BrowserLayout */}
              <Route path="/design" element={<DesignStudio />} />
              
              {/* ATS Dashboard — Full screen, no BrowserLayout */}
              <Route path="/ats" element={<ATSDashboard />} />
              
              {/* Main Browser App Layout */}
              <Route element={<BrowserLayout />}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<NewHomeContent />} />
                
                {/* ✅ Guest-Allowed: Browse Services */}
                <Route path="/services" element={<ServicesContent />} />
                <Route path="/services/:id" element={<ServiceRouteHandler />} />
                <Route path="/services/:id/:city" element={<ServiceRouteHandler />} />
                
                {/* ✅ Guest-Allowed: Shop & Buy */}
                <Route path="/shop" element={<ShopScreen />} />
                <Route path="/store/*" element={<ShopScreen />} />
                
                {/* ✅ Guest-Allowed: Stores Map */}
                <Route path="/maps" element={<MapsScreen />} />
                
                {/* ✅ Guest-Allowed: Browse */}
                <Route path="/marketplace" element={<MarketplaceScreen />} />
                <Route path="/recommendations" element={<RecommendationsScreen />} />
                <Route path="/offers" element={<OffersScreen />} />
                <Route path="/tools" element={<ToolsScreen />} />
                
                {/* ✅ Guest-Allowed: Weyaak as Guide (not executor) */}
                <Route path="/yak" element={<WayakScreen onClose={() => window.history.back()} />} />
                
                {/* ✅ Guest-Allowed: Platform Showcase */}
                <Route path="/platform" element={<PlatformShowcase onBack={() => window.history.back()} />} />
                
                {/* ✅ Guest-Allowed: Profile (view only in browser) */}
                <Route path="/profile" element={<ProfileScreen />} />
                
                {/* ✅ Guest-Allowed: Dar Wallet */}
                <Route path="/wallet" element={<WalletScreen />} />
                
                {/* ❌ App-Only: Projects, RFQ → Download CTA */}
                <Route path="/projects" element={<AppOnlyPage />} />
                <Route path="/projects/:id" element={<AppOnlyPage />} />
                <Route path="/rfq" element={<AppOnlyPage />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Route>
            </Routes>
            <Toaster />
            </ImageViewerProvider>
          </WalletProvider>
        </UserProvider>
      </ZoomProvider>
      </BrowserSessionProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}