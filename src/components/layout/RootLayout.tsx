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

export function RootLayout() {
  const { isLoginOpen, isRegisterOpen, closeLogin, closeRegister, openLogin, openRegister } = useUIStore();

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
