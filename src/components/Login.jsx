import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obtener todos los usuarios para buscar coincidencias
      const response = await axios.get('https://6622071827fcd16fa6c8818c.mockapi.io/api/v1/users');
      const users = response.data;

      // Verificar si hay un usuario que coincida con el email y la contraseña ingresados
      const user = users.find(u => u.email === formData.email && u.password === formData.password);

      if (user) {
        // Simular inicio de sesión exitoso y guardar el usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        alert("Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default Login;
