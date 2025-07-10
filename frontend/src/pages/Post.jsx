import { useEffect } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useApi, useNav, useTitle } from '@/hooks';
import { commentSchema } from '@/schema';
import { timeSince } from '@/utils/timeSince';
import { Button, Container, Form, FormField, Message, Text } from '@/components/ui';
import ErrorPage from './ErrorPage';
import CommentsList from '@/components/CommentsList';

const Post = () => {
  const { setTitle, setDescription } = useTitle(null, 'Aquí se ve un post');

  const { fetchPost, deletePost, addComment, likePost } = useApi();
  const { navBack, navBlog, navUser, navPost } = useNav();
  const { ID } = useParams();
  const queryClient = useQueryClient();
  const formRef = useRef();

  const {
    data: post,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['post', ID],
    queryFn: () => fetchPost(ID),
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

  const likeMutation = useMutation({
    mutationFn: () => likePost(ID),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', ID]);
    },
    onError: (error) => {
      console.error(error)
    }
  });

  const handleDeletePost = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      deleteMutation.mutate();
    }
  };

  const isLiking = post?.isLiking || false;
  const likes = post?.likes || 0;

  if (isLoading) return <Message loading />;
  if (isError) return <ErrorPage error={error.message || error} message={'cargar el post'}/>
  if (!post) return <ErrorPage error='Not found' />;

  const handleGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      post.name + ', ' + post.location
    )}`;
    window.open(url, '_blank');
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  return (
    <Container className='max-w-xl'>
      <img src={post.imageUrl} alt={post.name} className='w-full h-auto mb-6 rounded-xl object-cover max-h-96' />

      <Text variant='title'>{post.name}</Text>
      <Text><b>{'Calificación: '}</b>{post.rating}/10</Text>
      <Text><b>{'Ubicación: '}</b>{post.location}</Text>
      <Text><b>{'Reseña: '}</b>{post.review}</Text>
      <Text className='base-text' onClick={() => navUser(post.creator)}>
        <b>{'Agregado por: '}</b> <Text variant='hipertext'>{post.creator}</Text>
      </Text>
      <Text variant='subtitle' className='!my-0'>
        <b>{'Likes: '}</b>{likes}
      </Text>
      <Text variant='subtitle'>{`Subido hace: ${timeSince(post.createdAt)}`}</Text>

      <Container variant='button'>
        <Button onClick={handleLike} disabled={likeMutation.isPending} >
          {likeMutation.isPending ? '...' : isLiking ? 'Dislike' : 'Like'}
        </Button>
        <Button variant='share' />
        <Button onClick={handleGoogleMaps}>{'Ver en Google Maps'}</Button>
        {post.editable && (
          <>
            <Button onClick={() => navPost(ID, true)}>{'Editar Post'}</Button>
            <Button onClick={handleDeletePost}disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar Post'}
            </Button>
          </>
        )}
      </Container>


      <div className='w-4/5 flex items-center justify-center flex-col mt-8'>
        <Text variant='title'>Comentarios</Text>
        <CommentsList comments={post.comments} postID={ID} queryClient={queryClient} />

        <Form
          defaultValues={{ content: '', rating: '' }} ref={formRef}
          schema={commentSchema} onSubmit={commentMutation.mutate} isSubmitting={commentMutation.isPending}
        >
          <FormField name='content' variant='textarea' label='Escribe tu comentario aquí' />
          <FormField name='rating' variant='rating' label='Calificación (0-10)' />
          <Button type='submit' variant='submitForm' isLoading={commentMutation.isPending} loadingText={'Enviando...'}>
            {'Enviar comentario'}
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