import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '../../hooks/useAuth';
import { useNav } from '../../hooks/useNav';
import { apiRegister } from '../../api/auth';
import { registerSchema } from '../../schema/registerSchema';

import Button from '../tags/Button';
import Form from '../tags/Form';
import Input from '../tags/Input';

const Register = ({ setInLogin, setError }) => {
  const { setSession } = useAuth();
  const { navBlog } = useNav();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setError('');

    apiRegister(data.username, data.email, data.password)
      .then((response) => {
        setSession({ username: response, isAuthenticated: true })
        navBlog();
      })
      .catch((error) => {
        setError(error.message || error);
      })
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder='Nombre de usuario' error={errors.username} {...register('username')} />
      <Input variant='email' error={errors.email} {...register('email')} />
      <Input variant="password" error={errors.password} {...register('password')} />
      <Input variant="confirmPassword" error={errors.confirmPassword} {...register('confirmPassword')} />
      <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Registrando...' : 'Registarme'}</Button>
      <Button variant='secondary' onClick={() => setInLogin(true)} disabled={isSubmitting}>{"Ya tengo una cuenta"}</Button>
    </Form>
  );
};

export default Register;