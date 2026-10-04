import { Link, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';
import { useCartStore } from '../../features/cart/useCartStore';
import { useEffect, useState } from 'react';
import { NotificationDropdown } from './NotificationDropdown';
import { User, Package, LifeBuoy, LogOut } from 'lucide-react';

export function Header() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { openLogin } = useUIStore();
  const { items, openCart, fetchCart } = useCartStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    useCartStore.setState({ items: [], totalItemAmount: 0, isLoading: false, isCartOpen: false });
    if (user?.role === 'customer') {
      fetchCart().catch(() => useCartStore.setState({ isLoading: false }));
    }
  }, [user?.id, user?.role, fetchCart]);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 liquid-glass-header border-b border-slate-200/90 dark:border-slate-800/90 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group h-10 min-h-[40px] px-1" aria-label="Beranda">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-logo font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-pumpkin transition">
                Tecvibe
              </span>
            </div>
          </div>
        </Link>

        {/* MAIN SEARCH BAR */}
        <div className="flex-1 max-w-2xl hidden md:flex items-center">
          <div className="w-full flex items-center rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-800 focus-within:border-pumpkin focus-within:bg-white dark:focus-within:bg-[#111] focus-within:ring-2 focus-within:ring-pumpkin/20 transition">
            <div className="pl-4 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input 
              type="text" 
              value={searchWord}
              onChange={e => setSearchWord(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && navigate(`/catalog?q=${encodeURIComponent(searchWord)}`)}
              placeholder="Cari laptop ASUS ROG, MacBook M2, Ryzen 9, iPhone 14 Pro..." 
              className="w-full px-3 py-2.5 bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none font-medium"
            />
            <button onClick={() => navigate(`/catalog?q=${encodeURIComponent(searchWord)}`)} className="px-5 min-h-[40px] bg-slate-900 dark:bg-slate-700 hover:bg-pumpkin dark:hover:bg-pumpkin text-white text-xs font-bold rounded-r-xl transition flex-shrink-0 flex items-center justify-center">
              Cari
            </button>
          </div>
        </div>

        {/* USER ACTIONS */}
        <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">

          <button 
            onClick={toggleTheme} 
            aria-label="Toggle theme"
            className="w-10 h-10 min-w-[40px] min-h-[40px] sm:w-11 sm:h-11 sm:min-w-[44px] sm:min-h-[44px] rounded-xl bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#262626] text-slate-700 dark:text-slate-300 transition flex items-center justify-center shrink-0"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>

          <div className="relative shrink-0">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="Notifications"
              className="relative w-10 h-10 min-w-[40px] min-h-[40px] sm:w-11 sm:h-11 sm:min-w-[44px] sm:min-h-[44px] rounded-xl bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#262626] text-slate-700 dark:text-slate-300 transition flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white dark:border-[#141414]">
                  {unreadNotifs > 9 ? '9+' : unreadNotifs}
                </span>
              )}
            </button>
            <NotificationDropdown 
              isOpen={isNotifOpen} 
              onClose={() => setIsNotifOpen(false)} 
              onUnreadCountChange={setUnreadNotifs}
            />
          </div>

          <Link 
            to="/wishlist" 
            aria-label="Wishlist"
            className="w-10 h-10 min-w-[40px] min-h-[40px] sm:w-11 sm:h-11 sm:min-w-[44px] sm:min-h-[44px] rounded-xl bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#262626] text-slate-700 dark:text-slate-300 transition flex items-center justify-center relative shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </Link>

          <button 
            onClick={openCart} 
            aria-label="Cart"
            className="relative w-10 h-10 min-w-[40px] min-h-[40px] sm:w-11 sm:h-11 sm:min-w-[44px] sm:min-h-[44px] rounded-xl bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#262626] text-slate-700 dark:text-slate-300 transition flex items-center justify-center shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-pumpkin text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#141414] shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
            {isAuthenticated ? (
              <div className="relative" onMouseLeave={() => setIsUserMenuOpen(false)}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  aria-label="User menu"
                  className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1A1A1A] transition text-left min-w-[40px] min-h-[40px] justify-center"
                >
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar User" className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700" />
                  <div className="hidden xl:flex flex-col text-left leading-none">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user?.name}</span>
                    <span className={`text-[10px] font-semibold mt-0.5 ${user?.kycStatus === 'verified' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {user?.kycStatus === 'verified' ? 'KYC Verified' : 'Unverified'}
                    </span>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-1 w-52 sm:w-56 bg-white dark:bg-[#1A1A1A] border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden py-2 z-50 animate-fade-in-up">
                      <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#141414] transition-colors">
                        <User className="w-4 h-4 text-slate-400" /> Profil Saya
                      </Link>
                      <Link to="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#141414] transition-colors">
                        <Package className="w-4 h-4 text-slate-400" /> Pesanan Saya
                      </Link>
                      <Link to="/care" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#141414] transition-colors">
                        <LifeBuoy className="w-4 h-4 text-slate-400" /> TechVibe Care
                      </Link>
                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                      <button onClick={() => { setIsUserMenuOpen(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        <LogOut className="w-4 h-4" /> Keluar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button 
                onClick={openLogin} 
                className="flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-[#1A1A1A] h-10 min-h-[40px] px-2.5 sm:px-3 rounded-xl transition-colors text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 shrink-0"
              >
                <User className="w-4 h-4 shrink-0" />
                <span>Masuk</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
