import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  fullscreen?: boolean;
}

const Modal = ({ isOpen, onClose, title, children, className, fullscreen = false }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div
        ref={modalRef}
        className={cn(
          'relative z-50 w-full animate-in fade-in zoom-in-95 duration-200',
          fullscreen ? 'h-full md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-3xl' : 'max-h-[90vh] max-w-lg rounded-3xl',
          'bg-white shadow-card-hover dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-800',
          'flex flex-col overflow-hidden',
          className
        )}
      >
        {(title || !fullscreen) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/60">
            {title ? (
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            ) : <div />}
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-pumpkin"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export { Modal };
