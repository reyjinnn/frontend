import { useToastStore } from '../../stores/useToastStore';
import { cn } from '../../lib/utils';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-4 shadow-card-hover animate-in slide-in-from-right-full fade-in duration-300',
            'bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-800'
          )}
        >
          {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500 shrink-0" />}
          
          <div className="flex-1 flex flex-col pt-0.5">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {toast.title}
            </p>
            {toast.message && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {toast.message}
              </p>
            )}
          </div>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 focus:outline-none transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
