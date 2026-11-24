'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={toastStyles.container}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              ...toastStyles.toast,
              ...(toast.type === 'success'
                ? toastStyles.success
                : toast.type === 'error'
                ? toastStyles.error
                : toastStyles.info),
            }}
          >
            <span style={toastStyles.icon}>
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span style={toastStyles.message}>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const toastStyles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'none',
  },
  toast: {
    pointerEvents: 'auto',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 18px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: 500,
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    animation: 'fadeIn 0.2s ease-out',
    maxWidth: '380px',
    backdropFilter: 'blur(10px)',
  },
  icon: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    lineHeight: 1.4,
  },
  success: {
    background: '#0d2818',
    color: '#4ade80',
    border: '1px solid #166534',
  },
  error: {
    background: '#2d1215',
    color: '#f87171',
    border: '1px solid #991b1b',
  },
  info: {
    background: '#0f172a',
    color: '#38bdf8',
    border: '1px solid #0284c7',
  },
};

