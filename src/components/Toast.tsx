import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 3500,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-auto flex items-center justify-between p-3.5 px-4 rounded-xl shadow-2xl border text-xs font-medium bg-slate-900 text-white border-slate-800 animate-in slide-in-from-bottom-5 duration-150 max-w-md">
      <div className="flex items-center gap-2.5">
        {type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
        ) : type === 'info' ? (
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <span className="text-slate-100">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition ml-3"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
