import { Button as HeroButton} from '@heroui/react';

import { useNav } from '@/hooks'
import { handleCopy } from '@/utils/handleCopy';

const baseProps = {
  spinnerPlacement: 'end'
}

const variants = {
  base: {
    color: 'primary',
    variant: 'solid',
    size: 'sm'
  },
  submitForm: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
    fullWidth: true
  },
  secondForm: {
    color: 'primary',
    variant: 'faded',
    size: 'md',
    fullWidth: true
  }
}

const ShareButton = ({ ...props }) => {
  const { currentUrl } = useNav();

  const handleShare = () => {
    handleCopy(currentUrl)
      .then(
        alert('¡Copiado al portapapeles!')
      )
      .catch((error) =>
        console.error(`Error al copiar: ${error}`)
      );
  }

  return <Button onClick={handleShare} {...props}>{'Compartir'}</Button>
};

const Button = ({
  children,
  variant='base',
  heroVariant,
  onClick,
  isLoading,
  loadingText,
  className,
  ...props

}) => {
  const variantProps = variants[variant] || {};
  const allProps = {...baseProps, ...variantProps, ...props};

  if (variant === 'share') {
    return <ShareButton className={className} {...allProps} />
  }

  return (
    <HeroButton onPress={onClick} isLoading={isLoading} className={className} variant={heroVariant} {...allProps}>
      {isLoading ? (loadingText ? loadingText : children) : children}
    </HeroButton>
  );
};

export default Button;