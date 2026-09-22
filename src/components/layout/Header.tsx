import { Link } from 'react-router-dom';
import { useThemeStore } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';
import { useCartStore } from '../../features/cart/useCartStore';
import { Moon, Sun, Search, Bell, Heart, ShoppingCart, User } from 'lucide-react';

export function Header() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { isAuthenticated, user } = useAuthStore();
  const { openLogin } = useUIStore();
  const { items, openCart } = useCartStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/75 dark:bg-[#141414]/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-2xl font-bold font-logo text-pumpkin">Tecvibe.</h1>
        </Link>
        
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari MacBook, iPhone, dll..." 
              className="w-full bg-slate-100 dark:bg-[#1A1A1A] border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-pumpkin focus:outline-none"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pumpkin">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] rounded-full transition-colors">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#141414]"></span>
          </button>

          <Link to="/wishlist" className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] rounded-full transition-colors">
            <Heart className="w-5 h-5" />
          </Link>

          <button onClick={openCart} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] rounded-full transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-pumpkin text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white dark:border-[#141414]">
                {totalItems}
              </span>
            )}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

          {isAuthenticated ? (
            <Link to="/profile" className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] py-1.5 px-3 rounded-full transition-colors">
              <div className="w-6 h-6 bg-pumpkin/10 text-pumpkin rounded-full flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col items-start hidden sm:flex justify-center">
                <span className="text-sm font-medium truncate max-w-[100px] leading-tight">{user?.name}</span>
                <span className={`text-[9px] uppercase font-bold tracking-wider mt-0.5 ${
                  user?.kycStatus === 'verified' ? 'text-green-500' :
                  user?.kycStatus === 'pending' ? 'text-orange-500' :
                  user?.kycStatus === 'rejected' ? 'text-red-500' :
                  'text-slate-400'
                }`}>
                  KYC: {user?.kycStatus || 'UNVERIFIED'}
                </span>
              </div>
            </Link>
          ) : (
            <button onClick={openLogin} className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] py-1.5 px-3 rounded-full transition-colors text-sm font-medium">
              <User className="w-4 h-4" /> Masuk
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
