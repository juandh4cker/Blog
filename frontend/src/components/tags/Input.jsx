import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import clsx from 'clsx';

import Message from './Message';

const Input = ({
  className = '',
  type = 'text',
  required = true,
  variant = 'base',
  name,
  ...props

}) => {
  const { register, formState: { errors } } = useFormContext()
  
  const baseStyle = 'bg-white my-2 py-3 px-4 text-base rounded-[5px] border border-[#ccc] transition-transform transform hover:scale-[1.02] focus:border-[#3498db] focus:outline-none'
  const error = errors[name]

  if (variant === 'textarea') {
    return (
      <>
        <textarea
          className={clsx(baseStyle, className)}
          required={required}
          {...register(name)}
          {...props}
        />
        {error && <Message error={error.message} />}
      </>
    )
  }

  if (variant === 'password' || variant === 'confirmPassword') {
    const [showPassword, setShowPassword] = useState(false)
    const placeholder = variant === 'confirmPassword' ? 'Confirmar contraseña' : 'Contraseña'
    return (
      <>
        <div className='relative w-full max-w-full box-border'>
          <input
            className={clsx(baseStyle, className, 'pr-10 w-full box-border')}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            required={required}
            {...register(name)}
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
        {error && <Message error={error.message} />}
      </>
    )
  }

  const ratingProps = variant === 'rating' ? { min: '1', max: '10', step: '0.1' } : {}
  const emailProps = variant === 'email' ? { placeholder: 'Correo electrónico', type: 'email' } : {}
  
  return (
    <>
      <input
        className={clsx(baseStyle, className)}
        type={variant === 'rating' ? 'number' : type}
        required={required}
        {...register(name)}
        {...props}
        {...ratingProps}
        {...emailProps}
      />
      {error && <Message error={error.message} />}
    </>
  )
}

export default Input