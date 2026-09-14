import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type NotificationType = 'emergency' | 'info' | 'success' | 'warning';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: Date;
  link?: string;
  data?: Record<string, unknown>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
  toasts: Notification[];
  dismissToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const MAX_TOASTS = 5;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((input: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const n: Notification = {
      ...input,
      id: crypto.randomUUID(),
      read: false,
      timestamp: new Date(),
    };
    setNotifications((prev) => [n, ...prev]);

    setToasts((prev) => {
      const next = [n, ...prev].slice(0, MAX_TOASTS);
      return next;
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== n.id));
    }, 6000);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        removeNotification,
        toasts,
        dismissToast,
      }}
    >
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

function ToastContainer() {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto animate-slide-up bg-white rounded-xl shadow-lg border p-4 transition-all duration-300 hover:shadow-xl ${
            toast.type === 'emergency'
              ? 'border-red-300 bg-red-50'
              : toast.type === 'warning'
              ? 'border-amber-300 bg-amber-50'
              : toast.type === 'success'
              ? 'border-green-300 bg-green-50'
              : 'border-brand-300 bg-brand-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              toast.type === 'emergency'
                ? 'bg-red-100 text-red-600'
                : toast.type === 'warning'
                ? 'bg-amber-100 text-amber-600'
                : toast.type === 'success'
                ? 'bg-green-100 text-green-600'
                : 'bg-brand-100 text-brand-600'
            }`}>
              <span className="text-lg">
                {toast.type === 'emergency' ? '🚨' : toast.type === 'warning' ? '⚠️' : toast.type === 'success' ? '✅' : 'ℹ️'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-night-800">{toast.title}</p>
              <p className="text-xs text-night-500 mt-0.5 line-clamp-2">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-night-400 hover:text-night-600 transition flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
