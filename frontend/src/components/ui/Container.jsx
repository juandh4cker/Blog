import clsx from 'clsx';

const variants = {
  default: 
    'relative z-10 mx-auto flex flex-col items-center p-8 rounded-2xl bg-white/60 backdrop-blur-xs shadow-xl ring-4 ring-blue-100/30',
  button: 
    'flex justify-between gap-4 items-center',
}

const Container = ({
  children,
  variant,
  className,
  ...props

}) => {
  return (
    <div className={clsx(variants[variant] || variants['default'], className)} {...props} >
      {children}
    </div>
  );
};

export default Container;