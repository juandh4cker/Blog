import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './DestinationCard.css';

const DestinationCard = ({ ID, name, location, imageUrl, rating }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link to={`/post/${ID}`} className="destination-card">
      {!imageLoaded && <div className="image-placeholder">Cargando imagen...</div>}
      <img
        src={imageUrl}
        alt={name}
        className={`destination-image ${imageLoaded ? 'visible' : 'hidden'}`}
        onLoad={() => setImageLoaded(true)}
      />
      <h3>{name}</h3>
      <p><b>Ubicación: </b>{location}</p>
      <p><b>Calificación: </b>{rating}/10</p>
    </Link>
  );
};

export default DestinationCard;