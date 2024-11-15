import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/destinationCard.css';

const DestinationCard = ({ id, name, location, imageUrl, review, rating }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link to={`/destino/${id}`} className="destination-card">
      {!imageLoaded && <div className="image-placeholder">Cargando imagen...</div>}
      <img
        src={imageUrl}
        alt={name}
        className={`destination-image ${imageLoaded ? 'visible' : 'hidden'}`}
        onLoad={() => setImageLoaded(true)}
      />
      <h3>{name}</h3>
      <p><b>Ubicación: </b>{location}</p>
      <p><b>Reseña: </b>{review}</p>
      <p><b>Calificación: </b>{rating}/10</p>
    </Link>
  );
};

export default DestinationCard;
