import { useState, forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import clsx from 'clsx';

import Message from './Message';

const baseStyle = 'bg-white my-2 py-3 px-4 text-base rounded-[5px] border border-[#ccc] transition-transform transform hover:scale-[1.02] focus:border-[#3498db] focus:outline-none'

const variants = {
  base: {
    type: 'text',
  },
  textarea: {
    tag: 'textarea',
    placeholder: 'Reseña',
  },
  password: {
    placeholder: 'Contraseña'
  },
  confirmPassword: {
    placeholder: 'Confirmar contraseña'
  },
  rating: {
    props: {
      min: '1', 
      max: '10', 
      step: '0.1',
    },
    type: 'number',
    placeholder: 'Calificación (0-10)',
  },
  email: { 
    placeholder: 'Correo electrónico', 
    type: 'email' 
  } 
}

const PasswordField = forwardRef(({
  className,
  required,
  placeholder,
  ...props

}, ref) => {

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='relative w-full max-w-full box-border'>
      <input
        ref={ref}
        className={clsx(className, 'pr-10 w-full box-border')}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        required={required}
        {...props}
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

const VariantManager = ({
  className,
  type,
  required = true,
  variant = 'base',
  placeholder,
  commonProps

}) => {
  const variantConfig = variants[variant] || variants.base;

  const VariantPlaceholder = placeholder || variantConfig['placeholder'];
  const variantProps = variantConfig['props'] || {}
  const allProps = {...commonProps, ...variantProps}

  if (variant === 'password' || variant === 'confirmPassword') {
    return (
      <PasswordField 
      className={className}
      required={required}
      placeholder={VariantPlaceholder}
      {...allProps}
      />
    )
  }
  
  const VariantTag = variantConfig['tag'] || 'input';
  const VariantType = type || variantConfig['type'] || 'text';
  
  return (
    <VariantTag
      className={className}
      type={VariantType}
      required={required}
      placeholder={VariantPlaceholder}
      {...allProps}
    />
  )
}

const Input = ({
  className = '',
  type = 'text',
  required = true,
  variant = 'base',
  name,
  placeholder,
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
        placeholder={placeholder}
        commonProps={commonProps}
      />
      {error && <Message error={error.message} />}
    </>
  )
  
}

export default Input;