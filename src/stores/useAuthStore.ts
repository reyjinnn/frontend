import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setKycStatus: (status: 'unverified' | 'pending' | 'verified' | 'rejected') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false,
  
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },
  
  setUser: (user) => set({ user }),
  
  login: (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    // Ideally user data would also be cached or fetched after login
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
  
  setKycStatus: (status) => set((state) => ({
    user: state.user ? { ...state.user, kycStatus: status } : null
  })),
}));
