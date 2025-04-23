import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Dashboard.css';
import { addPost, getLocalStorage } from '../../../useful/ApiService';

const Dashboard = () => {
  const navigate = useNavigate();
  const username = getLocalStorage();

  const [newPost, setNewPost] = useState({
    name: '',
    location: '',
    imageUrl: '',
    review: '',
    rating: ''
  });

  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    const rating = parseFloat(newPost.rating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      setMessage('La calificación debe estar entre 0 y 10.');
      return;
    } 

    const postData = {
      ...newPost,
      rating
    };

    try {
      const response = await addPost(postData);
      navigate(`/post/${response}`);

    } catch (error) {
      setMessage(`Error al agregar el post: ${error.message || error}`);
    }
  };

  return (
    <>
      <div className="base-container dashboard-container">
        <h1 className="base-title">Bienvenido, {username}</h1>
        <h2 className="base-subtitle">Agregar un nuevo destino turístico</h2>
        <form className="base-form" onSubmit={handleAddPost}>
          <input
            type="text"
            name="name"
            placeholder="Nombre del destino"
            value={newPost.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Ubicación"
            value={newPost.location}
            onChange={handleInputChange}
            required
          />
          <input
            type="url"
            name="imageUrl"
            placeholder="URL de la imagen del destino"
            value={newPost.imageUrl}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="review"
            placeholder="Reseña"
            value={newPost.review}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="rating"
            placeholder="Calificación (0-10)"
            value={newPost.rating}
            onChange={handleInputChange}
            min="0"
            max="10"
            step="0.1"
            required
          />
          <button 
            type="submit" 
            className="base-button"
            >
              Agregar destino
          </button>
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="base-secondary-button"
          >
            Cancelar
          </button>
        </form>
        {message && <p className="base-message error">{message}</p>}
      </div>
    </>
  );
};

export default Dashboard;