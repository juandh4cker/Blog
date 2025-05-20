import clsx from "clsx";

const Message = ({
  children,
  sucess = "",
  error = "",
  loading = false,
  className = "",
  ...props
  
}) => {
  const baseStyle = "text-center mt-4";

  const variants = {
    sucess: "text-green-600",
    error: "text-red-600",
    loading: "text-blue-600",
  };

  return (
    <>
      {sucess && (
        <p className={clsx(baseStyle, variants['sucess'], className)} {...props}>
          {sucess}
        </p>
      )}
      {error && (
        <p className={clsx(baseStyle, variants['error'], className)} {...props}>
          {error}
        </p>
      )}
      {loading && (
        <p className={clsx(baseStyle, variants['loading'], className)} {...props}>
          Cargando...
        </p>
      )}
      {!loading && !error && (
        <p className={clsx(baseStyle, className)} {...props}>
          {children}
        </p>
      )}
    </>
  );
};

export default Message;