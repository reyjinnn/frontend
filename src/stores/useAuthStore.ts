import { create } from 'zustand';
import { demoRepository } from '../lib/demoRepository';
import { authService } from '../services/auth.service';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  role?: 'customer' | 'admin';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  intendedAction: string | null;
  setIntendedAction: (action: string | null) => void;
  syncSession: () => void;
  logout: () => void;
  login: (user?: User, accessToken?: string, refreshToken?: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setKycStatus: (status: NonNullable<User['kycStatus']>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  intendedAction: null,
  setIntendedAction: (action) => set({ intendedAction: action?.startsWith('/') && !action.startsWith('//') && !action.includes('\\') ? action : null }),
  syncSession: () => {
    const session = demoRepository.session();
    if (!session) {
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      return;
    }
    const db = demoRepository.read();
    const user = db.customers.find(c => c.id === session.id);
    if (!user) {
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      return;
    }
    const { password: _password, ...safeUser } = user;
    set({ 
      user: safeUser, 
      accessToken: `demo-${safeUser.id}`, 
      refreshToken: `demo-refresh-${safeUser.id}`, 
      isAuthenticated: true 
    });
  },
  login: () => useAuthStore.getState().syncSession(),
  setTokens: () => useAuthStore.getState().syncSession(),
  setUser: () => useAuthStore.getState().syncSession(),
  setKycStatus: () => useAuthStore.getState().syncSession(),
  logout: () => {
    authService.logout();
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  }
}));

if (typeof window !== 'undefined') {
  useAuthStore.getState().syncSession();
  window.addEventListener('focus', () => useAuthStore.getState().syncSession());
  window.addEventListener('storage', (e) => {
    if (e.key === 'techvibe.session' || e.key === 'techvibe.demo.db.v1') {
      useAuthStore.getState().syncSession();
    }
  });
}

