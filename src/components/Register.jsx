import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/register.css';
import Fondo from './Fondo';
import bcrypt from 'bcryptjs';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const isValidUsername = (name) => {
    const usernameRegex = /^[a-zA-Z0-9._]+$/; // Solo letras, números, . o _
    return usernameRegex.test(name);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // Min 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
    return passwordRegex.test(password);
  };

  const formatUsername = (name) => {
    if (isValidUsername(name)) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return name;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidUsername(formData.name)) {
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
      const response = await axios.get('https://67253fdfc39fedae05b45582.mockapi.io/api/v1/users');
      const users = response.data;

      const formattedName = formatUsername(formData.name);
      const formattedEmail = formData.email.toLowerCase();
      const hashedEmail = bcrypt.hashSync(formattedEmail, 10);
      const existingEmail = users.find((user) => bcrypt.compareSync(formattedEmail, user.email));
      const existingUser = users.find((user) => user.name === formData.name);

      if (existingEmail) {
        setMessage('Este correo ya está en uso. Intenta con otro.');
      } else if (existingUser) {
        setMessage('Este nombre de usuario ya está en uso. Intenta con otro.');
      } else if (formData.name === "" || formData.email === "" || formData.password === "") {
        setMessage('Debe rellenar todos los campos.');
      } else {
        const hashedPassword = bcrypt.hashSync(formData.password, 10);
        const userData = {
          name: formattedName,
          email: hashedEmail,
          password: hashedPassword,
          posts: 0
        };

        const userToken = {
          name: formattedName,
          token: hashedPassword
        }

        const createResponse = await axios.post(
          'https://67253fdfc39fedae05b45582.mockapi.io/api/v1/users',
          userData
        );

        localStorage.setItem('user', JSON.stringify(userToken));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setMessage('Hubo un error en el registro. Intenta nuevamente.');
    }
  };

  return (
    <div className="register-page">
      <Fondo />

      <div className="register-container">
        <h2 className="register-title">Registro para WorldBlog</h2>
        <p className="register-subtitle">Únete y descubre los mejores destinos alrededor del mundo</p>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            className="register-input"
            placeholder="Nombre de usuario"
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
