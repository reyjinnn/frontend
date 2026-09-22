import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
<<<<<<< HEAD
  kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  role?: 'customer' | 'admin';
=======
  isKycVerified?: boolean;
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
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
<<<<<<< HEAD
  setKycStatus: (status: 'unverified' | 'pending' | 'verified' | 'rejected') => void;
=======
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
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
<<<<<<< HEAD
    
=======
    // Ideally user data would also be cached or fetched after login
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
<<<<<<< HEAD
  
  setKycStatus: (status) => set((state) => ({
    user: state.user ? { ...state.user, kycStatus: status } : null
  })),
=======
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
}));
