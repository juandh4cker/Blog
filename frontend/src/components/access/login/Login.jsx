import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { loginTry, setLocalStorage } from './../../useful/ApiService';

import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ emailOrUsername: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('')
    setLoading(true);

    try {
      const response = await loginTry(formData.emailOrUsername, formData.password);
      setLocalStorage(response);
      navigate('/blog');

    } catch (error) {
      setMessage(`Error al iniciar sesión: ${error.message || error}`);

    } finally {
      setLoading(false);

    }
  };

  return (
    <>
      <div className='base-container login-container'>
        <h2 className='base-title'>Bienvenido a WorldBlog</h2>
        <p className='base-subtitle'>Descubre los mejores destinos alrededor del mundo</p>
        <form onSubmit={handleSubmit} className='base-form'>
          <input
            type='text'
            placeholder='Correo o Nombre de Usuario'
            value={formData.emailOrUsername}
            onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
            required
          />
          <div className='base-password-wrapper'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Contraseña'
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required  
            />
            <span
              className='base-toggle-password'
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button 
            type='submit' 
            className='base-button' 
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/register')}
            className='base-secondary-button'
          >
            No tengo una cuenta
          </button>
        </form>
        {message && <p className={`base-message ${loading ? 'loading' : 'error'}`}>{message}</p>}
      </div>
    </>
  );
};

export default Login;