import { useEffect } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useNav, useTitle } from '../hooks';
import { commentSchema } from '../schema';
import { fetchPost, deletePost, addComment } from '../api';
import { timeSince } from '../utils/timeSince';
import { Button, ButtonsContainer, Container, Form, FormField, Message, Text } from '../components/ui';
import ErrorPage from './ErrorPage';
import CommentsList from '../components/CommentsList';

const Post = () => {
  const { setTitle, setDescription } = useTitle(null, 'Aquí se ve un post');
  const { navBack, navBlog, navUser, navPost } = useNav();
  const { ID } = useParams();
  const formRef = useRef();
  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['post', ID],
    queryFn: () => fetchPost(ID),
    onError: (error) => {
      
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
      if (post) {
        setTitle(post.name);
        setDescription(post.review);
      }

      if (isError) {
        setTitle('Error');
        setDescription(error.message || error)
      }
    }, [post, setTitle]);

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(ID),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      navBlog();
    }
  });

  const commentMutation = useMutation({
    mutationFn: (commentData) => addComment(ID, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', ID]);
      if (formRef.current) {
        formRef.current.reset({ content: '', rating: '' });
      }
    }
  });

  const handleDeletePost = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      deleteMutation.mutate();
    }
  };

  const handleGoogleMaps = () => {
    if (!post) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      post.name + ', ' + post.location
    )}`;
    window.open(url, '_blank');
  };

  if (isLoading) return <Message loading />;

  if (isError) {
    if (error.message === 'Unauthorized' || error.message === 'Not found') {
      return <ErrorPage type={error.message} />;
    }
    return <Message error={`Error al cargar el post: ${error.message || error}`} />;
  }

  if (!post) return <ErrorPage type='Not found' />;

  return (
    <Container className='max-w-xl'>
      <img src={post.imageUrl} alt={post.name} className='w-full h-auto mb-6 rounded-[10px] object-cover max-h-[400px]' />

      <Text variant='title'>{post.name}</Text>
      <Text><b>{'Calificación: '}</b>{post.rating}/10</Text>
      <Text><b>{'Ubicación: '}</b>{post.location}</Text>
      <Text><b>{'Reseña: '}</b>{post.review}</Text>
      <Text className='base-text' onClick={() => navUser(post.creator)}>
        <b>{'Agregado por: '}</b> <Text variant='hipertext'>{post.creator}</Text>
      </Text>
      <Text variant='subtitle'>{`Subido hace: ${timeSince(post.createdAt)}`}</Text>

      <ButtonsContainer>
        <Button variant='small' onClick={handleGoogleMaps}>{'Ver en Google Maps'}</Button>
        <Button variant='small' onClick={navBack}>{'Regresar'}</Button>
      </ButtonsContainer>

      {post.editable && (
        <ButtonsContainer>
          <Button variant='small' onClick={() => navPost(ID, true)}>Editar Post</Button>
          <Button variant='small' onClick={handleDeletePost}disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar Post'}
          </Button>
        </ButtonsContainer>
      )}

      <div className='w-4/5 flex items-center justify-center flex-col mt-8'>
        <Text variant='title'>Comentarios</Text>
        <CommentsList comments={post.comments} postID={ID} queryClient={queryClient} />

        <Form
          defaultValues={{ content: '', rating: '' }} ref={formRef} className='w-[90%] mt-4'
          schema={commentSchema} onSubmit={commentMutation.mutate} isSubmitting={commentMutation.isPending}
        >
          <FormField name='content' variant='textarea' placeholder='Escribe tu comentario aquí' />
          <FormField name='rating' variant='rating' placeholder='Calificación (0-10)' />
          <Button type='submit' variant='small' disabled={commentMutation.isPending}>
            {commentMutation.isPending ? 'Enviando...' : 'Enviar comentario'}
          </Button>
        </Form>

        {commentMutation.isError && (
          <Message error={`Error al subir el comentario: ${commentMutation.error.message}`} className='mt-4'/>
        )}

        {deleteMutation.isError && (
          <Message error={`Error al eliminar el post: ${deleteMutation.error.message}`} className='mt-4'/>
        )}
      </div>
    </Container>
  );
};

export default Post;