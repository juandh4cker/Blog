import { useForm } from 'react-hook-form';

import { useAuth } from '../../hooks/useAuth';
import { useNav } from '../../hooks/useNav';
import { apiLogin } from '../../api/auth';

import Button from '../tags/Button';
import Form from '../tags/Form';
import Input from '../tags/Input';

const Login = ({ setInLogin, setError }) => {
  const { setSession } = useAuth();
  const { navBlog } = useNav();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setError('')

    apiLogin(data.usernameOrEmail, data.password)
      .then((response) => {
        setSession({ username: response, isAuthenticated: true });
        navBlog();
      })
      .catch((error) => {
        setError(error.message || error);
      })
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder='Nombre de usuario o correo' {...register('usernameOrEmail')} />
      <Input variant="password" {...register('password')} />
      <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}</Button>
      <Button variant='secondary' onClick={() => setInLogin(false) } disabled={isSubmitting}>{'No tengo una cuenta'}</Button>
    </Form>
  );
};

export default Login;