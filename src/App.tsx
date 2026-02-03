import { useState, useEffect } from 'react';
import { supabase } from './utils/supabase/client';
import { UserProvider } from './utils/UserContext'; // Import Provider
import MainApp from './MainApp';
import LoginApp from './LoginApp';
import SystemTest from './components/SystemTest'; // New Test Page
import { Toaster } from './components/ui/sonner';
import { GoogleMapsProvider } from './components/providers/GoogleMapsLoader';

export default function App() {
  const [view, setView] = useState<'loading' | 'login' | 'main' | 'test'>('loading');

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setView('main');
      } else {
        setView('login');
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('login');
  };

  if (view === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5EEE1]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B7FE8]"></div>
      </div>
    );
  }

  return (
    <UserProvider> {/* Wrap everything in UserProvider */}
      <GoogleMapsProvider>
        {view === 'login' ? (
          <LoginApp onComplete={() => setView('main')} />
        ) : view === 'test' ? (
          <SystemTest />
        ) : (
          <>
             <MainApp onLogout={handleLogout} />
             {/* Secret Dev Button to access Test Page */}
             <button 
               onClick={() => setView('test')}
               className="fixed bottom-4 left-4 z-50 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-50 hover:opacity-100"
             >
               SYSTEM TEST
             </button>
          </>
        )}
      </GoogleMapsProvider>
      <Toaster />
    </UserProvider>
  );
}
