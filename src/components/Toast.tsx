import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-[#0B1120] px-5 py-4 text-white shadow-2xl border border-slate-800 animate-slide-in">
      {type === 'success' ? (
        <CheckCircle className="h-6 w-6 text-emerald-400" />
      ) : (
        <AlertCircle className="h-6 w-6 text-red-400" />
      )}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
