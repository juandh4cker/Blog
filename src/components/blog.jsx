import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/blog.css'; // Asegúrate de tener un archivo CSS para los estilos del Blog

const Blog = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('https://6622071827fcd16fa6c8818c.mockapi.io/api/v1/blogs');
        setDestinations(response.data);
      } catch (err) {
        setError('Error al cargar los destinos. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="blog-container">
      <h2>Destinos Agregados</h2>
      {loading && <p>Cargando...</p>}
      {error && <p className="error-message">{error}</p>}
      {destinations.length === 0 && !loading && <p>No hay destinos agregados.</p>}
      <div className="destination-list">
        {destinations.map((destination) => (
          <div key={destination.id} className="destination-card">
            <img src={destination.imageUrl} alt={destination.name} className="destination-image" />
            <h3>{destination.name}</h3>
            <p>Ubicación: {destination.location}</p>
            <p>Reseña: {destination.review}</p>
            <p>Calificación: {destination.rating}/10</p>
            <p>Agregado por: {destination.creator}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
