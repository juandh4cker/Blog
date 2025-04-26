import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { registerTry, setLocalStorage, setTitle } from '../../useful/ApiService';

import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isValidUsername = (name) => /^[a-zA-Z0-9._]+$/.test(name); // Letras, números, . o _
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password); // Min 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidUsername(formData.username)) {
      setMessage('El nombre de usuario solo puede contener letras, números, "." o "_".');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setMessage('Email inválido.');
      return;
    }

    if (!isValidPassword(formData.password)) {
      setMessage(
        'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número.'
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage(
        'Las contraseñas no coinciden'
      );
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await registerTry(formData.username, formData.email, formData.password);
      setLocalStorage(response);
      navigate('/blog');
      
    } catch (error) {
      setMessage(`Error al registrar: ${error.message || error}`);

    } finally {
      setLoading(false);
      
    }
  };

  return (
    <>
      {setTitle("Register", "Registro de usuario")}
      <div className='base-container register-container'>
        <h2 className='base-title'>Registro para WorldBlog</h2>
        <p className='base-subtitle'>Únete y descubre los mejores destinos alrededor del mundo</p>
        <form onSubmit={handleSubmit} className='base-form'>
          <input
            type='text'
            className='base-input'
            placeholder='Nombre de usuario'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type='email'
            className='base-input'
            placeholder='Correo electrónico'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div className='base-password-wrapper'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Contraseña'
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className='base-input'
              required
            />
              <span
                className='base-toggle-password'
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
          </div>
          <div className='base-password-wrapper'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Confirmar contraseña'
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className='base-input'
              required
            />
              <span
                className='base-toggle-password'
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
          </div>
          <button type='submit' className='base-button'>
            {loading ? 'Registrando...' : 'Registarme'}
          </button>
          <button
            type='button'
            className='base-secondary-button'
            onClick={() => navigate('/login')}
          >
            Ya tengo una cuenta
          </button>
        </form>
        {message && <p className={`base-message ${loading ? 'loading' : 'error'}`}>{message}</p>}
      </div>
    </>
  );
};

export default Register;