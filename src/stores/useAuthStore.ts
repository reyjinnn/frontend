import { create } from 'zustand';

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
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setKycStatus: (status: 'unverified' | 'pending' | 'verified' | 'rejected') => void;
}

export const useAuthStore = create<AuthState>((set) => {
  let initialUser = null;
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        initialUser = JSON.parse(storedUser);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
  }

  return {
    user: initialUser,
    accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
    refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false,
    
    setTokens: (accessToken, refreshToken) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      set({ accessToken, refreshToken, isAuthenticated: true });
    },
    
    setUser: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    },
    
    login: (user, accessToken, refreshToken) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, accessToken, refreshToken, isAuthenticated: true });
    },
    
    logout: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    },
    
    setKycStatus: (status) => set((state) => {
      const updatedUser = state.user ? { ...state.user, kycStatus: status } : null;
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    }),
  };
});
