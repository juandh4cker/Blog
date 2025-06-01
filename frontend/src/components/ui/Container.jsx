import clsx from 'clsx';

const Container = ({
  children,
  className = '',
  ...props

}) => {
  const baseStyle = 'relative z-[1] mx-auto flex flex-col items-center p-8 rounded-[10px] bg-white/75 shadow-[0_4px_20px_rgba(0,0,0,0.1)]';

  return (
    <div className={clsx(baseStyle, className)} {...props} >
      {children}
    </div>
  );
};

export default Container;