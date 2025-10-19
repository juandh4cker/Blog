import { forwardRef, useEffect, useImperativeHandle } from 'react';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form as HeroForm } from '@heroui/react';
import clsx from 'clsx';

import KindsManager from '../KindsManager';

const baseProps = {
  className: 'flex flex-col w-full',
};

const kingdoms = {
  default: {
    component: (props) => <HeroForm {...props}>{props.children}</HeroForm>,
    kingdomProps: {},
  },
  form: {
    component: (props) => <HeroForm {...props}>{props.children}</HeroForm>,
    kingdomProps: {},
  },
};

const kinds = {
  default: {
    kingdom: 'default',
    props: {},
  },
  form: {
    kingdom: 'form',
    props: {},
  },
};

const defaultKind = 'form';

const Form = forwardRef(
  (
    {
      schema,
      defaultValues,
      onSubmit,
      children,
      className,
      isSubmitting,
      confirmExit = true, //??
      kind,
      ...props
    },
    ref,
  ) => {
    const methods = useForm({
      resolver: schema && zodResolver(schema),
      defaultValues,
    });

    useImperativeHandle(ref, () => ({
      reset: methods.reset,
      setValue: methods.setValue,
      getValues: methods.getValues,
    }));

    useEffect(() => {
      if (typeof isSubmitting === 'function') {
        isSubmitting(methods.formState.isSubmitting);
      }
    }, [methods.formState.isSubmitting, isSubmitting]);

    useEffect(() => {
      if (!confirmExit) return;

      const handleBeforeUnload = (e) => {
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

    const allProps = {
      onSubmit: methods.handleSubmit(onSubmit),
      className: clsx(baseProps.className, className),
      ...props,
    };

    return (
      <FormProvider {...methods}>
        <KindsManager
          baseProps={baseProps}
          kingdoms={kingdoms}
          kinds={kinds}
          kind={kind}
          defaultKind={defaultKind}
          {...allProps}
        >
          {children}
        </KindsManager>
      </FormProvider>
    );
  },
);

export default Form;
