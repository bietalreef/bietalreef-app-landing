export const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places', 'geometry'];

export const getGoogleMapsApiKey = (): string => {
  try {
    let apiKey = '';

    // 1. Try import.meta.env (Standard Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
               import.meta.env.GOOGLE_MAPS_API_KEY || 
               '';
    }

    // 2. Try process.env (Fallback)
    if (!apiKey && typeof process !== 'undefined' && process.env) {
      apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || 
               process.env.GOOGLE_MAPS_API_KEY || 
               '';
    }

    // 3. Fallback for some specific environments that might inject it differently
    if (!apiKey && typeof window !== 'undefined') {
      // @ts-ignore
      apiKey = window.VITE_GOOGLE_MAPS_API_KEY || window.GOOGLE_MAPS_API_KEY || '';
    }

    // Debug logging
    if (!apiKey) {
      console.warn('⚠️ Google Maps API Key not found. Please ensure VITE_GOOGLE_MAPS_API_KEY is set.');
    }

    return apiKey;
  } catch (error) {
    console.error('❌ Error reading Google Maps API Key:', error);
    return '';
  }
};
