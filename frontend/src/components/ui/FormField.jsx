import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {Input as HeroInput, Textarea as HeroTextarea, Autocomplete as HeroAutocomplete, AutocompleteItem} from "@heroui/react";

const baseProps = {
  size: 'sm',
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
      isClearable
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
        <div className='absolute right-2 inset-y-0 my-auto flex items-center justify-center'>
          <button
            aria-label="toggle password visibility"
            className="text-lg bg-transparent opacity-50 hover:opacity-80 focus:outline-none border-none p-0 m-0"
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <FaEyeSlash  /> : <FaEye />}
          </button>
        </div>
      }
      {...props}
    />
  )
}

const Autocomplete = ({ items, itemProps, ...props}) => {
  return (
   <HeroAutocomplete {...props}>
    {items.map((item, i) => (
      <AutocompleteItem key={i} {...itemProps}>{item.label}</AutocompleteItem>
    ))}
  </HeroAutocomplete>
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
  outForm = false,
  items, itemProps,
  ...props

}) => {
  let register = () => ({});
  let errors = {};

  if (!outForm) {
    const formContext = useFormContext();
    register = formContext.register;
    errors = formContext.formState.errors;
  }

  const commonProps = !outForm ? { ...register(name), ...props } : { ...props };
  const error = !outForm ? errors[name] : null;

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

  if (variant === 'autocomplete') {
    return (
      <Autocomplete
        items={items}
        itemProps={itemProps}
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