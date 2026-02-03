// ====================================
// 📱 Marketplace Grid View Component
// بيت الريف - عرض Grid للمتجر
// ====================================

import { MarketplaceItem } from '../../data/marketplace';
import { MarketplaceItemCard } from './MarketplaceItemCard';

interface MarketplaceGridProps {
  items: MarketplaceItem[];
  onItemClick: (item: MarketplaceItem) => void;
}

export function MarketplaceGrid({ items, onItemClick }: MarketplaceGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6" dir="rtl">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
          لم نجد منتجات
        </h3>
        <p className="text-sm text-[#1F3D2B]/60 text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          جرب تغيير الفلاتر أو البحث عن شيء آخر
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4" dir="rtl">
      {items.map((item) => (
        <MarketplaceItemCard
          key={item.id}
          item={item}
          viewMode="grid"
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
}
