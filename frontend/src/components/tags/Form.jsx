import clsx from "clsx";

const Form = ({
  children,
  className = "",
  ...props

}) => {
  const baseStyle = "flex flex-col w-full";

  return (
    <form
      className={clsx(baseStyle, className)}
      {...props}
    >
      {children}
    </form>
  );
};

export default Form;