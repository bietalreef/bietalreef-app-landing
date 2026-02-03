// ====================================
// 📋 Marketplace List View Component
// بيت الريف - عرض List للمتجر
// ====================================

import { MarketplaceItem } from '../../data/marketplace';
import { MarketplaceItemCard } from './MarketplaceItemCard';

interface MarketplaceListProps {
  items: MarketplaceItem[];
  onItemClick: (item: MarketplaceItem) => void;
}

export function MarketplaceList({ items, onItemClick }: MarketplaceListProps) {
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
    <div className="flex flex-col gap-3 p-4" dir="rtl">
      {items.map((item) => (
        <MarketplaceItemCard
          key={item.id}
          item={item}
          viewMode="list"
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
}
