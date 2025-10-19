import { useState } from 'react';

import { useFormContext } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  Input as HeroInput,
  Textarea as HeroTextarea,
  Autocomplete as HeroAutocomplete,
  AutocompleteItem as HeroAutocompleteItem,
} from '@heroui/react';

import KindsManager from '../KindsManager';

const baseProps = {
  isRequired: true,
};

const kingdoms = {
  default: {
    component: (props) => <HeroInput {...props}>{props.children}</HeroInput>,
    kingdomProps: {},
  },
  input: {
    component: (props) => <BaseInput {...props}>{props.children}</BaseInput>,
    kingdomProps: {
      size: 'sm',
    },
  },
  password: {
    component: (props) => <PasswordInput {...props}>{props.children}</PasswordInput>,
    kingdomProps: {
      label: 'Contraseña',
      size: 'sm',
    },
  },
  textarea: {
    component: (props) => <HeroTextarea {...props}>{props.children}</HeroTextarea>,
    kingdomProps: {
      label: 'Reseña',
      isClearable: true,
    },
  },
  autocomplete: {
    component: (props) => <HeroAutocomplete {...props}>{props.children}</HeroAutocomplete>,
    kingdomProps: {},
  },
  autocompleteItem: {
    component: (props) => <HeroAutocompleteItem {...props}>{props.children}</HeroAutocompleteItem>,
    kingdomProps: {},
  },
};

const kinds = {
  default: {
    kingdom: 'default',
    props: {},
  },
  input: {
    kingdom: 'input',
    props: {},
  },
  rating: {
    kingdom: 'input',
    props: {
      type: 'number',
      label: 'Calificación (0-10)',
      min: '1',
      max: '10',
      step: '0.1',
    },
  },
  email: {
    kingdom: 'input',
    props: {
      type: 'email',
      label: 'Correo electrónico',
    },
  },
  password: {
    kingdom: 'password',
    props: {},
  },
  confirmPassword: {
    kingdom: 'password',
    props: {
      label: 'Confirmar contraseña',
    },
  },
  textarea: {
    kingdom: 'textarea',
    props: {},
  },
  autocomplete: {
    kingdom: 'autocomplete',
    props: {},
  },
};

const defaultKind = 'input';

const BaseInput = ({ endContent, ...props }) => {
  return (
    <HeroInput
      endContent={
        <div className="absolute right-2 inset-y-0 my-auto flex items-center justify-center">
          {endContent}
        </div>
      }
      {...props}
    />
  );
};

const PasswordInput = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <BaseInput
      type={showPassword ? 'text' : 'password'}
      endContent={
        <button
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="text-lg bg-transparent opacity-50 hover:opacity-80 focus:outline-none border-none p-0 m-0"
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      }
      {...props}
    />
  );
};

const Input = ({
  name,
  kind,
  children,
  isInvalid,
  outForm = false, //??
  ...props
}) => {
  let register = () => ({});
  let errors = {};

  if (!outForm) {
    const formContext = useFormContext();
    register = formContext.register;
    errors = formContext.formState.errors;
  }

  const formProps = !outForm ? { ...register(name) } : {};
  const error = !outForm ? errors[name] : null;

  const allProps = {
    ...formProps,
    isInvalid: !!error || isInvalid,
    errorMessage: error?.message,
    ...props,
  };

  return (
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
  );
};

export default Input;

const autocompleteItemKinds = {
  autocompleteItem: {
    kingdom: 'autocompleteItem',
    props: {},
  },
  danger: {
    kingdom: 'autocompleteItem',
    props: {
      color: 'danger',
      className: 'text-danger',
    },
  },
};

const autocompleteItemDefaultKind = 'autocompleteItem';

Input.Item = HeroAutocompleteItem;

Input.Item2 = ({ children, kind, ...props }) => {
  const allProps = {
    ...props,
  };

  return (
    <KindsManager
      baseProps={baseProps}
      kingdom={kingdoms[autocompleteItemDefaultKind]}
      kinds={autocompleteItemKinds}
      kind={kind}
      defaultKind={autocompleteItemDefaultKind}
      {...allProps}
    >
      {children}
    </KindsManager>
  );
};
