import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Layers,
  Navigation,
  X,
  MapPin,
  Store,
  User,
  AlertCircle
} from 'lucide-react';
import { GoogleMap, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { MapSearch, SearchFilters } from './MapSearch';
import { ProviderMapCard, ProviderStatus } from './ProviderMapCard';
import { ProviderMapPage } from './ProviderMapPage';
import { BottomNav } from './BottomNav';
import { useTranslation } from '../../contexts/LanguageContext';
import { supabase } from '../../utils/supabase/client';
import { toast } from 'sonner';

// ====================================
// 📌 Types & Interfaces
// ====================================

interface Provider {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  tags: string[];
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  distance: number;
  status: ProviderStatus;
  lat: number;
  lng: number;
  businessName: string;
  subcategories: string[];
  completedProjects: number;
  responseTime: string;
  completionRate: number;
  city: string;
  area: string;
  serviceRadius: string;
  workingHours: string;
  panorama360Url?: string;
  galleryImages: string[];
  videoUrl?: string;
  phoneNumber: string;
  whatsappNumber: string;
  reviews: any[];
  relatedProviders: any[];
}

interface MapLayer {
  id: string;
  label: string;
  color: string;
  icon: string;
  enabled: boolean;
}

interface MapsScreenProps {
  onMenuClick?: () => void;
  activeTab?: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers';
  onTabChange?: (tab: any) => void;
  onOpenSearch?: () => void;
  onOpenDrawer?: () => void;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 25.2048,
  lng: 55.2708
};

import { useGoogleMaps } from '../../components/providers/GoogleMapsLoader';

// ====================================
// 🗺️ Maps Screen Component
// ====================================

export function MapsScreen({
  onMenuClick,
  activeTab = 'maps',
  onTabChange,
  onOpenSearch,
  onOpenDrawer,
}: MapsScreenProps) {
  
  const { t, dir } = useTranslation('maps');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showProviderPage, setShowProviderPage] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearMeRadius, setNearMeRadius] = useState<number>(5000); // meters
  const [showNearMeCircle, setShowNearMeCircle] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  
  // Real Data State
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);

  // Map layers state
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'providers', label: t('providers'), color: 'bg-blue-500', icon: '🏢', enabled: true },
    { id: 'workshops', label: t('workshops'), color: 'bg-yellow-500', icon: '⚙️', enabled: true },
    { id: 'materials', label: t('materials'), color: 'bg-red-500', icon: '🧱', enabled: true },
  ]);

  const { isLoaded: scriptLoaded, loadError } = useGoogleMaps();

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMapInstance(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMapInstance(null);
  }, []);

  // Fetch Real Providers
  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .in('role', ['provider', 'supplier']);

        if (error) throw error;

        const mappedProviders: Provider[] = (data || []).map((p: any) => ({
             id: p.id,
             name: p.full_name || p.email?.split('@')[0] || 'Unknown',
             businessName: p.company_name || 'Business',
             category: p.role === 'supplier' ? 'Material Supplier' : 'Service Provider',
             tags: [p.role],
             rating: 5.0,
             reviewCount: 0,
             distance: 0,
             status: 'available',
             lat: p.latitude || (25.2048 + (Math.random() - 0.5) * 0.1), // Mock lat if missing for demo
             lng: p.longitude || (55.2708 + (Math.random() - 0.5) * 0.1), // Mock lng if missing for demo
             subcategories: [],
             completedProjects: 0,
             responseTime: 'N/A',
             completionRate: 0,
             city: p.city || 'Dubai',
             area: '',
             serviceRadius: '',
             workingHours: '',
             galleryImages: [],
             phoneNumber: p.phone || '',
             whatsappNumber: p.phone || '',
             reviews: [],
             relatedProviders: []
        }));

        setProviders(mappedProviders);
        setFilteredProviders(mappedProviders);

      } catch (err) {
        console.error("Error fetching map providers:", err);
        toast.error("فشل تحميل بيانات الخريطة");
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);


  // ====================================
  // 🎯 Handlers
  // ====================================
  
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProviders(providers);
      return;
    }
    
    const filtered = providers.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProviders(filtered);
    
    // Fit bounds to filtered providers
    if (mapInstance && filtered.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      filtered.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
      mapInstance.fitBounds(bounds);
    }
  };

  const handleFilterChange = (filters: SearchFilters) => {
    let filtered = [...providers];
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category.includes(filters.category!));
    }
    setFilteredProviders(filtered);
  };

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    if (mapInstance) {
      mapInstance.panTo({ lat: provider.lat, lng: provider.lng });
      mapInstance.setZoom(15);
    }
  };

  const handleToggleLayer = (layerId: string) => {
    setLayers(layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, enabled: !layer.enabled }
        : layer
    ));
  };

  const handleNearMe = () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const newPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            setUserLocation(newPos);
            setShowNearMeCircle(true);
            
            if (mapInstance) {
                mapInstance.panTo(newPos);
                mapInstance.setZoom(14);
            }
            toast.success("تم تحديد موقعك");
        }, (error) => {
            toast.error("تعذر تحديد الموقع: " + error.message);
        });
    } else {
        toast.error("المتصفح لا يدعم تحديد الموقع");
    }
  };

  // ====================================
  // 🎨 Render Provider Page
  // ====================================
  
  if (showProviderPage && selectedProvider) {
    return (
      <ProviderMapPage
        {...selectedProvider}
        onBack={() => {
          setShowProviderPage(false);
          setSelectedProvider(null);
        }}
        onCallClick={() => window.open(`tel:${selectedProvider.phoneNumber}`)}
        onWhatsAppClick={() => window.open(`https://wa.me/${selectedProvider.whatsappNumber.replace('+', '')}`)}
        onRequestClick={() => {/* Handle request */}}
        onMapClick={() => setShowProviderPage(false)}
      />
    );
  }

  // ====================================
  // 🎨 Render Main Screen
  // ====================================
  
  return (
    <div className="min-h-screen bg-white relative pb-24" dir={dir}>
      
      {/* Search */}
      <MapSearch
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onVoiceSearch={() => {}}
      />

      {/* Map Container */}
      <div className="relative h-[calc(100vh-280px)]">
        {loadError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-red-500">
                <div className="text-center p-4">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p>فشل تحميل الخريطة. يرجى التحقق من مفتاح API.</p>
                </div>
            </div>
        ) : !scriptLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#F5EEE1]">
                 <div className="text-center text-gray-400 animate-pulse">
                     <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                     <p>جاري تحميل الخريطة...</p>
                 </div>
            </div>
        ) : (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={userLocation || defaultCenter}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    disableDefaultUI: true,
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
            >
                {/* User Location Marker */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: "#4285F4",
                            fillOpacity: 1,
                            strokeColor: "white",
                            strokeWeight: 2,
                        }}
                    />
                )}

                {/* Near Me Circle */}
                {userLocation && showNearMeCircle && (
                    <Circle
                        center={userLocation}
                        radius={nearMeRadius}
                        options={{
                            fillColor: "#4285F4",
                            fillOpacity: 0.1,
                            strokeColor: "#4285F4",
                            strokeOpacity: 0.3,
                            strokeWeight: 1,
                            clickable: false
                        }}
                    />
                )}

                {/* Provider Markers */}
                {filteredProviders.map(provider => (
                    <Marker
                        key={provider.id}
                        position={{ lat: provider.lat, lng: provider.lng }}
                        onClick={() => handleProviderClick(provider)}
                        icon={{
                            url: provider.category.includes('Supplier') 
                                ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" 
                                : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        }}
                    />
                ))}
            </GoogleMap>
        )}

        {/* Map Controls */}
        <button
          onClick={() => setShowLayers(!showLayers)}
          className="absolute bottom-24 left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1F3D2B] hover:bg-[#F5EEE1] transition-colors z-20"
        >
          <Layers className="w-6 h-6" />
        </button>

        <button
          onClick={handleNearMe}
          className="absolute bottom-24 right-4 w-12 h-12 bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all z-20"
        >
          <Navigation className="w-6 h-6" />
        </button>

        {/* Layers Panel */}
        {showLayers && (
          <div className="absolute bottom-40 left-4 bg-white rounded-2xl shadow-2xl p-4 w-64 z-20" dir="rtl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[#1F3D2B]">طبقات الخريطة</h3>
              <button onClick={() => setShowLayers(false)} className="text-gray-400 hover:text-[#1F3D2B]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => handleToggleLayer(layer.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#F5EEE1] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{layer.icon}</span>
                    <span className="text-sm text-[#1F3D2B]">{layer.label}</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${layer.enabled ? layer.color : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${layer.enabled ? 'right-0.5' : 'right-4'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Provider Mini Card */}
        {selectedProvider && !showProviderPage && (
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <ProviderMapCard
              providerId={selectedProvider.id}
              name={selectedProvider.name}
              nameEn={selectedProvider.nameEn}
              category={selectedProvider.category}
              tags={selectedProvider.tags}
              avatarUrl={selectedProvider.avatarUrl}
              rating={selectedProvider.rating}
              reviewCount={selectedProvider.reviewCount}
              distance={selectedProvider.distance}
              status={selectedProvider.status}
              onDetailsClick={() => setShowProviderPage(true)}
              onRequestClick={() => {/* Handle request */}}
              onWhatsAppClick={() => window.open(`https://wa.me/${selectedProvider.whatsappNumber}`)}
              onCallClick={() => window.open(`tel:${selectedProvider.phoneNumber}`)}
            />
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange || (() => {})} />
    </div>
  );
}
