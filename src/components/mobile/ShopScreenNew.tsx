// ====================================
// 🛒 Shop Screen - NEW MARKETPLACE SYSTEM
// بيت الريف - شاشة المتجر المحدثة
// ====================================

import { useState } from 'react';
import { Search, Grid3x3, List } from 'lucide-react';
import { 
  MOCK_MARKETPLACE_ITEMS, 
  MarketplaceItem, 
  MarketplaceFilterState 
} from '../../data/marketplace';
import { MarketplaceFilters } from './MarketplaceFilters';
import { MarketplaceGrid } from './MarketplaceGrid';
import { MarketplaceList } from './MarketplaceList';
import { MarketplaceItemDetail } from './MarketplaceItemDetail';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';

interface ShopScreenNewProps {
  activeTab?: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers';
  onTabChange?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
  onOpenSearch?: () => void;
  onOpenDrawer?: () => void;
}

export function ShopScreenNew({ activeTab = 'shop', onTabChange, onOpenSearch, onOpenDrawer }: ShopScreenNewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [filterState, setFilterState] = useState<MarketplaceFilterState>({
    category: 'all',
    sortBy: 'popular',
    hasOffer: false,
    inStockOnly: false
  });

  // Filter items
  const filteredItems = MOCK_MARKETPLACE_ITEMS.filter(item => {
    // Category filter
    if (filterState.category !== 'all' && item.category !== filterState.category) {
      return false;
    }

    // Offer filter
    if (filterState.hasOffer && !item.hasOffer) {
      return false;
    }

    // Stock filter
    if (filterState.inStockOnly && !item.isAvailable) {
      return false;
    }

    // Price range filter
    if (filterState.minPrice && item.price < filterState.minPrice) {
      return false;
    }
    if (filterState.maxPrice && item.price > filterState.maxPrice) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Sorting
    switch (filterState.sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'near_me':
        // TODO: Implement location-based sorting
        return 0;
      case 'popular':
      default:
        return b.reviewsCount - a.reviewsCount;
    }
  });

  // If item is selected, show detail page
  if (selectedItem) {
    return (
      <MarketplaceItemDetail
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
        onProviderClick={(providerId) => {
          console.log('Navigate to provider:', providerId);
          // TODO: Navigate to provider page
        }}
      />
    );
  }

  // Main shop screen
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#F5EEE1] to-white" dir="rtl">
      {/* TopNav */}
      <TopNav 
        activeTab={activeTab}
        onTabChange={onTabChange}
        onOpenDrawer={onOpenDrawer}
        onOpenSearch={onOpenSearch}
      />

      {/* Content wrapper with flex-1 and overflow */}
      <div className="flex-1 flex flex-col overflow-hidden pb-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#4A90E2] via-[#56CCF2] to-[#4A90E2] px-5 pt-4 pb-4 shadow-xl rounded-b-[32px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '26px', lineHeight: 1.2 }}>
                المتجر
              </h1>
              <p className="text-white/90 text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                {filteredItems.length} منتج متاح
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all ${
                  viewMode === 'grid' ? 'bg-white text-[#4A90E2]' : 'bg-white/20 text-white'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all ${
                  viewMode === 'list' ? 'bg-white text-[#4A90E2]' : 'bg-white/20 text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A90E2]" />
            <input
              type="text"
              placeholder="ابحث عن منتج، مورد، أو خدمة..."
              onClick={() => {
                // TODO: Open FullSearchScreen
                console.log('Open full search screen');
              }}
              readOnly
              className="w-full bg-white rounded-[20px] pr-12 pl-4 py-3.5 text-[#1A1A1A] placeholder:text-[#1A1A1A]/50 border-2 border-transparent focus:border-white/50 outline-none shadow-lg cursor-pointer"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Filters */}
        <MarketplaceFilters
          filterState={filterState}
          onFilterChange={setFilterState}
          itemsCount={filteredItems.length}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'grid' ? (
            <MarketplaceGrid
              items={filteredItems}
              onItemClick={setSelectedItem}
            />
          ) : (
            <MarketplaceList
              items={filteredItems}
              onItemClick={setSelectedItem}
            />
          )}
        </div>
      </div>

      {/* BottomNav */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange || (() => {})} />
    </div>
  );
}