import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { loginTry, setLocalStorage, setTitle } from './../../useful/ApiService';

import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('')
    setLoading(true);

    try {
      const response = await loginTry(formData.usernameOrEmail, formData.password);
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
      {setTitle("Login", "Inicio de sesión.")}
      <div className='base-container login-container'>
        <h2 className='base-title'>Bienvenido a WorldBlog</h2>
        <p className='base-subtitle'>Descubre los mejores destinos alrededor del mundo</p>
        <form onSubmit={handleSubmit} className='base-form'>
          <input
            type='text'
            placeholder='Nombre de Usuario o correo'
            value={formData.usernameOrEmail}
            onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
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