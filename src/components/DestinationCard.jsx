import React from 'react';
import { Link } from 'react-router-dom';
import './styles/blog.css';

const DestinationCard = ({ id, name, location, imageUrl, review, rating, creator }) => {
  return (
    <Link to={`/destino/${namelocation+'-'+id}`} className="destination-card">
      <img src={imageUrl} alt={name} className="destination-image" />
      <h3>{name}</h3>
      <p>Ubicación: {location}</p>
      <p>Reseña: {review}</p>
      <p>Calificación: {rating}/10</p>
      <p>Agregado por: {creator}</p>
    </Link>
  );
};

export default DestinationCard;
