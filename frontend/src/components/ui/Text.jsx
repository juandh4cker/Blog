import clsx from 'clsx';

const baseStyle = 'text-center';

const variants = {
  title: {
    style: 'text-4xl my-2 font-bold bg-white/75 shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-300 p-5 rounded-md w-fit',
    tag: 'h1'
  },
  subtitle: {
    style: 'text-base text-gray-600 my-2',
    tag: 'h2'
  },
  text: {
    style: 'text-lg text-black my-2',
    tag: 'p'
  },
  hipertext: {
    style: 'text-lg text-blue-400 my-2 cursor-pointer',
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

  return (
    <VariantTag className={clsx(baseStyle, variantStyle, className)} {...props}>
      {children}
    </VariantTag>
  );
};

export default Text;