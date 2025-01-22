import React, { useEffect, useState } from 'react';

import { apiRequest } from '../../../useful/ApiService';

import DestinationCard from '../../secondary/destinationCard/DestinationCard';

import './Blog.css';

const Blog = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await apiRequest('blogs');
        setDestinations(response);

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
      <div className="blog-container">
        <h2>Destinos Agregados</h2>
        {loading && <p>Cargando destinos...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && destinations.length === 0 && <p>No hay destinos agregados.</p>}
        {!loading && !error && (
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
              />
            ))}
          </div>
        )}
      </div>
    </>
  );  
};

export default Blog;