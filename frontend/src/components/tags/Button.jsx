import clsx from "clsx";

const Button = ({
  children,
  variant = "base",
  type = "button",
  className = "",
  ...props

}) => {
  const baseStyle = "rounded-[5px] font-base cursor-pointer my-1 transition duration-300 transform";

  const variants = {
    base: "bg-[#3498DB] text-white border-none py-3 px-4 text-base hover:bg-[#2980B9] hover:scale-[1.01]",
    secondary: "bg-[#f0f0f0] text-black border border-[#ccc] py-3 px-4 text-base hover:bg-[#e0e0e0] hover:scale-[1.01]",
    small: "bg-[#3498DB] text-white border-none py-2 px-3 text-sm hover:bg-[#2980B9] hover:scale-[1.01]",
  
  };

  return (
    <button
      type={type}
      className={clsx(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;