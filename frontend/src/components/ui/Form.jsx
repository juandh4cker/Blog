import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

const baseStyle = 'flex flex-col w-full';

const Form = forwardRef(({
  schema,
  defaultValues,
  onSubmit,
  children,
  className = '',
  isSubmitting,
  confirmExit = true,
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

  useEffect(() => {
    if (!confirmExit) return;

    const handleBeforeUnload = e => {
      if (methods.formState.isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [confirmExit, methods.formState.isDirty]);

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