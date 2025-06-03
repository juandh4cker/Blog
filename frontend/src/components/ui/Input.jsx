import { useState, forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import clsx from 'clsx';

import Message from './Message';

const baseStyle = 'bg-white my-2 py-3 px-4 text-base rounded-[5px] border border-[#ccc] transition-transform transform hover:scale-[1.02] focus:border-[#3498db] focus:outline-none'

const Textarea = forwardRef(({ 
  className, 
  required, 
  ...commonProps 

}, ref) => {
  return (
    <textarea
      ref={ref}
      className={className}
      required={required}
      {...commonProps}
    />
  );
});

const PasswordField = forwardRef(({
  className,
  required,
  variant,
  ...commonProps

}, ref) => {

  const [showPassword, setShowPassword] = useState(false)
  const placeholder = variant === 'confirmPassword' ? 'Confirmar contraseña' : 'Contraseña'

  return (
    <div className='relative w-full max-w-full box-border'>
      <input
        ref={ref}
        className={clsx(className, 'pr-10 w-full box-border')}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        required={required}
        {...commonProps}
      />
      <button
        type='button'
        onClick={() => setShowPassword(prev => !prev)}
        className='absolute right-2 inset-y-0 my-auto bg-transparent opacity-50 hover:opacity-80 border-none p-0 m-0 flex items-center justify-center'
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  )
})

const BaseInput = forwardRef(({
  className,
  required,
  variant,
  type,
  ...commonProps

}, ref) => {
  const variantProps = (
    variant === 'rating' ? 
      { min: '1', max: '10', step: '0.1' } 

    : variant === 'email' ? 
      { placeholder: 'Correo electrónico', type: 'email' } 
      
    : 
      {}
  )

  return (
    <input
      ref={ref}
      className={clsx(baseStyle, className)}
      type={variant === 'rating' ? 'number' : type}
      required={required}
      {...variantProps}
      {...commonProps}
    />
  )
}
)

const VariantManager = ({
  className = '',
  type = 'text',
  required = true,
  variant = 'base',
  commonProps

}) => {

  if (variant === 'textarea') {
    return (
      <Textarea
        className={className}
        required={required}
        {...commonProps}
      />
    )
  }

  if (variant === 'password' || variant === 'confirmPassword') {
    return (
      <PasswordField 
        className={className}
        required={required}
        variant={variant}
        {...commonProps}
      />
    )
  }
  
  return (
    <BaseInput
      className={className}
      type={type}
      variant={variant}
      required={required}
      {...commonProps}
    />
  )
}

const Input = ({
  className = '',
  type = 'text',
  required = true,
  variant = 'base',
  name,
  ...props

}) => {
  const { register, formState: { errors } } = useFormContext()
  const commonProps = {...register(name), ...props}
  const error = errors[name]
  const baseClassName = clsx(baseStyle, className)

  return (
    <>
      <VariantManager 
        className={baseClassName}
        type={type}
        required={required}
        variant={variant}
        name={name}
        commonProps={commonProps}
      />
      {error && <Message error={error.message} />}
    </>
  )
  
}

export default Input;