import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/register.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://6622071827fcd16fa6c8818c.mockapi.io/api/v1/users', formData);
      console.log("Usuario registrado:", response.data);

      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div className="register-page">
      <div className="background-slideshow">
        <div className="background-slide slide1"></div>
        <div className="background-slide slide2"></div>
        <div className="background-slide slide3"></div>
        <div className="background-slide slide4"></div>
      </div>
      <div className="register-container">
        <h2 className="register-title">Registro para WorldBlog</h2>
        <p className="register-subtitle">Únete y descubre los mejores destinos alrededor del mundo</p>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            className="register-input"
            placeholder="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <button type="submit" className="register-button">Registrar</button>
          <button type="button" className="register-secondary-button" onClick={() => navigate('/login')}>Ya tengo una cuenta</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
