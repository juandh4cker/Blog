import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { useNav, useTitle } from '../hooks';
import { editPost, fetchPost } from '../api';
import { postSchema } from '../schema';

import { Button, Container, Form, Input, Message, Text } from '../components/ui';

const EditPost = () => {
  const { setTitle, setDescription } = useTitle(null, 'Aquí se edita un post');

  const { navPost } = useNav();
  const { ID } = useParams();
  const formRef = useRef();

  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading: isLoading,
    isError: isError,
    error: error
  } = useQuery({
    queryKey: ['post', ID],
    queryFn: () => fetchPost(ID),
    onSuccess: (postData) => {
      if (!postData.editable) navPost(ID);
      setTitle(postData.name);
      setDescription(postData.review);
      if (formRef.current) formRef.current.reset(postData);
    },
    onError: (error) => {
      setTitle('Error');
      setDescription(error.message || error)
    }
  });

  const mutation = useMutation({
    mutationFn: (data) => editPost(ID, data),
    onSuccess: () => {
      queryClient.setQueryData(['post', ID], (oldData) => {
        return {...oldData, ...mutation.variables};
      });

      queryClient.invalidateQueries(['post', ID]);
      queryClient.invalidateQueries(['posts']);

      navPost(ID);
    }
  });

  return (
    <Container className='max-w-lg'>
      <Text variant='title'>{'Editar Post'}</Text>
      <Text variant='subtitle'>{'Edita los detalles del post'}</Text>

      {isLoading && <Message loading={isLoading} />}
      {isError && <Message error={error} />}

      {post && (
        <Form
        defaultValues={post} ref={formRef}
        schema={postSchema} onSubmit={mutation.mutate} isSubmitting={mutation.isPending}
        >
          <Input name='name' placeholder='Nombre del post'/>
          <Input name='location' placeholder='Ubicación'/>
          <Input name='imageUrl' placeholder='URL de la imagen del post'/>
          <Input name='review' variant='textarea' placeholder='Reseña'/>
          <Input name='rating' variant='rating' placeholder='Calificación (0-10)'/>

          <Button type='submit' disabled={mutation.isPending}>{'Editar post'}</Button>
          <Button variant='secondary' onClick={() => navPost(ID)} disabled={mutation.isPending}>{'Cancelar'}</Button>
        </Form>
      )}

      {mutation.isError && <Message error={mutation.error} />}
    </Container>
  );
};

export default EditPost;