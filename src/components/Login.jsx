import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';
import bcrypt from 'bcryptjs';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.get('https://6622071827fcd16fa6c8818c.mockapi.io/api/v1/users');
      const users = response.data;
      const user = users.find(u => u.email === formData.email);

      if (user) {
        const isPasswordValid = bcrypt.compareSync(formData.password, user.password);

        if (isPasswordValid) {
          localStorage.setItem('user', JSON.stringify(user));
          setMessage('¡Bienvenido de nuevo! Redirigiendo al dashboard...');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          setMessage('Correo o contraseña incorrectos.');
        }
      } else {
        setMessage('Correo o contraseña incorrectos.');
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
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
