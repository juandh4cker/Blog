import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DestinationCard from './DestinationCard';
import './styles/blog.css';
import Fondo from './Fondo';

const Blog = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('https://67253fdfc39fedae05b45582.mockapi.io/api/v1/blogs');
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
    <>
      <Fondo />
      <div className="blog-container">
        <h2>Destinos Agregados</h2>
        {loading && <p>Cargando...</p>}
        {error && <p className="error-message">{error}</p>}
        {destinations.length === 0 && !loading && <p>No hay destinos agregados.</p>}
        <div className="destination-list">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              id={destination.id}
              name={destination.name}
              location={destination.location}
              imageUrl={destination.imageUrl}
              review={destination.review}
              rating={destination.rating}
              creator={destination.creator}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Blog;
