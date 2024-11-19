import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/dashboard.css';
import Fondo from './Fondo';
import MenuButton from './MenuButton';

const EditDestino = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));

  const [destination, setDestination] = useState({
    name: '',
    location: '',
    imageUrl: '',
    review: '',
    rating: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axios.get(
          `https://67253fdfc39fedae05b45582.mockapi.io/api/v1/blogs/${id}`
        );
        setDestination(response.data);
      } catch (error) {
        console.error('Error al cargar el destino:', error);
        setMessage('No se pudo cargar el destino.');
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

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
      creator: user.name
    };

    try {
      await axios.put(
        `https://67253fdfc39fedae05b45582.mockapi.io/api/v1/blogs/${id}`,
        updatedDestination
      );

      setMessage('Destino actualizado exitosamente!');
      navigate(`/destino/${id}`);
    } catch (error) {
      console.error('Error al actualizar el destino:', error);
      setMessage('Hubo un error al actualizar el destino. Intenta nuevamente.');
    }
  };

  if (loading) return <p>Cargando destino...</p>;

  return (
    <>
      <Fondo />
      <div className="dashboard-container">
        <h1 className="dashboard-header">Editar Destino</h1>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}
        >
          Cerrar sesión
        </button>

        <h2 className="dashboard-subheader">Edita los detalles del destino</h2>
        <form className="dashboard-form" onSubmit={handleUpdateDestination}>
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
          <button type="submit" className="submit-button">Actualizar destino</button>
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="login-secondary-button"
          >
            Cancelar
          </button>
        </form>
        {message && <p className="dashboard-message">{message}</p>}
      </div>
      <MenuButton />
    </>
  );
};

export default EditDestino;
