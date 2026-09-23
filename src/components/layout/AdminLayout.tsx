import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Tag, 
  Truck, 
  CreditCard, 
  Users, 
  Headset, 
  Award,
  Settings,
  Menu,
  Bell,
  Search,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dasbor', path: '/admin' },
  { icon: ShoppingCart, label: 'Semua Pesanan', path: '/admin/orders', badge: 3 },
  { icon: Package, label: 'Produk & Stok', path: '/admin/products' },
  { icon: Tag, label: 'Promo & Diskon', path: '/admin/promos' },
  { icon: Truck, label: 'Pengiriman', path: '/admin/shipping' },
  { icon: CreditCard, label: 'TLater Risk', path: '/admin/tlater-risk' },
  { icon: Users, label: 'Pelanggan & KYC', path: '/admin/customers' },
  { icon: Headset, label: 'Tiket & Bantuan', path: '/admin/tickets', badge: 1 },
  { icon: Award, label: 'Vibe Points', path: '/admin/points' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const getPageTitle = () => {
    const active = navItems.find(item => item.path === location.pathname || (item.path !== '/admin' && location.pathname.startsWith(item.path)));
    return active ? active.label : 'Admin Portal';
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#111] border-r border-slate-200 dark:border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <span className="font-space font-bold text-xl text-primary">Tech Vibe</span>
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">ADMIN</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' 
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="flex-1 text-sm text-left">Pengaturan Toko</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="flex-1 text-sm text-left font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-[#111] border-b border-slate-200 dark:border-slate-800 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-space font-bold text-lg md:text-xl hidden sm:block">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari pesanan, pelanggan..."
                className="pl-9 pr-4 py-2 w-64 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#111] rounded-full"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{user?.name}</p>
                <p className="text-xs text-slate-500 mt-1">Super Admin</p>
              </div>
              <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold font-space">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)}></div>
          <aside className="relative flex flex-col w-64 max-w-[80%] bg-white dark:bg-[#111] h-full shadow-2xl">
            <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
              <span className="font-space font-bold text-xl text-primary">Tech Vibe</span>
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">ADMIN</span>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-primary text-white font-medium' 
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-sm">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
