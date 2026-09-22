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
import { OrderCenterView } from './features/orders/views/OrderCenterView';
import { TechVibeCareView } from './features/care/views/TechVibeCareView';
import { AdminRoute } from './components/layout/AdminRoute';
import { AdminDashboardView } from './features/admin/views/AdminDashboardView';
import { AdminOrdersView } from './features/admin/views/AdminOrdersView';
import { AdminProductsView } from './features/admin/views/AdminProductsView';
import { AdminPromosView } from './features/admin/views/AdminPromosView';
import { AdminTlaterRiskView } from './features/admin/views/AdminTlaterRiskView';
import { AdminTicketsView } from './features/admin/views/AdminTicketsView';
import { AdminLoginView } from './features/admin/views/AdminLoginView';

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
      { path: 'orders', element: <OrderCenterView /> },
      { path: 'care', element: <TechVibeCareView /> },
      { path: 'help', element: <Navigate to="/care" replace /> },
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
  },
  {
    path: '/admin/login',
    element: <AdminLoginView />,
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      { index: true, element: <AdminDashboardView /> },
      { path: 'orders', element: <AdminOrdersView /> },
      { path: 'products', element: <AdminProductsView /> },
      { path: 'promos', element: <AdminPromosView /> },
      { path: 'tlater-risk', element: <AdminTlaterRiskView /> },
      { path: 'customers', element: <div className="p-8">Customer Management (Coming Soon)</div> },
      { path: 'shipping', element: <div className="p-8">Shipping Management (Coming Soon)</div> },
      { path: 'tickets', element: <AdminTicketsView /> },
      { path: 'points', element: <div className="p-8">Vibe Points Management (Coming Soon)</div> },
    ]
  }
]);
