import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, Info, X, Bell } from 'lucide-react';

export type ToastType = 'warning' | 'danger' | 'success' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  nubianSymbol?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastType, nubianSymbol?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message: string, type: ToastType = 'info', nubianSymbol?: string) => {
      const id = Date.now().toString() + Math.random().toString().slice(2, 6);
      
      // Select default hieroglyph symbol if not provided
      let defaultSymbol = '𓋹';
      if (type === 'danger' || type === 'warning') defaultSymbol = '𓃭'; // Nubian Lion / Alert
      if (type === 'success') defaultSymbol = '𓎛'; // Gold pot / Prosperity
      if (type === 'info') defaultSymbol = '𓈗'; // Nile water

      const newToast: ToastMessage = {
        id,
        title,
        message,
        type,
        nubianSymbol: nubianSymbol || defaultSymbol,
        duration: 5000,
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 toasts

      // Auto dismiss
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Render Container */}
      <div className="fixed top-5 left-5 z-[9999] max-w-sm w-full space-y-3 pointer-events-none dir-rtl font-sans">
        {toasts.map((toast) => {
          const isDanger = toast.type === 'danger';
          const isWarning = toast.type === 'warning';
          const isSuccess = toast.type === 'success';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl shadow-xl transition-all duration-300 transform translate-y-0 border-2 relative overflow-hidden backdrop-blur-md ${
                isDanger
                  ? 'bg-[#fff5f5] border-red-500/80 text-red-950 shadow-red-900/10'
                  : isWarning
                  ? 'bg-[#fffdf5] border-amber-500/90 text-amber-950 shadow-amber-900/15'
                  : isSuccess
                  ? 'bg-[#f6fff9] border-emerald-500/80 text-emerald-950 shadow-emerald-900/10'
                  : 'bg-[#faf8f5] border-amber-600/60 text-neutral-900 shadow-amber-900/10'
              }`}
            >
              {/* Nubian Papyrus Gold Accent Header Line */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                isDanger ? 'bg-red-600' : isWarning ? 'bg-amber-500' : isSuccess ? 'bg-emerald-500' : 'bg-amber-700'
              }`} />

              <div className="flex items-start gap-3">
                {/* Hieroglyphic Symbol Badge */}
                <div className={`p-2 rounded-lg shrink-0 flex items-center justify-center border text-xl leading-none ${
                  isDanger
                    ? 'bg-red-100 border-red-300 text-red-800'
                    : isWarning
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : isSuccess
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    : 'bg-amber-100/80 border-amber-200 text-amber-900'
                }`}>
                  <span>{toast.nubianSymbol}</span>
                </div>

                <div className="flex-1 pr-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    {isDanger && <AlertTriangle size={16} className="text-red-600 shrink-0" />}
                    {isWarning && <Bell size={16} className="text-amber-600 shrink-0" />}
                    {isSuccess && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                    <span>{toast.title}</span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed text-opacity-90 font-medium">
                    {toast.message}
                  </p>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors shrink-0"
                  title="إغلاق التنبيه"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Countdown Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
                <div
                  className={`h-full animate-toast-shrink ${
                    isDanger ? 'bg-red-500' : isWarning ? 'bg-amber-500' : isSuccess ? 'bg-emerald-500' : 'bg-amber-600'
                  }`}
                  style={{ animationDuration: `${toast.duration || 5000}ms` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
