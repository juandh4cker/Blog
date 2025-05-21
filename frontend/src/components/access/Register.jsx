import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { handleRegister } from '../../api/auth';
import { registerSchema } from '../../schema/registerSchema';

import Button from '../tags/Button';
import Form from '../tags/Form';
import Input from '../tags/Input';
import Message from '../tags/Message';
import PasswordField from '../tags/PasswordField';

const Register = ({ setInLogin }) => {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const { formData, setInputData } = useForm({ username: '', email: '', password: '', confirmPassword: '' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      registerSchema.parse(formData);

    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        setError(error.errors[0].message);

      } else {
        setError('Error al validar los datos');
        
      }
      return;

    }

    setLoading(true);
    setError('');

    try {
      const response = await handleRegister(formData.username, formData.email, formData.password);
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
        <Input placeholder='Nombre de usuario' {...setInputData('username')} />
        <Input placeholder='Correo electrónico' type='email' {...setInputData('email')} />
        <PasswordField {...setInputData('password')} />
        <PasswordField confirm={true} {...setInputData('confirmPassword')} />
        <Button type='submit' disabled={loading}>{loading ? 'Registrando...' : 'Registarme'}</Button>
        <Button variant='secondary' onClick={() => setInLogin(true)}>{"Ya tengo una cuenta"}</Button>
      </Form>
      {error && <Message error={error} />}
    </>
  );
};

export default Register;