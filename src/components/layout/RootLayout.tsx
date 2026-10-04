import { Outlet } from 'react-router-dom';
import { UtilityBar } from './UtilityBar';
import { Header } from './Header';
import { SubNavbar } from './SubNavbar';
import { Footer } from './Footer';
import { LoginModal } from '../../features/auth/LoginModal';
import { RegisterModal } from '../../features/auth/RegisterModal';
import { ToastContainer } from '../ui/Toast';
import { useUIStore } from '../../stores/useUIStore';
import { CartDrawer } from '../../features/cart/CartDrawer';
import { useThemeStore } from '../../stores/useThemeStore';
import { useEffect } from 'react';

export function RootLayout() {
  const { isLoginOpen, isRegisterOpen, closeLogin, closeRegister, openLogin, openRegister } = useUIStore();
  const isDarkMode = useThemeStore(s => s.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-50 transition-colors duration-200 flex flex-col">
      <ToastContainer />
      <UtilityBar />
      <Header />
      <SubNavbar />
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
      <CartDrawer />

      <div className="fixed bottom-4 right-4 bg-amber-200 text-amber-900 px-3 py-1 rounded shadow text-xs font-bold pointer-events-none z-50 opacity-70">MODE DEMO</div>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeLogin} 
        onOpenRegister={openRegister}
      />
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={closeRegister} 
        onOpenLogin={openLogin}
      />
    </div>
  );
}
