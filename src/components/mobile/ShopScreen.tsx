import { useShopStore } from './shop/ShopStore';
import { ShopLayout } from './shop/ShopLayout';
import { StoreHome } from './shop/StoreHome';
import { ProductDetails } from './shop/ProductDetails';
import { CartScreen } from './shop/CartScreen';
import { Checkout } from './shop/Checkout';
import { OrderTracking } from './shop/OrderTracking';
import { OrderRating } from './shop/OrderRating';
import { OrderHistory } from './shop/OrderHistory';

export function ShopScreen() {
  const { currentView } = useShopStore();

  const renderContent = () => {
    switch(currentView) {
      case 'home': return <StoreHome />;
      case 'product': return <ProductDetails />;
      case 'cart': return <CartScreen />;
      case 'checkout': return <Checkout />;
      case 'tracking': return <OrderTracking />;
      case 'rating': return <OrderRating />;
      case 'history': return <OrderHistory />;
      default: return <StoreHome />;
    }
  };

  return (
    <ShopLayout>
      {renderContent()}
    </ShopLayout>
  );
}
