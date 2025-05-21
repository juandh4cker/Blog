import { useEffect, useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';

import { useTitle } from '../hooks/useTitle';

import { getPost, deletePost } from '../api/posts';

import { addComment } from '../api/comments';

import ErrorPage from './ErrorPage';

import { tiempoDesde } from '../utils/tiempoDesde';

import CommentsList from '../components/comments/CommentsList';

import ButtonContainer from '../components/tags/ButtonContainer';
import Message from '../components/tags/Message';
import Button from '../components/tags/Button';
import Container from '../components/tags/Container';
import Text from '../components/tags/Text';
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

  const { setTitle, setDescription } = useTitle(null, "Aquí se ve un post");

  const loadPost = async () => {
    try {
      const data = await getPost(ID);
      setPost(data);
      setIsCreator(data.editable);

      setTitle(data.name);
      setDescription(data.review);
      
    } catch (error) {
      if (error.message === "Unauthorized") {
        setError("Unauthorized");
        
      } else if (error.message === "Not found") {
        setError("Not found");
        
      } else {
        setError(`Error al cargar el post: ${error.message || error}`);
        setTitle('Error');

      }
    } finally {
      setLoading(false);

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

  useEffect(() => {
    loadPost();

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

  const handleCreatorClick = () => {
    if (post.creator) {
      navigate(`/user/${post.creator}`);

    } else {
      alert('No se pudo encontrar el perfil del creador');

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
        <Text className="base-text" onClick={handleCreatorClick}>
          <b>Agregado por: </b>
          <Text variant='hipertext'>{post.creator}</Text>
        </Text>
        <Text variant="subtitle">Subido hace: {tiempoDesde(post.createdAt)}</Text>
        <ButtonContainer>
          <Button variant="small" onClick={handleGoogleMaps}>Ver en Google Maps</Button>
          <Button variant="small" onClick={() => navigate(-1)}>Regresar</Button>
        </ButtonContainer>
        {isCreator && (
          <ButtonContainer>
            <Button className="small" onClick={() => navigate(`/post/${ID}/edit`)}>Editar Post</Button>
            <Button className="small" onClick={handleDeletePost}>Eliminar Post</Button>
          </ButtonContainer>
        )}
        <div className="w-4/5 flex items-center justify-center flex-col">
          <Text variant='title'>Comentarios</Text>
          <CommentsList comments={post.comments} postID={ID} setError={setError} loadData={loadPost}/>
          <Form className='w-[90%]' onSubmit={handleSubmitComment}>
            <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escribe tu comentario aquí" variant='textarea' />
            <Input value={newRating} onChange={(e) => setNewRating(e.target.value)} placeholder="Puntuación (1-10)" variant='rating' />
            <Button type="submit" variant="small">Enviar Comentario</Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default Post;