import clsx from 'clsx';

import { useNav } from '@/hooks/useNav'
import { handleCopy } from '@/utils/handleCopy';

const baseStyle = 'rounded-[5px] font-base cursor-pointer my-1 transition duration-300 transform';

const variants = {
  principal: {
    style: 'bg-[#3498DB] text-white border-none py-3 px-4 text-base hover:bg-[#2980B9] hover:scale-[1.01]',
  },
  secondary: {
    style: 'bg-[#f0f0f0] text-black border border-[#ccc] py-3 px-4 text-base hover:bg-[#e0e0e0] hover:scale-[1.01]',
  },
  small: {
    style: 'bg-[#3498DB] text-white border-none py-2 px-3 text-sm hover:bg-[#2980B9] hover:scale-[1.01]',
  },
};

const ShareButton = () => {
  const { currentUrl } = useNav();

  const handleShare = () => {
    handleCopy(currentUrl)
      .then(alert('¡Copiado al portapapeles!'));
  }

  return (
    <Button variant='small' onClick={handleShare}>{'Compartir'}</Button>
  )
};

const Button = ({
  children,
  className,
  variant,
  type = 'button',
  ...props

}) => {
  if (variant === 'share') {
    return <ShareButton />
  }

  const variantConfig = variants[variant] || variants.principal;

  const variantStyle = variantConfig['style'];

  return (
    <button type={type} className={clsx(baseStyle, variantStyle, className)} {...props}>
      {children}
    </button>
  );
};

export default Button;