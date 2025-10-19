import { HeroUIProvider as HUIP } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';

const toastProps = {
  radius: 'md',
  color: 'primary',
  variant: 'flat',
  timeout: 3000,
  classNames: {
    closeButton: 'opacity-100 absolute right-4 top-1/2 -translate-y-1/2',
  },
};

export const HeroUIProvider = ({ children }) => {
  return (
    <HUIP>
      <ToastProvider toastProps={toastProps} />
      {children}
    </HUIP>
  );
};
