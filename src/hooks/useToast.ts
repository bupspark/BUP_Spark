import { useState, useCallback, useEffect } from 'react';

export type ToastType = 'ok' | 'warn' | 'err';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Global state for toasts so we can trigger from anywhere if needed,
// but for simplicity we'll use a custom hook and context or just simple state
// Let's use a simple singleton or React Context.
// For now, let's keep it simple with an event emitter pattern.
type Listener = (toast: ToastMessage) => void;
let listeners: Listener[] = [];

export const toast = (message: string, type: ToastType = 'ok') => {
  const newToast = { id: Math.random().toString(36).substring(2, 9), message, type };
  listeners.forEach((listener) => listener(newToast));
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (newToast: ToastMessage) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3200);
    };

    listeners.push(handleToast);
    return () => {
      listeners = listeners.filter((l) => l !== handleToast);
    };
  }, []);

  return toasts;
}
