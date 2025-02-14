import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerTry, setLocalStorage } from '../../useful/ApiService';

import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const isValidUsername = (name) => /^[a-zA-Z0-9._]+$/.test(name); // Letras, números, . o _
  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password); // Min 8 caracteres, 1 mayúscula, 1 minúscula, 1 número

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!isValidUsername(formData.username)) {
      setMessage('El nombre de usuario solo puede contener letras, números, "." o "_".');
      return;
    }

    if (!isValidPassword(formData.password)) {
      setMessage(
        'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número.'
      );
      return;
    }

    try {
      const response = await registerTry(formData.username, formData.email, formData.password);

      if (!response.hasOwnProperty('error')) {
        setLocalStorage('user', {username: response.username});
        setLocalStorage('token', response.token);
        setMessage('¡Bienvenido! Redirigiendo al dashboard...');
        setTimeout(() => navigate('/dashboard'), 2000);

      } else {
        setMessage(response.error);

      }
      
    } catch (error) {
      console.error('Error en el registro:', error);
      setMessage('Hubo un error en el registro. Intenta nuevamente.');
    }
  };

  return (
    <div className='register-page'>
      <div className='register-container'>
        <h2 className='register-title'>Registro para WorldBlog</h2>
        <p className='register-subtitle'>Únete y descubre los mejores destinos alrededor del mundo</p>
        <form onSubmit={handleSubmit} className='register-form'>
          <input
            type='text'
            className='register-input'
            placeholder='Nombre de usuario'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type='email'
            className='register-input'
            placeholder='Correo electrónico'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type='password'
            className='register-input'
            placeholder='Contraseña'
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type='submit' className='register-button'>
          {loading ? 'Registrando...' : 'Registarme'}
          </button>
          <button
            type='button'
            className='register-secondary-button'
            onClick={() => navigate('/login')}
          >
            Ya tengo una cuenta
          </button>
        </form>
        {message && <p className='register-message'>{message}</p>}
      </div>
    </div>
  );
};

export default Register;