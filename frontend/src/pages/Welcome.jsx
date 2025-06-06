import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useAuth, useNav, useTitle } from '@/hooks';
import { apiLogin, apiRegister } from '@/api';
import { registerSchema } from '@/schema'
import { Button, Container, Form, FormField, Message, Text } from '@/components/ui';

const Welcome = ({ inRegister = false }) => {
  useTitle('Inicio', 'Inicia sesión o registrate');
  const { setAuth } = useAuth();
  const { from, navBlog, navFrom } = useNav();
  const [inLogin, setInLogin] = useState(!inRegister);

  const onSuccess = (response) => {
    setAuth({ username: response, isAuthenticated: true });
    navFrom(() => navBlog());
  }

  const loginMutation = useMutation({
    mutationFn: ({ usernameOrEmail, password }) => apiLogin(usernameOrEmail, password),
    onSuccess: onSuccess
  });

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }) => apiRegister(username, email, password),
    onSuccess: onSuccess
  });

  const error = loginMutation.error || registerMutation.error;
  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <Container className='max-w-md'>
      <Text variant='title'>{'Bienvenido a WorldBlog'}</Text>
      <Text variant='subtitle'>
        {from
          ? 'Necesitas iniciar sesión para ver este contenido'
          : 'Descubre los mejores destinos alrededor del mundo'
        }
      </Text>

      {inLogin ? (
        <Login mutation={loginMutation} setInLogin={setInLogin} />
      ) : (
        <Register mutation={registerMutation} setInLogin={setInLogin} />
      )}

      <Button variant='secondary' className='w-full' onClick={navBlog} disabled={isLoading} >
        {'Entrar como invitado'}
      </Button>

      {error && <Message error={error} />}
    </Container>
  );
};

const Login = ({ mutation, setInLogin }) => {
  return (
    <Form
      defaultValues={{ usernameOrEmail: '', password: '' }} onSubmit={mutation.mutate}
      isSubmitting={mutation.isPending} confirmExit={false}
    >
      <FormField name='usernameOrEmail' placeholder='Nombre de usuario o email' />
      <FormField name='password' variant='password' placeholder='Contraseña' />

      <Button type='submit' disabled={mutation.isPending}>
        {mutation.isPending ? 'Iniciando...' : 'Iniciar Sesión'}
      </Button>

      <Button variant='secondary' onClick={() => setInLogin(false)} disabled={mutation.isPending} >
        {'No tengo una cuenta'}
      </Button>
    </Form>
  );
};

const Register = ({ mutation, setInLogin }) => {
  return (
    <Form
      defaultValues={{ username: '', email: '', password: '', confirmPassword: '' }} schema={registerSchema}
      onSubmit={mutation.mutate} isSubmitting={mutation.isPending} confirmExit={false}
    >
      <FormField name='username' placeholder='Nombre de usuario'/>
      <FormField name='email' variant='email' placeholder='Correo electrónico'/>
      <FormField name='password' variant='password' placeholder='Contraseña'/>
      <FormField name='confirmPassword' variant='confirmPassword' placeholder='Confirmar contraseña'/>

      <Button type='submit' disabled={mutation.isPending}>
        {mutation.isPending ? 'Registrando...' : 'Registarme'}
      </Button>

      <Button variant='secondary' onClick={() => setInLogin(true)} disabled={mutation.isPending} >
        {'Ya tengo una cuenta'}
      </Button>
    </Form>
  );
};

export default Welcome;