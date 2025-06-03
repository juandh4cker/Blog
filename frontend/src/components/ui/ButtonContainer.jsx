import clsx from 'clsx';

const baseStyle = 'flex justify-between gap-4 items-center';

const ButtonContainer = ({
  children,
  className,
  ...props

}) => {
  return(
    <div className={clsx(baseStyle, className)} {...props}>
      {children}
    </div>
  )
};

export default ButtonContainer;