import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import clsx from 'clsx';

const Form = forwardRef(({
  schema,
  defaultValues,
  onSubmit,
  children,
  className = '',
  isSubmitting,
  ...props

}, ref) => {

  const methods = useForm({ resolver: schema && zodResolver(schema), defaultValues });

  useImperativeHandle(ref, () => ({ 
    reset: methods.reset, 
    setValue: methods.setValue, 
    getValues: methods.getValues 
  }));

  useEffect(() => {
    if (typeof isSubmitting === 'function') {
      isSubmitting(methods.formState.isSubmitting);
    }
  }, [methods.formState.isSubmitting, isSubmitting]);

  const baseStyle = 'flex flex-col w-full';

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={clsx(baseStyle, className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
});

export default Form;