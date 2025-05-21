import clsx from "clsx";

const ButtonContainer = ({ 
  children,
  className,
  ...props

}) => {
  const baseStyle = "flex justify-between gap-4 items-center";
  
  return(
    <div className={clsx(baseStyle, className)} {...props}>
      {children}
    </div>
  )
};

export default ButtonContainer;