import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
<<<<<<< HEAD
    
=======
    // Auto remove after 3s
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

<<<<<<< HEAD
=======
// Utility hook
>>>>>>> 80b7fdfac7784469269245387969793b7eabd139
export const useToast = () => {
  const { addToast } = useToastStore();
  return {
    toast: (props: Omit<Toast, 'id'>) => addToast(props),
  };
};
