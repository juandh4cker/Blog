import { useEffect, useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';

import {
  getPost,
  deletePost,
  addComment,
  deleteComment, 
  setTitle,
} from '../../../useful/ApiService';

import ErrorPage from '../../../useful/ErrorPage';

import './DestinoDetalle.css';

const PostDetalle = () => {
  const navigate = useNavigate();
  const { ID } = useParams();
  const [post, setPost] = useState(null);
  const [expandedCommentIndex, setExpandedCommentIndex] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPost(ID);
        setPost(data);
        setIsCreator(data.editable)

      } catch (error) {
        if (error.message === "Unauthorized") {
          setMessage("Unauthorized")
          
        } else if (error.message === "Not found") {
          setMessage("Not found")
          
        } else {
          setMessage(`Error al cargar el post: ${error.message || error}`);
        }
        
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
      setPost(data);
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
        setPost(data);

      } catch (error) {
        setMessage(`Error al eliminar el comentario: ${error.message || error}`);

      }
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
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

  if (message === "Unauthorized" || message === "Not found") {
    return <ErrorPage type={message} />;
  }

  if (message) {
    return <p className="base-message error">{message}</p>;
  }

  if (!post) {
    return <p>El post no existe.</p>;
  }

  const handleGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      post.name + ', ' + post.location
    )}`;
    window.open(url, '_blank');
  };

  const handleBackToAll = () => {
    navigate('/blog');
  };

  const handleCreatorClick = () => {
    if (post.creator) {
      navigate(`/user/${post.creator}`);
    } else {
      console.log('No se pudo encontrar el perfil del creador.');
    }
  };

  const handleCommentUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <>
      {setTitle(post.name, "description", "Detalles del post")}
      <div className="base-container post-detalle">
        <img src={post.imageUrl} alt={post.name} className="post-image" />
        <h2 className="base-title">{post.name}</h2>
        <p className="base-text"><b>Calificación: </b>{post.rating}/10</p>
        <p className="base-text"><b>Ubicación: </b>{post.location}</p>
        <p className="base-text"><b>Reseña: </b>{post.review}</p>    
        <p 
          className="base-text"
          onClick={handleCreatorClick}
        >
          <b>Agregado por: </b> <span className="base-hipertext">{post.creator}</span>
        </p>
        <p className="base-subtitle">Subido hace: {tiempoDesde(post.createdAt)}</p>
        <div className='buttons-container'>
          <button className="base-small-button" onClick={handleGoogleMaps}>Ver en Google Maps</button>
          <button className="base-small-button" onClick={handleBackToAll}>Regresar a Todos los Posts</button>
        </div>

        {isCreator && (
          <div className='buttons-container'>
            <button
              className="base-small-button"
              onClick={() => navigate(`/post/${ID}/edit`)}
            >
              Editar Post
            </button>
            <button className="base-small-button" onClick={handleDeletePost}>Eliminar Post</button>
          </div>
        )}

        <div className="comment-section">
          <h3>Comentarios</h3>
          {post.comments.map((comment, index) => (
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

export default PostDetalle;