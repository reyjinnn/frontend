import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  
  const isDark = typeof window !== 'undefined' 
    ? localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    : false;

  if (isDark && typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  } else if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('dark');
  }

  return {
    isDarkMode: isDark,
    toggleTheme: () => set((state) => {
      const newIsDark = !state.isDarkMode;
      if (newIsDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return { isDarkMode: newIsDark };
    }),
    setTheme: (isDark) => set(() => {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return { isDarkMode: isDark };
    }),
  };
});
