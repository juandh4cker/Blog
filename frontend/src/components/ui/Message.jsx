import clsx from 'clsx';

const baseStyle = 'text-center';

const variants = {
  sucess: 'text-green-600',
  error: 'text-red-600',
  loading: 'text-blue-600',
};

const Message = ({
  children,
  error,
  loading,
  sucess,
  className,
  ...props
  
}) => {
  return (
    <>
      {sucess && (
        <p className={clsx(baseStyle, variants['sucess'], className)} {...props}>
          {sucess}
        </p>
      )}
      {error && (
        <p className={clsx(baseStyle, variants['error'], className)} {...props}>
          {error.message || error}
        </p>
      )}
      {loading && (
        <p className={clsx(baseStyle, variants['loading'], className)} {...props}>
          {'Cargando...'}
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