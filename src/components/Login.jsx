import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';
import bcrypt from 'bcryptjs';

const Login = () => {
  const [formData, setFormData] = useState({ emailOrUsername: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const isValidUsername = (name) => {
    const usernameRegex = /^[a-zA-Z0-9._]+$/; // Solo letras, números, . o _
    return usernameRegex.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.get('https://67253fdfc39fedae05b45582.mockapi.io/api/v1/users');
      const users = response.data;

      const input = formData.emailOrUsername;
      let user;

      const formatUsername = (name) => {
        if (isValidUsername(name)) {
          return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return name;
      };
      
      user = users.find(
        u =>
          bcrypt.compareSync(input.toLowerCase(), u.email) ||
          u.name === formatUsername(input)
      );

      if (user) {
        const isPasswordValid = bcrypt.compareSync(formData.password, user.password);

        if (isPasswordValid) {
          localStorage.setItem('user', JSON.stringify(user));
          setMessage('¡Bienvenido de nuevo! Redirigiendo al dashboard...');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          setMessage('Usuario, correo o contraseña incorrectos.');
        }
      } else {
        setMessage('Usuario, correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMessage('Hubo un error en el inicio de sesión. Intenta nuevamente.');
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="background-slideshow">
        <div className="background-slide slide1"></div>
        <div className="background-slide slide2"></div>
        <div className="background-slide slide3"></div>
        <div className="background-slide slide4"></div>
      </div>

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
