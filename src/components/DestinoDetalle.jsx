import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles/destinoDetalle.css';
import Fondo from './Fondo';

const DestinoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destino, setDestino] = useState(null);
  const [creatorId, setCreatorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestino = async () => {
      try {
        const response = await fetch(`https://67253fdfc39fedae05b45582.mockapi.io/api/v1/blogs/${id}`);
        if (!response.ok) throw new Error('Error en la red');
        const data = await response.json();
        setDestino(data);

        // Buscar la ID del creador en la API de usuarios
        const usersResponse = await fetch('https://67253fdfc39fedae05b45582.mockapi.io/api/v1/users');
        if (!usersResponse.ok) throw new Error('Error al cargar usuarios');
        const users = await usersResponse.json();
        const creator = users.find(user => user.name === data.creator);

        if (creator) {
          setCreatorId(creator.id); // Guardar la ID del creador
        } else {
          console.warn('No se encontró al creador en la lista de usuarios.');
        }
      } catch (error) {
        setError('Error al cargar los detalles del destino.');
        console.error('Error fetching destino or creator details:', error);
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

  const handleCreatorClick = () => {
    if (creatorId) {
      navigate(`/perfil/${creatorId}`);
    } else {
      alert('No se pudo encontrar el perfil del creador.');
    }
  };

  return (
    <>
      <Fondo />
      <div className="destino-detalle">
        <img src={destino.imageUrl} alt={destino.name} className="destino-image" />
        <h2 className="destino-name">{destino.name}</h2>
        <p className="destino-rating"><b>Calificación: </b>{destino.rating}/10</p>
        <p className="destino-location"><b>Ubicación: </b>{destino.location}</p>
        <p className="destino-review"><b>Reseña: </b>{destino.review}</p>
        <p 
          className="destino-creator"
          onClick={handleCreatorClick}
          style={{ cursor: 'pointer', color: '#2980B9', textDecoration: 'underline' }}
        >
          <b>Agregado por: </b>{destino.creator}
        </p>
        <div>
          <button className="button" onClick={handleGoogleMaps}>Ver en Google Maps</button>
          <button className="button" onClick={handleBackToAll}>Regresar a Todos los Destinos</button>
        </div>
      </div>
    </>
  );
};

export default DestinoDetalle;
