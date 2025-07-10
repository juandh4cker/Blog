import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { useApi, useNav, useTitle } from '@/hooks';
import { postSchema } from '@/schema';
import { Button, Container, Form, FormField, Message, Text } from '@/components/ui';

import ErrorPage from './ErrorPage';

const EditPost = () => {
  const { setTitle, setDescription } = useTitle(null, 'Aquí se edita un post');

  const { editPost, fetchPost } = useApi();
  const { navPost } = useNav();
  const { ID } = useParams();
  const queryClient = useQueryClient();
  const formRef = useRef();

  const [editable, setEditable] = useState(false);

  const {
    data: post = { name: '', location: '', imageUrl: '', review: '', rating: '', editable: null},
    isLoading: isLoading,
    isError: isError,
    error: error
  } = useQuery({
    queryKey: ['post', ID],
    queryFn: () => fetchPost(ID),
  });

  useEffect(() => {
    if (post?.editable === false) {
      navPost(ID);
    } else if (post?.editable === true) {
      setEditable(true);
    };

    if (post) {
      setTitle(post.name);
      setDescription(post.review);
    }

    if (isError) {
      setTitle('Error');
      setDescription(error.message || error);
    }
  }, [post, setTitle, setDescription, navPost, ID, isError, error]);

  const mutation = useMutation({
    mutationFn: (data) => editPost(ID, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', ID]);
      queryClient.invalidateQueries(['posts']);
      navPost(ID);
    }
  });

  const handleSubmit = (formData) => {
    const fieldsToCompare = ['name', 'location', 'imageUrl', 'review', 'rating'];

    const hasChanges = fieldsToCompare.some(
      field => formData[field] !== post[field]
    );

    if (hasChanges) {
      mutation.mutate(formData);
    } else {
      navPost(ID);
    }
  };

  if (isLoading) return <Message loading />;
  if (isError) return <ErrorPage error={error.message || error} message={'cargar el post'} />;
  if (!editable) return null;

  return (
    <Container className='max-w-lg'>
      <Text variant='title'>{'Editar Post'}</Text>
      <Text variant='subtitle'>{'Edita los detalles del post'}</Text>

      <Form
        defaultValues={post} ref={formRef}
        schema={postSchema} onSubmit={handleSubmit} isSubmitting={mutation.isPending}
      >
        <FormField name='name' label='Nombre del post'/>
        <FormField name='location' label='Ubicación'/>
        <FormField name='imageUrl' label='URL de la imagen del post'/>
        <FormField name='review' variant='textarea'/>
        <FormField name='rating' variant='rating' label='Calificación (0-10)'/>

        <Button type='submit' isLoading={mutation.isPending} loadingText={'Editando post...'} variant='submitForm'>
          {'Editar post'}
        </Button>
        <Button variant='secondForm' onClick={() => navPost(ID)} disabled={mutation.isPending}>
          {'Cancelar'}
        </Button>
      </Form>

      {mutation.isError && <Message error={mutation.error} />}
    </Container>
  );
};

export default EditPost;