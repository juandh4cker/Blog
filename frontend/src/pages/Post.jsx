import { useEffect, useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';

import useTitle from '../hooks/useTitle';

import { getPost, deletePost } from '../api/posts';

import { addComment } from '../api/comments';

import ErrorPage from './ErrorPage';

import Message from '../components/tags/Message';
import Button from '../components/tags/Button';
import Container from '../components/tags/Container';
import Text from '../components/tags/Text';
import Textarea from '../components/tags/Textarea';
import Comment from '../components/Comment';
import Input from '../components/tags/Input';
import Form from '../components/tags/Form';

const Post = () => {
  const navigate = useNavigate();
  const { ID } = useParams();

  const [post, setPost] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { setTitle, setDescription } = useTitle(
    null,
    "Aquí se ve un post"
  );

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
      setError('La calificación debe estar entre 1 y 10.');
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
      setError(`Error al subir el comentario: ${error.message || error}`);

    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      try {
        await deletePost(ID);
        navigate('/blog');

      } catch (error) {
        setError(`Error al eliminar el post: ${error.message || error}`);
        
      }
    }
  };

  const loadData = async () => {
    try {
      const data = await getPost(ID);
      setPost(data);
      setIsCreator(data.editable);

      setTitle(data.name);
      setDescription(data.review);
      
    } catch (error) {
      if (error.message === "Unauthorized") {
        setError("Unauthorized")
        
      } else if (error.message === "Not found") {
        setError("Not found")
        
      } else {
        setError(`Error al cargar el post: ${error.message || error}`);
        setTitle('error')

      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    loadData();
  }, [ID]);

  if (loading) {
    return <Message loading={loading} />;
  }

  if (error === "Unauthorized" || error === "Not found") {
    return <ErrorPage type={error} />;
  }

  if (error) {
    return <Message error={error}/>;
  }

  if (!post) {
    return <ErrorPage type="Not found" />;
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

  return (
    <>
      <Container className="max-w-xl">
        <img src={post.imageUrl} alt={post.name} className="w-full h-auto mb-6 rounded-[10px]" />
        <Text variant="title">{post.name}</Text>
        <Text>
          <b>Calificación: </b>{post.rating}/10
        </Text>
        <Text>
          <b>Ubicación: </b>{post.location}
        </Text>
        <Text>
          <b>Reseña: </b>{post.review}
        </Text>    
        <Text 
          className="base-text"
          onClick={handleCreatorClick}
        >
          <b>Agregado por: </b>
          <span className="text-center text-[1.1rem] text-[#2980B9] my-2 cursor-pointer underline">
            {post.creator}
          </span>
        </Text>
        <Text variant="subtitle">Subido hace: {tiempoDesde(post.createdAt)}</Text>
        <div className='flex justify-between gap-4 items-center'>
          <Button 
            variant="small" 
            onClick={handleGoogleMaps}
          >
            Ver en Google Maps
          </Button>
          <Button 
            variant="small" 
            onClick={handleBackToAll}
          >
            Regresar a Todos los Posts
          </Button>
        </div>
        {isCreator && (
          <div className='flex justify-between gap-4 items-center'>
            <Button
              className="small"
              onClick={() => navigate(`/post/${ID}/edit`)}
            >
              Editar Post
            </Button>
            <Button 
              className="small" 
              onClick={handleDeletePost}
            >
              Eliminar Post
            </Button>
          </div>
        )}
        <div className="w-4/5 flex items-center justify-center flex-col">
          <Text variant='title'>Comentarios</Text>
          {post.comments.map((comment, index) => (
            <Comment key={comment.ID || index} ID={ID} index={index} comment={comment} tiempoDesde={tiempoDesde} setError={setError} loadData={loadData}/>
          ))}
          <Form 
            className='w-[90%]' 
            onSubmit={handleSubmitComment}
          >
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario aquí"
            />
            <Input
              type="number"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              placeholder="Puntuación (1-10)"
              min="1"
              max="10"
              step="0.1"
              required
            />
            <Button type="submit" variant="small">Enviar Comentario.</Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default Post;