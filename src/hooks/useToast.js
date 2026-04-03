import { useToastContext } from '@/context/ToastContext';

/** type: 'success' | 'error' | 'warning' | 'info' */
export const useToast = () => {
  const { showToast, removeToast } = useToastContext();
  return { showToast, removeToast };
};
