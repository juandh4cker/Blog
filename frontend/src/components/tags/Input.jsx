import clsx from "clsx";

const Input = ({
  className = "",
  type = "text",
  required = true,
  variant = "base",
  ...props
  
}) => {
  const baseStyle = "bg-white my-2 py-3 px-4 text-base rounded-[5px] border border-[#ccc] transition-transform transform hover:scale-[1.02] focus:border-[#3498db] focus:outline-none";

  if (variant === "textarea") {
    return (
      <textarea
        className={clsx(baseStyle, className)}
        required={required}
        {...props}
      />
    );
  }

  const ratingProps =
    variant === "rating"
      ? { min: "1", max: "10", step: "0.1" }
      : {};

  return (
    <input
      className={clsx(baseStyle, className)}
      type={variant === "rating" ? "number" : type}
      required={required}
      {...ratingProps}
      {...props}
    />
  );
};

export default Input;