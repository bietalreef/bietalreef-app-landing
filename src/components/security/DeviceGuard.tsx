/**
 * DeviceGuard.tsx
 * Blocks desktop access completely.
 * Only mobile devices (phones/tablets via touch + screen width) are allowed.
 * Detects environment at runtime and shows a blocking screen if desktop.
 */
import { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

interface DeviceGuardProps {
  children: ReactNode;
}

function isMobileDevice(): boolean {
  // BYPASS: Allow preview in iframe (Figma Make / development environments)
  try {
    if (window.self !== window.top) {
      // Running inside an iframe — likely a preview environment, allow through
      return true;
    }
  } catch (e) {
    // Cross-origin iframe — also likely a preview, allow through
    return true;
  }

  // Check 1: Touch support
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check 2: User agent patterns (mobile browsers)
  const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
    navigator.userAgent
  );

  // Check 3: Screen width (max 1024px for tablets)
  const isSmallScreen = window.innerWidth <= 1024;

  // Check 4: Platform-specific
  const isMobilePlatform = /Mobi|Android|iPhone|iPad/i.test(navigator.platform || '');

  // If has touch AND (mobile UA OR small screen), it's mobile
  if (hasTouch && (mobileUA || isSmallScreen)) return true;

  // Fallback: If just has touch and small screen
  if (hasTouch && isSmallScreen) return true;

  // Special case: iPad with desktop mode
  if (hasTouch && /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1) return true;

  return false;
}

export function DeviceGuard({ children }: DeviceGuardProps) {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const { language } = useTranslation('common');
  const isEn = language === 'en';

  useEffect(() => {
    const checkDevice = () => {
      setIsAllowed(isMobileDevice());
    };

    checkDevice();

    // Re-check on resize (for responsive testing tools / DevTools toggle)
    const handleResize = () => {
      // Debounce
      clearTimeout((window as any).__deviceGuardTimer);
      (window as any).__deviceGuardTimer = setTimeout(checkDevice, 500);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Loading state
  if (isAllowed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5EEE1]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B7FE8]"></div>
      </div>
    );
  }

  // Desktop blocked
  if (!isAllowed) {
    return <DesktopBlockScreen isEn={isEn} />;
  }

  return <>{children}</>;
}

function DesktopBlockScreen({ isEn }: { isEn: boolean }) {
  return (
    <div 
      className="fixed inset-0 bg-gradient-to-b from-[#1F3D2B] to-[#0D1F15] flex items-center justify-center z-[99999] p-6"
      style={{ direction: 'rtl' }}
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center border border-white/20 shadow-2xl">
        {/* Phone Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] rounded-3xl flex items-center justify-center shadow-lg">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="1" width="14" height="22" rx="3" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="19" r="1" fill="white"/>
              <line x1="9" y1="4" x2="15" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-2xl font-bold text-white mb-3"
          style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}
        >
          {isEn ? 'Mobile Only App' : 'تطبيق للهواتف فقط'}
        </h1>

        {/* Description */}
        <p 
          className="text-white/70 text-sm leading-relaxed mb-6"
          style={{ 
            fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif',
            textAlign: isEn ? 'left' : 'right'
          }}
        >
          {isEn 
            ? 'Bait Al-Reef is designed exclusively for mobile devices. Please open this application on your phone or tablet for the best experience.'
            : 'منصة بيت الريف مُصمَّمة حصرياً للأجهزة المحمولة. يرجى فتح التطبيق من هاتفك أو جهازك اللوحي للحصول على أفضل تجربة.'
          }
        </p>

        {/* QR-like visual hint */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-center gap-3">
            <div className="text-3xl">📱</div>
            <div className="text-right">
              <p className="text-white/90 text-xs font-bold" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
                {isEn ? 'Scan & Open' : 'افتح من هاتفك'}
              </p>
              <p className="text-white/50 text-[10px]" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
                {isEn ? 'Visit bietalreef.com on mobile' : 'قم بزيارة bietalreef.com من الموبايل'}
              </p>
            </div>
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-[#2AA676] rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-[#2AA676] rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 bg-[#2AA676] rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
        </div>

        {/* Branding */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
            🏠 {isEn ? 'Bait Al-Reef — Smart Building Platform' : 'بيت الريف — منصة البناء الذكي'}
          </p>
        </div>
      </div>
    </div>
  );
}