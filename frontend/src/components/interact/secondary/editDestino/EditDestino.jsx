import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { editPost, getPost } from '../../../useful/ApiService';

import './EditDestino.css';

const EditDestino = () => {
  const navigate = useNavigate();
  const { ID } = useParams();
  const [destination, setDestination] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await getPost(ID);
        if (!response.editable) {
          navigate(`/post/${ID}`);
        }

        setDestination(response);

      } catch (error) {
        setMessage(`Error al editar el destino: ${error.message || error}`);

      } finally {
        setLoading(false);
      }
    };
    
    fetchDestination();
  }, [ID]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDestination((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateDestination = async (e) => {
    e.preventDefault();

    const rating = parseFloat(destination.rating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      setMessage('La calificación debe estar entre 0 y 10.');
      return;
    }

    const updatedDestination = {
      ...destination,
      rating,
    };

    try {
      await editPost(ID, updatedDestination);
      setMessage('Destino actualizado exitosamente!');
      navigate(`/post/${ID}`);
    } catch (error) {
      setMessage(`Error al actualizar el destino: ${error.message || error}`);
    }
  };

  if (loading) return <p>Cargando destino...</p>;

  return (
    <>
      <div className="base-container dashboard-container">
        <h1 className="base-title">Editar Destino</h1>
        <h2 className="base-subtitle">Edita los detalles del destino</h2>
        <form className="base-form" onSubmit={handleUpdateDestination}>
          <input
            type="text"
            name="name"
            placeholder="Nombre del destino"
            value={destination.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Ubicación"
            value={destination.location}
            onChange={handleInputChange}
            required
          />
          <input
            type="url"
            name="imageUrl"
            placeholder="URL de la imagen del destino"
            value={destination.imageUrl}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="review"
            placeholder="Reseña"
            value={destination.review}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="rating"
            placeholder="Calificación (0-10)"
            value={destination.rating}
            onChange={handleInputChange}
            min="0"
            max="10"
            step="0.1"
            required
          />
          <button type="submit" className="base-button">Actualizar destino</button>
          <button
            type="button"
            onClick={() => navigate(`/post/${ID}`)}
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

export default EditDestino;