import clsx from 'clsx';

const baseStyle = 'text-center';

const variants = {
  title: {
    style: 'text-[2rem] text-[#2C3E50] my-2 font-bold bg-white/75 shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-[#ccc] p-3 rounded-[5px] w-fit',
    tag: 'h1'
  },
  subtitle: {
    style: 'text-base text-[#7F8C8D] my-2',
    tag: 'h2'
  },
  text: {
    style: 'text-[1.1rem] text-black my-2',
    tag: 'p'
  },
  hipertext: {
    style: 'text-[1.1rem] text-[#2980B9] my-2 cursor-pointer',
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