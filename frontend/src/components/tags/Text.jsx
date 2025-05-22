import clsx from 'clsx';

const Text = ({
  children,
  variant = 'text',
  className = '',
  tag = '',
  ...props
}) => {
  const baseStyle = 'text-center';

  const variants = {
    title: 'text-[2rem] text-[#2C3E50] my-2 font-bold bg-white/75 shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-[#ccc] p-3 rounded-[5px] w-fit',
    subtitle: 'text-base text-[#7F8C8D] my-2',
    text: 'text-[1.1rem] text-black my-2',
    hipertext: 'text-[1.1rem] text-[#2980B9] my-2 cursor-pointer underline',
  };

  const Tag = tag || (
    variant === 'title'
      ? 'h1'
      : variant === 'subtitle'
      ? 'h2'
      : variant === 'hipertext'
      ? 'span'
      : 'p'
  );

  const variantClass = variants[variant] || variants.text;

  return (
    <Tag className={clsx(baseStyle, variantClass, className)} {...props}>
      {children}
    </Tag>
  );
};

export default Text;