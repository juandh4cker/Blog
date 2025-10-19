import { useState } from 'react';

import { useApi, useAuth, useNav } from '@/hooks';
import { registerSchema } from '@/schema';
import { Button, Container, Form, Input, Text } from '@/components';

const Welcome = ({ inRegister = false }) => (
  <Container kind="background" className="max-w-md">
    <Text kind="title">{'Bienvenido a WorldBlog'}</Text>
    <Text>{'Descubre los mejores destinos alrededor del mundo'}</Text>

    <WelcomeForm inRegister={inRegister} />
  </Container>
);

export const WelcomeForm = ({ inRegister }) => {
  const { setAuth } = useAuth();
  const { login, register } = useApi();
  const { navBlog } = useNav();

  const [inLogin, setInLogin] = useState(!inRegister);
  const [usernameOrEmailInput, setUsernameOrEmailInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const changePage = () => {
    if (inLogin) {
      if (usernameOrEmailInput && usernameOrEmailInput.includes('@')) {
        setEmailInput(usernameOrEmailInput);
        setUsernameOrEmailInput('');
      }
    } else {
      if (!usernameOrEmailInput && emailInput) {
        setUsernameOrEmailInput(emailInput);
        setEmailInput('');
      }
    }

    setTimeout(() => {
      setInLogin(!inLogin);
    }, 0);
  };

  const mutation = inLogin ? login() : register();
  const handleSubmit = (values) => {
    mutation.mutate(values, {
      onSuccess: (response) => {
        setAuth({ username: response, isAuthenticated: true });
        navBlog();
      },
    });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      isSubmitting={mutation.isPending}
      schema={inLogin ? null : registerSchema}
      confirmExit={false}
    >
      <Input
        name={inLogin ? 'usernameOrEmail' : 'username'}
        label={inLogin ? 'Nombre de usuario o email' : 'Nombre de usuario'}
        value={usernameOrEmailInput}
        onValueChange={setUsernameOrEmailInput}
      />

      {!inLogin && (
        <Input name="email" kind="email" value={emailInput} onValueChange={setEmailInput} />
      )}

      <Input name="password" kind="password" />

      {!inLogin && <Input name="confirmPassword" kind="confirmPassword" />}

      <Button kind="primary" type="submit" isLoading={mutation.isPending}>
        {inLogin ? 'Iniciar Sesión' : 'Registarme'}
      </Button>

      <Button kind="secondary" onClick={() => changePage()} isDisabled={mutation.isPending}>
        {inLogin ? 'No tengo una cuenta' : 'Ya tengo una cuenta'}
      </Button>

      <Button kind="secondary" onClick={navBlog} isDisabled={mutation.isPending}>
        {'Seguir sin cuenta'}
      </Button>
    </Form>
  );
};

export default Welcome;
