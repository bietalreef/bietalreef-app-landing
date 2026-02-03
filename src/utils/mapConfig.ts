export const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places', 'geometry'];

// Helper to safely access import.meta.env
const getEnvVar = (key: string): string => {
  try {
    // Access import.meta.env safely
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const value = import.meta.env[key];
      if (value) return value as string;
    }
  } catch (error) {
    console.warn(`Unable to access import.meta.env.${key}:`, error);
  }
  return '';
};

export const getGoogleMapsApiKey = (): string => {
  // Try to get the API key from environment variables
  const apiKey = getEnvVar('VITE_GOOGLE_MAPS_API_KEY');
  
  if (!apiKey) {
    console.warn(
      'Google Maps API Key is missing!',
      'Please ensure VITE_GOOGLE_MAPS_API_KEY is set in your Supabase secrets.',
      'The secret should be added without the VITE_ prefix in Supabase, and will be automatically prefixed at build time.'
    );
  }
  
  return apiKey;
};
