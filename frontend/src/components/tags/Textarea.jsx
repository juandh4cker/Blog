import clsx from "clsx";

const Textarea = ({
  className = "",
  type = "text",
  required = true,
  ...props
  
}) => {
  const baseStyle = "bg-white my-2 py-3 px-4 text-base rounded-[5px] border border-[#ccc] transition-transform transform hover:scale-[1.02] focus:border-[#3498db] focus:outline-none";

  return <textarea className={clsx(baseStyle, className)} type={type} required={required} {...props} />;
};

export default Textarea;