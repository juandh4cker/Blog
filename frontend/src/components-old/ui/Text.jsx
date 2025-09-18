import clsx from 'clsx';
import {Link as HeroLink} from "@heroui/link";

const baseStyle = 'text-center';

const variants = {
  title: {
    style: 'text-4xl font-bold bg-white/75 shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-300 p-5 rounded-md w-fit',
    tag: 'h1'
  },
  subtitle: {
    style: 'text-base text-gray-600',
    tag: 'h2'
  },
  text: {
    style: 'text-lg text-black',
    tag: 'p'
  },
  hipertext: {
    style: 'text-lg text-blue-400 cursor-pointer',
    tag: 'span'
  },
};

const Text = ({
  children,
  variant,
  className,
  tag,
  ...props

}) => {
  const variantConfig = variants[variant] || variants.text;

  const VariantTag = tag || variantConfig['tag'];
  const variantStyle = variantConfig['style'];

  if (variant === 'hipertext') {
    return(
      <HeroLink className={className} {...props}/>
    )
  }

  return (
    <VariantTag className={clsx(baseStyle, variantStyle, className)} {...props}>
      {children}
    </VariantTag>
  );
};

export default Text;