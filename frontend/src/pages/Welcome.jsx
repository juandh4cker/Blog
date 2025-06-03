import { useEffect, useState } from 'react';

import { useAuth, useNav, useTitle } from '../hooks';

import { apiLogin, apiRegister } from '../api';

import { registerSchema } from '../schema'

import { Button, Container, Form, Input, Message, Text } from '../components/ui';

const Welcome = ({ inRegister = false }) => {
  useTitle('Inicio', 'Inicia sesión o registrate');

  const { setAuth } = useAuth();
  const { from, navBlog, navFrom } = useNav();

  const [ inLogin, setInlogin ] = useState(!inRegister);
  const [ loading, setLoading ] = useState(false);

  const [ error, setError ] = useState('');

  const handleSubmit = async (apiFn, args) => {
  setError('');

  return apiFn(...args)
    .then((response) => {
      setAuth({ username: response, isAuthenticated: true });
      navFrom(() => navBlog());
    })
    .catch((error) => {
      setError(error.message || error);
    });
  };

  useEffect(() => {
    setError('');
  }, [inLogin]);

  return (
    <Container className='max-w-md'>
      <Text variant='title'>{'Bienvenido a WorldBlog'}</Text>
      <Text variant='subtitle'>
        {from ?
            'Necesitas iniciar sesión para ver este contenido'
          :
            'Descubre los mejores destinos alrededor del mundo'
        }
      </Text>
      {inLogin ?
        <Login handleSubmit={handleSubmit} setInLogin={setInlogin} loading={loading} setLoading={setLoading} />
        :
        <Register handleSubmit={handleSubmit} setInLogin={setInlogin} loading={loading} setLoading={setLoading} />
      }
      <Button variant='secondary' className='w-full' onClick={navBlog} disabled={loading}>{'Entrar como invitado'}</Button>
      {error && <Message error={error} />}
    </Container>
  );
};

const Login = ({ handleSubmit, setInLogin, loading, setLoading }) => {
  return (
    <Form
      defaultValues={{ usernameOrEmail: '', password: '' }}
      onSubmit={(data) => handleSubmit(apiLogin, [data.usernameOrEmail, data.password])}
      isSubmitting={setLoading} confirmExit={false}
    >
      <Input name='usernameOrEmail' placeholder='Nombre de usuario' />
      <Input name='password' variant='password' />
      <Button type='submit' disabled={loading}>{loading ? 'Iniciando...' : 'Iniciar Sesión'}</Button>
      <Button variant='secondary' onClick={() => setInLogin(false)} disabled={loading}>{'No tengo una cuenta'}</Button>
    </Form>
  );
};

const Register = ({ handleSubmit, setInLogin, loading, setLoading }) => {
  return (
    <Form
      defaultValues={{ username: '', email: '', password: '', confirmPassword: '' }}
      onSubmit={(data) => handleSubmit(apiRegister, [data.username, data.email, data.password])}
      isSubmitting={setLoading} schema={registerSchema} confirmExit={false}
    >
      <Input name='username' placeholder='Nombre de usuario'/>
      <Input name='email' variant='email'/>
      <Input name='password' variant='password'/>
      <Input name='confirmPassword' variant='confirmPassword'/>
      <Button type='submit' disabled={loading}>{loading ? 'Registrando...' : 'Registarme'}</Button>
      <Button variant='secondary' onClick={() => setInLogin(true)} disabled={loading}>{'Ya tengo una cuenta'}</Button>
    </Form>
  );
};

export default Welcome;