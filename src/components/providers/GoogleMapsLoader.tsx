import React, { createContext, useContext, ReactNode } from 'react';
import { LoadScript } from '@react-google-maps/api';

// ====================================
// 🗺️ Google Maps Context & Provider
// ====================================

interface GoogleMapsContextType {
  isLoaded: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

interface GoogleMapsLoaderProps {
  children: ReactNode;
  googleMapsApiKey?: string;
}

/**
 * Provider component for Google Maps API
 * Wraps the entire app or specific sections that need maps
 * Uses VITE_GOOGLE_MAPS_API_KEY from environment variables
 */
export function GoogleMapsLoader({ 
  children, 
  googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '' 
}: GoogleMapsLoaderProps) {
  
  if (!googleMapsApiKey && typeof window !== 'undefined') {
    console.warn('⚠️ Google Maps API key not found. Set VITE_GOOGLE_MAPS_API_KEY in .env.local');
  }

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      onLoad={() => console.log('✅ Google Maps loaded')}
      onError={() => console.error('❌ Failed to load Google Maps')}
    >
      <GoogleMapsContext.Provider value={{ isLoaded: !!googleMapsApiKey }}>
        {children}
      </GoogleMapsContext.Provider>
    </LoadScript>
  );
}

/**
 * Hook to access Google Maps context
 * Use this in any component that needs Google Maps functionality
 */
export function useGoogleMaps(): GoogleMapsContextType {
  const context = useContext(GoogleMapsContext);
  
  if (!context) {
    console.warn(
      '⚠️ useGoogleMaps called outside GoogleMapsLoader provider. ' +
      'Ensure your component is wrapped with <GoogleMapsLoader />'
    );
    return { isLoaded: false };
  }
  
  return context;
}

// Optional: Default export for easier imports
export default GoogleMapsLoader;
