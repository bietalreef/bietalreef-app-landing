import React, { createContext, useContext, ReactNode } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { libraries, getGoogleMapsApiKey } from '../../utils/mapConfig';

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const apiKey = getGoogleMapsApiKey();
  
  // If no API key, don't try to load Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries,
    // Only load if we have an API key
    preventGoogleFontsLoading: false,
  });

  if (loadError) {
      console.error("Google Maps Load Error:", loadError);
  }

  // If no API key provided, show warning but still render children
  if (!apiKey) {
    console.warn('Google Maps will not be loaded: API key is missing');
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: false, loadError: new Error('API Key Missing') }}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  // Check if already loaded by other means (e.g. index.html)
  if (typeof window !== 'undefined' && window.google?.maps && !isLoaded) {
     return (
        <GoogleMapsContext.Provider value={{ isLoaded: true, loadError: undefined }}>
          {children}
        </GoogleMapsContext.Provider>
     );
  }

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}