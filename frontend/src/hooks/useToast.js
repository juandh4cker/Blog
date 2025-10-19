import { addToast } from '@heroui/react';

export const useToast = () => {
  return {
    toastMessage: (title, description) =>
      addToast({ title: title, description: description, color: 'primary' }),
    toastSuccess: (title, description) =>
      addToast({ title: title, description: description, color: 'success' }),
    toastWarning: (title, description) =>
      addToast({ title: title, description: description, color: 'warning' }),
    toastError: (title, description) =>
      addToast({ title: title, description: description, color: 'danger' }),
  };
};
