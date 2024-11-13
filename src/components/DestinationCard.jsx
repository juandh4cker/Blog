import React from 'react';
import { Link } from 'react-router-dom';
import './styles/destinationCard.css';

const DestinationCard = ({ id, name, location, imageUrl, review, rating, creator }) => {
  return (
    <Link to={`/destino/${id}`} className="destination-card">
      <img src={imageUrl} alt={name} className="destination-image" />
      <h3>{name}</h3>
      <p><b>Ubicación: </b>{location}</p>
      <p><b>Reseña: </b>{review}</p>
      <p><b>Calificación: </b>{rating}/10</p>
    </Link>
  );
};

export default DestinationCard;
