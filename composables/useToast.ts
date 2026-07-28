import { ref } from 'vue';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
  function removeToast(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }

  function addToast(toast: Omit<Toast, 'id'>) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duration = toast.duration ?? 4000;

    const newToast: Toast = {
      ...toast,
      id,
      duration,
    };

    toasts.value.push(newToast);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }

  function success(title: string, message?: string, duration?: number) {
    return addToast({ title, message, type: 'success', duration });
  }

  function error(title: string, message?: string, duration?: number) {
    return addToast({ title, message, type: 'error', duration });
  }

  function warning(title: string, message?: string, duration?: number) {
    return addToast({ title, message, type: 'warning', duration });
  }

  function info(title: string, message?: string, duration?: number) {
    return addToast({ title, message, type: 'info', duration });
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
