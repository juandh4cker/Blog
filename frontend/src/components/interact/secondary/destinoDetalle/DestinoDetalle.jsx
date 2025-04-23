import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  getPost,
  deletePost,
  addComment,
  deleteComment, 
} from '../../../useful/ApiService';

import './DestinoDetalle.css';

const DestinoDetalle = () => {
  const { ID } = useParams();
  const [destino, setDestino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const navigate = useNavigate();
  const [expandedCommentIndex, setExpandedCommentIndex] = useState(null);


  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPost(ID);
        setDestino(data);
        setIsCreator(data.editable)

      } catch (error) {
        setMessage(`Error al cargar el post: ${error.message || error}`);

      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ID]);

  const tiempoDesde = (fecha) => {
    const ahora = new Date();
    const fechaCreacion = new Date(fecha);
    const segundos = Math.floor((ahora - fechaCreacion) / 1000);
  
    if (segundos < 60) return `hace ${segundos} segundo${segundos !== 1 ? 's' : ''}`;
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    const dias = Math.floor(horas / 24);
    if (dias < 30) return `hace ${dias} día${dias !== 1 ? 's' : ''}`;
    const meses = Math.floor(dias / 30);
    if (meses < 12) return `hace ${meses} mes${meses !== 1 ? 'es' : ''}`;
    const años = Math.floor(meses / 12);
    return `hace ${años} año${años !== 1 ? 's' : ''}`;
  };
  

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment || newRating <= 0 || newRating > 10) {
      alert('Por favor ingrese un comentario y una puntuación válida.');
      return;
    }

    const ratingValue = parseFloat(newRating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 10) {
      setMessage('La calificación debe estar entre 1 y 10.');
      return;
    }

    const newEntry = {
      content: newComment,
      rating: ratingValue
    };

    try {
      await addComment(ID, newEntry);
      const data = await getPost(ID);
      setDestino(data);
      setNewComment('');
      setNewRating('');

    } catch (error) {
      setMessage(`Error al subir el comentario: ${error.message || error}`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        await deleteComment(ID, commentId);
        const data = await getPost(ID);
        setDestino(data);

      } catch (error) {
        setMessage(`Error al eliminar el comentario: ${error.message || error}`);
      }
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este destino?')) {
      try {
        await deletePost(ID);
        navigate('/blog');

      } catch (error) {
        setMessage(`Error al eliminar el post: ${error.message || error}`);
      }
    }
  };

  if (loading) {
    return <p className="base-message loading">Cargando...</p>;
  }

  if (message) {
    return <p className="base-message error">{message}</p>;
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
    if (destino.creator) {
      navigate(`/user/${destino.creator}`);
    } else {
      console.log('No se pudo encontrar el perfil del creador.');
    }
  };

  const handleCommentUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <>
      <div className="base-container destino-detalle">
        <img src={destino.imageUrl} alt={destino.name} className="destino-image" />
        <h2 className="base-title">{destino.name}</h2>
        <p className="base-text"><b>Calificación: </b>{destino.rating}/10</p>
        <p className="base-text"><b>Ubicación: </b>{destino.location}</p>
        <p className="base-text"><b>Reseña: </b>{destino.review}</p>    
        <p 
          className="base-text"
          onClick={handleCreatorClick}
        >
          <b>Agregado por: </b> <span className="base-hipertext">{destino.creator}</span>
        </p>
        <p className="base-subtitle">Subido hace: {tiempoDesde(destino.createdAt)}</p>
        <div className='buttons-container'>
          <button className="base-small-button" onClick={handleGoogleMaps}>Ver en Google Maps</button>
          <button className="base-small-button" onClick={handleBackToAll}>Regresar a Todos los Destinos</button>
        </div>

        {isCreator && (
          <div className='buttons-container'>
            <button
              className="base-small-button"
              onClick={() => navigate(`/post/${ID}/edit`)}
            >
              Editar Destino
            </button>
            <button className="base-small-button" onClick={handleDeletePost}>Eliminar Destino</button>
          </div>
        )}

        <div className="comment-section">
          <h3>Comentarios</h3>
          {destino.comments.map((comment, index) => (
            <div
              key={index}
              className="comment-item"
              onClick={() =>
                setExpandedCommentIndex((prev) => (prev === index ? null : index))
              }
              style={{ cursor: 'pointer' }}
            >
              <p className="base-text">
                <b
                  className="base-hipertext"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommentUserClick(comment.creator);
                  }}
                >
                  {comment.creator}
                </b>: {comment.content}
              </p>
              <p className="base-text"><b>Calificación:</b> {comment.rating}/10</p>
              <p className="base-subtitle">Subido hace: {tiempoDesde(comment.createdAt)}</p>
              {comment.editable && expandedCommentIndex === index && (
                <button
                  className="base-small-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteComment(comment.ID);
                  }}
                >
                  Borrar
                </button>
              )}
            </div>
          ))}
          <form className='base-form .comment-form' onSubmit={handleSubmitComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario aquí"
              required
            />
            <input
              type="number"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              placeholder="Puntuación (1-10)"
              min="1"
              max="10"
              step="0.1"
              required
            />
            <button type="submit" className="base-small-button">Enviar Comentario.</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DestinoDetalle;