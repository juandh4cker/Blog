import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useApi, useAuth, useNav, useToast } from '@/hooks';
import { registerSchema } from '@/schema';
import { Button, Container, Form, Input, Text} from '@/components';

const Welcome = ({ inRegister = false }) => (
  <Container kind='background' className='max-w-md'>
    <Text kind='title'>{'Bienvenido a WorldBlog'}</Text>
    <Text>{'Descubre los mejores destinos alrededor del mundo'}</Text>

    <WelcomeForm inRegister={inRegister}/>
  </Container>
);

export const WelcomeForm = ({ inRegister }) => {
  const { setAuth } = useAuth();
  const { apiLogin, apiRegister } = useApi();
  const { navBlog } = useNav();
  const { toastError } = useToast();

  const [ inLogin, setInLogin ] = useState(!inRegister);
  const [ usernameOrEmailInput, setUsernameOrEmailInput ] = useState('');
  const [ emailInput, setEmailInput ] = useState('');

  const changePage = () => {
    if (inLogin) {
      if (usernameOrEmailInput && usernameOrEmailInput.includes('@')) {
        setEmailInput(usernameOrEmailInput);
        setUsernameOrEmailInput('');
      };

    } else {
      if (!usernameOrEmailInput && emailInput) {
        setUsernameOrEmailInput(emailInput);
        setEmailInput('');
      };
    }

    setTimeout(() => {
      setInLogin(!inLogin);
    }, 0);
  };

  const onSuccess = (response) => {
    setAuth({ username: response, isAuthenticated: true });
    navBlog();
  };

  const loginMutation = useMutation({
    mutationFn: ({ usernameOrEmail, password }) => apiLogin(usernameOrEmail, password),
    onSuccess: (response) => onSuccess(response),
    onError: (error) => toastError("Error al iniciar sesion", error.message),
  });

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }) => apiRegister(username, email, password),
    onSuccess: (response) => onSuccess(response),
    onError: (error) => toastError("Error al registrarte", error.message),
  });

  const mutation = inLogin ? loginMutation : registerMutation;

  return (
    <Form
      onSubmit={mutation.mutate} isSubmitting={mutation.isPending}
      schema={inLogin ? null : registerSchema} confirmExit={false}
    >
      <Input
        name={inLogin ? 'usernameOrEmail' : 'username'}
        label={inLogin ? 'Nombre de usuario o email' : 'Nombre de usuario'}
        value={usernameOrEmailInput} onValueChange={setUsernameOrEmailInput}
      />

      {!inLogin && (
        <Input name='email' kind='email' value={emailInput} onValueChange={setEmailInput} />
      )}

      <Input name='password' kind='password' />

      {!inLogin && <Input name='confirmPassword' kind='confirmPassword' />}

      <Button kind='primary' type='submit' isLoading={mutation.isPending}>
        {inLogin ? 'Iniciar Sesión': 'Registarme'}
      </Button>

      <Button kind='secondary' onClick={() => changePage()} isDisabled={mutation.isPending}>
        {inLogin ? 'No tengo una cuenta' : 'Ya tengo una cuenta'}
      </Button>

      <Button kind='secondary' onClick={navBlog} isDisabled={mutation.isPending}>
        {'Seguir sin cuenta'}
      </Button>
    </Form>
  );
};

export default Welcome;