import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  fetchDestino,
  fetchUsers,
  addComment,
  deleteDestinoById,
  getComments,
  deleteComment, 
  getLocalStorage,
  verifyToken
} from '../../../useful/ApiService';

import './DestinoDetalle.css';

const DestinoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destino, setDestino] = useState(null);
  const [creatorId, setCreatorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('');
  const [comments, setComments] = useState([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDestino(id);
        setDestino(data);
        setComments(await getComments(id));

        const request = await verifyToken();
        const creator = data.editable;

        if (creator) {
          setCreatorId(request.user.id);
          setIsCreator(true);

        }

      } catch (error) {
        setError('Error al cargar los detalles del destino.');

      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment || newRating <= 0 || newRating > 10) {
      alert('Por favor ingrese un comentario y una puntuación válida.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const newEntry = {
      userId: user.id,
      userName: user.name,
      comment: newComment,
      rating: newRating,
      createdAt: new Date().toISOString(),
    };

    try {
      await addComment(id, newEntry);
      setComments(await getComments(id));
      const data = await fetchDestino(id);
      setDestino(data);
      setNewComment('');
      setNewRating('');

    } catch (error) {
      alert('Error al subir el comentario.');
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        await deleteComment(id, commentId);
        setComments(await getComments(id));
        const data = await fetchDestino(id);
        setDestino(data);

      } catch (error) {
        alert('Error al eliminar el comentario.');
      }
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este destino?')) {
      try {
        await deleteDestinoById(id);
        navigate('/blog');

      } catch (error) {
        alert('Error al eliminar el destino.');
      }
    }
  };

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
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      destino.name + ', ' + destino.location
    )}`;
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

  const handleCommentUserClick = (userId) => {
    navigate(`/perfil/${userId}`);
  };

  return (
    <>
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

        {isCreator && (
          <div>
            <button className="button" onClick={handleDeletePost}>Eliminar Destino</button>
            <button
              className="button"
              onClick={() => navigate(`/editar-destino/${id}`)}
            >
              Editar Destino
            </button>
          </div>
        )}

        <div className="comment-section">
          <h3>Comentarios</h3>
          <p>------------------------------------------------------</p>
          {comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <p>
                <b 
                  style={{ cursor: 'pointer', color: '#2980B9', textDecoration: 'underline' }}
                  onClick={() => handleCommentUserClick(comment.userId)}
                >
                  {comment.userName}
                </b>: {comment.comment}
              </p>
              <p><b>Calificación:</b> {comment.rating}/10</p>
              {comment.userName === getLocalStorage('user').name && (
                <button className="button" onClick={() => handleDeleteComment(comment.id)}>Borrar</button>
              )
}
              <p>------------------------------------------------------</p>
            </div>
          ))}

          <h4>Agregar un Comentario</h4>
          <form onSubmit={handleSubmitComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario aquí"
              required
            />
            <input
              type="number"
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              placeholder="Puntuación (1-10)"
              min="1"
              max="10"
              step="0.1"
              required
            />
            <button type="submit" className="button">Enviar Comentario.</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DestinoDetalle;