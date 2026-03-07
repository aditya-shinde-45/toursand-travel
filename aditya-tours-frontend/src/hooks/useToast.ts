import { createContext, createElement, useContext, useMemo, useState, type ReactNode } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastContextValue {
  items: ToastMessage[];
  showToast: (type: ToastMessage['type'], text: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastMessage[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      items,
      showToast(type, text) {
        const id = crypto.randomUUID();
        setItems((prev) => [...prev, { id, type, text }]);
        setTimeout(() => {
          setItems((prev) => prev.filter((item) => item.id !== id));
        }, 3500);
      },
      removeToast(id) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      },
    }),
    [items],
  );

  return createElement(ToastContext.Provider, { value }, children);
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
