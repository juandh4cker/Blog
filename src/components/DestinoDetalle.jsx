import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles/destinoDetalle.css';
import Fondo from './Fondo';


const DestinoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destino, setDestino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestino = async () => {
      try {
        const response = await fetch(`https://6622071827fcd16fa6c8818c.mockapi.io/api/v1/blogs/${id}`);
        if (!response.ok) throw new Error('Error en la red');
        const data = await response.json();
        setDestino(data);
      } catch (error) {
        setError('Error al cargar los detalles del destino.');
        console.error('Error fetching destino details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestino();
  }, [id]);

  if (loading) {
    return <p className="loading-message">Cargando...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!destino) {
    return <p>El destino no existe.</p>;
  }

  const handleGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destino.name + ", " + destino.location)}`;
    window.open(url, '_blank');
  };

  const handleBackToAll = () => {
    navigate('/blog');
  };

  return (
    <>
      <Fondo />
      <div className="destino-detalle">
        <img src={destino.imageUrl} alt={destino.name} className="destino-image" />
        <h2 className="destino-name">{destino.name}</h2>
        <p className="destino-rating">Calificación: {destino.rating}/10</p>
        <p className="destino-location">Ubicación: {destino.location}</p>
        <p className="destino-review">Reseña: {destino.review}</p>
        <p className="destino-creator">Agregado por: {destino.creator}</p>
        <div>
          <button className="button" onClick={handleGoogleMaps}>Ver en Google Maps</button>
          <button className="button" onClick={handleBackToAll}>Regresar a Todos los Destinos</button>
        </div>
      </div>
    </>
  );
};

export default DestinoDetalle;
