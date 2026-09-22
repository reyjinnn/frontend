import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
<<<<<<< HEAD
  
=======
  // Initialize from localStorage or system preference
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
  const isDark = typeof window !== 'undefined' 
    ? localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    : false;

  if (isDark && typeof document !== 'undefined') {
    document.body.classList.add('dark-theme');
  } else if (typeof document !== 'undefined') {
    document.body.classList.remove('dark-theme');
  }

  return {
    isDarkMode: isDark,
    toggleTheme: () => set((state) => {
      const newIsDark = !state.isDarkMode;
      if (newIsDark) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
      return { isDarkMode: newIsDark };
    }),
    setTheme: (isDark) => set(() => {
      if (isDark) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
      return { isDarkMode: isDark };
    }),
  };
});
