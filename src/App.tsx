import { useState } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useThemeStore } from './stores/useThemeStore';
import { Button } from './components/ui/Button';
import { LoginModal } from './features/auth/LoginModal';
import { RegisterModal } from './features/auth/RegisterModal';
import { AddressList } from './features/address/AddressList';
import { ToastContainer } from './components/ui/Toast';
import { Moon, Sun, LogOut } from 'lucide-react';

function App() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <ToastContainer />
      
      {/* Header Liquid Glass */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/75 dark:bg-[#141414]/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-logo text-pumpkin">Tech<span className="text-charcoal dark:text-white">Vibe</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden sm:block">Hai, {user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                  <LogOut className="h-4 w-4" /> Keluar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsLoginOpen(true)}>Masuk</Button>
                <Button variant="primary" size="sm" onClick={() => setIsRegisterOpen(true)}>Daftar</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-card p-6 md:p-10 border border-slate-100 dark:border-slate-800/60">
          <h2 className="text-2xl font-semibold mb-6">Dashboard Profil (Sprint 1)</h2>
          
          {isAuthenticated ? (
            <div className="space-y-8">
              <div className="p-6 bg-slate-50 dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-lg mb-2">Informasi Akun</h3>
                <p className="text-slate-600 dark:text-slate-400">Nama: {user?.name}</p>
                <p className="text-slate-600 dark:text-slate-400">Email: {user?.email}</p>
                <p className="text-slate-600 dark:text-slate-400">No HP: {user?.phone}</p>
              </div>
              
              <AddressList />
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-4">Silakan masuk untuk melihat profil dan buku alamat Anda.</h3>
              <Button onClick={() => setIsLoginOpen(true)}>Masuk Sekarang</Button>
            </div>
          )}
        </div>
      </main>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onOpenRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onOpenLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}

export default App;
