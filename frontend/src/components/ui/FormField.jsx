import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {Input as HeroInput, Textarea as HeroTextarea} from "@heroui/react";

const baseProps = {
  size: 'sm'
}

const variants = {
  rating: {
    type: 'number',
    label: 'Calificación (0-10)',
    min: '1',
    max: '10',
    step: '0.1',
  },
  email: {
    type: 'email',
    label: 'Correo electrónico',
  }
}

const Textarea = ({
  label='Reseña',
  isRequired,
  isInvalid,
  errorMessage,
  className,
  ...props

}) => {
  return (
    <HeroTextarea 
      label={label}
      isRequired={isRequired}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      className={className}
      {...props}
    />
  )
}

const PasswordInput = ({
  label,
  confirm=false,
  isRequired,
  isInvalid,
  errorMessage,
  className,
  ...props

}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <HeroInput
      label={label ? label : (confirm ? 'Confirmar contraseña':"Contraseña")}
      type={showPassword ? "text" : "password"}
      isRequired={isRequired}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      className={className}
      endContent={
        <button
          aria-label="toggle password visibility"
          className="text-lg absolute right-2 inset-y-0 my-auto bg-transparent opacity-50 hover:opacity-80 focus:outline-none border-none p-0 m-0 flex items-center justify-center"
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? <FaEyeSlash  /> : <FaEye />}
        </button>
      }
      {...props}
    />
  )
}

const FormField = ({
  name,
  variant = 'base',
  heroVariant,
  isRequired = true,
  isInvalid,
  errorMessage,
  className,
  ...props

}) => {
  const { register, formState: { errors } } = useFormContext()
  const commonProps = {...register(name), ...props}
  const error = errors[name]

  const variantProps = variants[variant] || {};
  const allProps = {...commonProps, ...baseProps, ...variantProps, ...props}

  if (variant === 'password' || variant === 'confirmPassword') {
    return (
      <PasswordInput
        confirm={variant === 'confirmPassword' ? true : false}
        variant={heroVariant}
        isRequired={isRequired}
        isInvalid={error ? true : false}
        errorMessage={error?.message}
        className={className}
        {...allProps}
      />
    )
  };
  
  if (variant === 'textarea') {
    return (
      <Textarea
        variant={heroVariant}
        isRequired={isRequired}
        isInvalid={error ? true : false}
        errorMessage={error?.message}
        className={className}
        {...allProps}
      />
    )
  };

  return (
    <HeroInput
      variant={heroVariant}
      isRequired={isRequired}
      errorMessage={error?.message}
      isInvalid={error ? true : false}
      className={className}
      {...allProps}
    />
  )
};

export default FormField;