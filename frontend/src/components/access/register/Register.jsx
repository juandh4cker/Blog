import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import bcrypt from 'bcryptjs';

import { fetchUsers, apiRequest, getLocalStorage, setLocalStorage } from '../../useful/ApiService';

import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (getLocalStorage('user')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const isValidUsername = (name) => /^[a-zA-Z0-9._]+$/.test(name); // Letras, números, . o _
  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password); // Min 8 caracteres, 1 mayúscula, 1 minúscula, 1 número

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const user = await apiRequest(`register?username=${encodeURIComponent(formData.username)}&email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`);

      if (!user.hasOwnProperty('warning')) {
        setLocalStorage('user', user);
        setMessage('¡Bienvenido! Redirigiendo al dashboard...');
        setTimeout(() => navigate('/dashboard'), 2000);

      } else {
        setMessage("Error", user.warning);

      }
      
    } catch (error) {
      console.error('Error en el registro:', error);
      setMessage('Hubo un error en el registro. Intenta nuevamente.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Registro para WorldBlog</h2>
        <p className="register-subtitle">Únete y descubre los mejores destinos alrededor del mundo</p>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            className="register-input"
            placeholder="Nombre de usuario"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="email"
            className="register-input"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            className="register-input"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit" className="register-button">Registrarme</button>
          <button
            type="button"
            className="register-secondary-button"
            onClick={() => navigate('/login')}
          >
            Ya tengo una cuenta
          </button>
        </form>
        {message && <p className="register-message">{message}</p>}
      </div>
    </div>
  );
};

export default Register;