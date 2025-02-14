import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { apiRequest, fetchUsers, getLocalStorage, setLocalStorage } from '../../../useful/ApiService';

import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getLocalStorage('user');

  const [newDestination, setNewDestination] = useState({
    name: '',
    location: '',
    imageUrl: '',
    review: '',
    rating: ''
  });

  const [message, setMessage] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDestination((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    const rating = parseFloat(newDestination.rating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      setMessage('La calificación debe estar entre 0 y 10.');
      return;
    } 

    const destinationData = {
      ...newDestination,
      rating,
      creator: user.name,
      id: user.id
    };

    try {
      const added = await apiRequest('blogs', 'POST', destinationData);
      const userInfo = await fetchUsers(user.id);
      const userPosts = userInfo.posts;
      userPosts.push(parseInt(added.id));
      await apiRequest(`users/${user.id}`, 'PUT', { posts: userPosts });

      setMessage('Destino agregado exitosamente!');
      setNewDestination({ name: '', location: '', imageUrl: '', review: '', rating: '' });

    } catch (error) {
      console.error('Error al agregar el destino:', error);
      setMessage('Hubo un error al agregar el destino. Intenta nuevamente.');
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <h1 className="dashboard-header">Bienvenido, {user.username}</h1>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}
        >
          Cerrar sesión
        </button>
        <h2 className="dashboard-subheader">Agregar un nuevo destino turístico</h2>
        <form className="dashboard-form" onSubmit={handleAddDestination}>
          <input
            type="text"
            name="name"
            placeholder="Nombre del destino"
            value={newDestination.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Ubicación"
            value={newDestination.location}
            onChange={handleInputChange}
            required
          />
          <input
            type="url"
            name="imageUrl"
            placeholder="URL de la imagen del destino"
            value={newDestination.imageUrl}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="review"
            placeholder="Reseña"
            value={newDestination.review}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="rating"
            placeholder="Calificación (0-10)"
            value={newDestination.rating}
            onChange={handleInputChange}
            min="0"
            max="10"
            step="0.1"
            required
          />
          <button type="submit" className="submit-button">Agregar destino</button>
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="login-secondary-button"
          >
            Ver los destinos
          </button>
        </form>
        {message && <p className="dashboard-message">{message}</p>}
      </div>
    </>
  );
};

export default Dashboard;