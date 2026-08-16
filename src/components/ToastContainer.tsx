import { Check, Info, X } from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useDemo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-2xl animate-slide-in-right ${
            toast.variant === 'success'
              ? 'border-[#63FF0E]/40 bg-zinc-950 text-white'
              : 'border-zinc-700 bg-zinc-950 text-white'
          }`}
        >
          {toast.variant === 'success' ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#63FF0E] text-black">
              <Check className="h-3 w-3" />
            </span>
          ) : (
            <Info className="h-4 w-4 text-zinc-400" />
          )}
          <span className="text-sm font-medium">{toast.text}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="ml-2 text-zinc-500 transition hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
