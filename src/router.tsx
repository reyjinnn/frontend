import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { ProfileView } from './features/profile/views/ProfileView';
import { StorefrontView } from './features/catalog/views/StorefrontView';
import { CatalogView } from './features/catalog/views/CatalogView';
import { ProductDetailView } from './features/catalog/views/ProductDetailView';
import { WishlistView } from './features/catalog/views/WishlistView';
import { CheckoutView } from './features/checkout/views/CheckoutView';
import { TlaterHubView } from './features/tlater/views/TlaterHubView';
import { PointsWalletView } from './features/points/views/PointsWalletView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <StorefrontView /> },
      { path: 'catalog', element: <CatalogView /> },
      { path: 'product/:slug', element: <ProductDetailView /> },
      { path: 'wishlist', element: <WishlistView /> },
      { path: 'checkout', element: <CheckoutView /> },
      { path: 'tlater', element: <TlaterHubView /> },
      { path: 'points', element: <PointsWalletView /> },
      { 
        path: 'profile', 
        element: (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <ProfileView />
          </div>
        )
      },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);
