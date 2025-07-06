import clsx from 'clsx';

import { useConfig, useNav } from '@/hooks'
import { handleCopy } from '@/utils/handleCopy';

const baseStyle = 'rounded-md font-base cursor-pointer my-1 transition duration-300 transform';

const variants = (th) => {
  return {
    principal: {
      style: `bg-${th.oneNormal} text-${th.normalColor} border-${th.oneDark} py-3 px-4 text-base hover:bg-${th.oneShade} hover:scale-105`,
    },
    secondary: {
      style: `bg-${th.secNormal} text-${th.secondColor} border border-${th.secDark} py-3 px-4 text-base hover:bg-${th.secShade} hover:scale-105`,
    },
    small: {
      style: `bg-${th.oneNormal} text-${th.normalColor} border-${th.oneDark} py-2 px-3 text-sm hover:bg-${th.oneShade} hover:scale-105`,
    }
  };
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

  const { theme } = useConfig();

  const themeVariant = variants(theme);
  const variantConfig = themeVariant[variant] || themeVariant.principal;

  const variantStyle = variantConfig['style'];
  console.log(variantStyle )

  return (
    <button type={type} className={clsx(baseStyle, variantStyle, className)} {...props}>
      {children}
    </button>
  );
};

export default Button;