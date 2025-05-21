import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { handleLogin } from '../../api/auth';

import Button from '../tags/Button';
import Form from '../tags/Form';
import Input from '../tags/Input';
import Message from '../tags/Message';
import PasswordField from '../tags/PasswordField';

const Login = ({ setInLogin }) => {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const { formData, setInputData } = useForm({ usernameOrEmail: '', password: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    setLoading(true);

    try {
      const response = await handleLogin(formData.usernameOrEmail, formData.password);
      setSession({ username: response, isAuthenticated: true })
      navigate('/blog');

    } catch (error) {
      setError(error.message || error);

    } finally {
      setLoading(false);

    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Input placeholder='Nombre de usuario o correo' {...setInputData('usernameOrEmail')} />
        <PasswordField {...setInputData('password')} />
        <Button type='submit' disabled={loading}>{loading ? 'Iniciando...' : 'Iniciar Sesión'}</Button>
        <Button variant='secondary' onClick={() => setInLogin(false)}>{"No tengo una cuenta"}</Button>
      </Form>
      {error && <Message error={error} />}
    </>
  );
};

export default Login;