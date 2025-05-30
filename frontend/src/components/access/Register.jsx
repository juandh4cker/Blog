import { useState } from 'react';

import { useAuth, useNav } from '../../hooks';
import { apiRegister } from '../../api';
import { registerSchema } from '../../schema';

import { Button, Form, Input } from '../tags';

const Register = ({ from, setInLogin, setError }) => {
  const { setSession } = useAuth();
  const { nav, navBlog } = useNav();

  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setError('');

    return apiRegister(data.username, data.email, data.password)
      .then((response) => {
        setSession({ username: response, isAuthenticated: true })
        from ? nav(from) : navBlog();
      })
      .catch((error) => {
        setError(error.message || error);
      })
  };

  return (
    <Form
      defaultValues={{ username: '', email: '' , password: '' , confirmPassword: '' }} 
      schema={registerSchema} onSubmit={onSubmit} isSubmitting={setLoading}
    >
      <Input name="username" placeholder='Nombre de usuario'/>
      <Input name="email" variant='email'/>
      <Input name="password" variant="password"/>
      <Input name="confirmPassword" variant="confirmPassword"/>
      <Button type='submit' disabled={loading}>{loading ? 'Registrando...' : 'Registarme'}</Button>
      <Button variant='secondary' onClick={() => setInLogin(true)} disabled={loading}>{"Ya tengo una cuenta"}</Button>
    </Form>
  );
};

export default Register;