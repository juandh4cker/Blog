import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import bcrypt from 'bcryptjs';

import { fetchUsers } from './../../useful/ApiService';

import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ emailOrUsername: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al dashboard si el usuario ya está autenticado
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const isValidUsername = (name) => /^[a-zA-Z0-9._]+$/.test(name); // Letras, números, . o _

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const users = await fetchUsers();

      const input = formData.emailOrUsername;
      let user;

      const formatUsername = (name) => {
        if (isValidUsername(name)) {
          return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return name;
      };
      const formattedName = formatUsername(input);

      user = users.find(
        (u) =>
          input.toLowerCase() === u.email || // Comparar correos
          u.name === formattedName // Comparar nombres de usuario
      );

      if (user) {
        const isPasswordValid = bcrypt.compareSync(formData.password, user.password);

        if (isPasswordValid) {
          const userToken = {
            name: user.name,
            token: bcrypt.hashSync(formData.password, 10),
            id: user.id,
            posts: user.posts,
          };
          localStorage.setItem('user', JSON.stringify(userToken));
          setMessage('¡Bienvenido de nuevo! Redirigiendo al dashboard...');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          setMessage('Usuario, correo o contraseña incorrectos.');
        }
      } else {
        setMessage('Usuario, correo o contraseña incorrectos.');
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
