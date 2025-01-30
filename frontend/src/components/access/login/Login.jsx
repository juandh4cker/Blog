import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import bcrypt from 'bcryptjs';

import { apiRequest, getLocalStorage, setLocalStorage } from './../../useful/ApiService';

import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ emailOrUsername: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (getLocalStorage('user')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const isValidUsername = (name) => /^[a-zA-Z0-9._]+[a-zA-Z0-9_]$/.test(name); // Letras, números, . o _

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const user = await apiRequest(`login?email_or_username=${encodeURIComponent(formData.emailOrUsername)}&password=${encodeURIComponent(formData.password)}`);

      if (!user.hasOwnProperty('warning')) {
        setLocalStorage('user', user);
        setMessage('¡Bienvenido de nuevo! Redirigiendo al dashboard...');
        setTimeout(() => navigate('/dashboard'), 2000);

      } else {
        setMessage(user.warning);

      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMessage('Hubo un error en el inicio de sesión. Intenta nuevamente.');

    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Bienvenido a WorldBlog</h2>
        <p className="login-subtitle">Descubre los mejores destinos alrededor del mundo</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Correo o Nombre de Usuario"
            value={formData.emailOrUsername}
            onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="login-input"
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="login-secondary-button"
          >
            No tengo una cuenta
          </button>
        </form>
        {message && <p className={`login-message ${loading ? 'loading' : ''}`}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;