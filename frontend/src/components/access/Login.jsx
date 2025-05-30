import { useState } from 'react';

import { useAuth, useNav } from '../../hooks';
import { apiLogin } from '../../api';

import { Button, Form, Input } from '../tags';

const Login = ({ from, setInLogin, setError }) => {
  const { setSession } = useAuth();
  const { nav, navBlog } = useNav();

  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setError('')

    return apiLogin(data.usernameOrEmail, data.password)
      .then((response) => {
        setSession({ username: response, isAuthenticated: true });
        from ? nav(from) : navBlog();
      })
      .catch((error) => {
        setError(error.message || error);
      })
  };

  return (
    <Form 
      defaultValues={{ usernameOrEmail: '', password: '' }}
      onSubmit={onSubmit} isSubmitting={setLoading}
    >
      <Input name="usernameOrEmail" placeholder="Nombre de usuario" />
      <Input name="password" variant="password" />
      <Button type='submit' disabled={loading}>{loading ? 'Iniciando...' : 'Iniciar Sesión'}</Button>
      <Button variant='secondary' onClick={() => setInLogin(false)} disabled={loading}>{'No tengo una cuenta'}</Button>
    </Form>
  );
};

export default Login;