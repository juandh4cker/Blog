import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useNav, useTitle } from '../hooks';

import { commentSchema } from '../schema';

import { fetchPost, deletePost, addComment } from '../api';

import ErrorPage from './ErrorPage';

import { tiempoDesde } from '../utils/tiempoDesde';

import CommentsList from '../components/CommentsList';

import { Button, ButtonContainer, Container, Form, Input, Message, Text } from '../components/ui';

const Post = () => {
  const { navBack, navBlog, navUser, navPost } = useNav();
  const { ID } = useParams();

  const formRef = useRef();

  const [post, setPost] = useState(null);
  const [isCreator, setIsCreator] = useState(false);

  const [loading, setLoading] = useState(true);
  const [uploadingComment, setUploadingComment] = useState(false);
  const [error, setError] = useState('');

  const { setTitle, setDescription } = useTitle(null, 'Aquí se ve un post');

  const loadPost = async () => {
    fetchPost(ID)
      .then((postData) => {
        setPost(postData);
        setIsCreator(postData.editable);

        setTitle(postData.name);
        setDescription(postData.review);
      })
      .catch((error) => {
        if (error.message === 'Unauthorized') {
          setError('Unauthorized');

        } else if (error.message === 'Not found') {
          setError('Not found');

        } else {
          setError(`Error al cargar el post: ${error.message || error}`);
          setTitle('Error');
        }
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const handleDeletePost = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      deletePost(ID)
        .then(() => {
          navBlog();
        })
        .catch((error) => {
          setError(`Error al eliminar el post: ${error.message || error}`);
        })
    }
  };

  const submitComment = async (data) => {
    addComment(ID, data)
      .then(() => {
        loadPost();
        if (formRef.current) {
          formRef.current.reset({ content: '', rating: '' });
        }
      })
      .catch((error) => {
        setError(`Error al subir el comentario: ${error.message || error}`);
      })
  };

  useEffect(() => {
    loadPost();
  }, [ID]);

  if (loading) {
    return <Message loading={loading} />;
  }

  if (error === 'Unauthorized' || error === 'Not found') {
    return <ErrorPage type={error} />;
  }

  if (error) {
    return <Message error={error}/>;
  }

  if (!post) {
    return <ErrorPage type='Not found' />;
  }

  const handleGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      post.name + ', ' + post.location

    )}`;
    window.open(url, '_blank');

  };


  return (
    <>
      <Container className='max-w-xl'>
        <img src={post.imageUrl} alt={post.name} className='w-full h-auto mb-6 rounded-[10px]' />
        <Text variant='title'>{post.name}</Text>
        <Text>
          <b>Calificación: </b>{post.rating}/10
        </Text>
        <Text>
          <b>Ubicación: </b>{post.location}
        </Text>
        <Text>
          <b>Reseña: </b>{post.review}
        </Text>
        <Text className='base-text' onClick={() => navUser(post.creator)}>
          <b>Agregado por: </b>
          <Text variant='hipertext'>{post.creator}</Text>
        </Text>
        <Text variant='subtitle'>Subido hace: {tiempoDesde(post.createdAt)}</Text>
        <ButtonContainer>
          <Button variant='small' onClick={handleGoogleMaps}>Ver en Google Maps</Button>
          <Button variant='small' onClick={navBack}>Regresar</Button>
        </ButtonContainer>
        {isCreator && (
          <ButtonContainer>
            <Button variant='small' onClick={() => navPost(ID, true)}>Editar Post</Button>
            <Button variant='small' onClick={handleDeletePost}>Eliminar Post</Button>
          </ButtonContainer>
        )}
        <div className='w-4/5 flex items-center justify-center flex-col'>
          <Text variant='title'>Comentarios</Text>
          <CommentsList comments={post.comments} postID={ID} setError={setError} loadData={loadPost}/>
          <Form 
            defaultValues={{ content: '', rating: '' }} ref={formRef} className='w-[90%]'
            schema={commentSchema} onSubmit={submitComment} isSubmitting={setUploadingComment}
          >
            <Input name='content' variant='textarea' placeholder='Escribe tu comentario aquí' />
            <Input name='rating' variant='rating' placeholder='Calificación (0-10)' />
            <Button type='submit' variant='small' disabled={uploadingComment}>{uploadingComment ? 'Enviando...' : 'Enviar comentario'}</Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default Post;