import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { useApi, useNav, useTitle, useToast } from '@/hooks';
import { postSchema } from '@/schema';
import { Button, Container, Error, Form, Input, Text } from '@/componentes';

const EditPost = () => {
  const { setTitle, setDescription } = useTitle(null, 'Aquí se edita un post');

  const { editPost, fetchPost } = useApi();
  const { navPost } = useNav();
  const { ID } = useParams();
  const { toastError } = useToast();
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
    },
    onError: (error) => toastError("Error al editar el post", error.message),
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
  if (isError) return <Error>{error}</Error>;;
  if (!editable) return null;

  return (
    <Container kind='background' className='max-w-lg'>
      <Text kind='title'>{'Editar Post'}</Text>
      <Text kind='subtitle'>{'Edita los detalles del post'}</Text>

      <Form
        defaultValues={post} ref={formRef}
        schema={postSchema} onSubmit={handleSubmit} isSubmitting={mutation.isPending}
      >
        <Input name='name' label='Nombre del post'/>
        <Input name='location' label='Ubicación'/>
        <Input name='imageUrl' label='URL de la imagen del post'/>
        <Input name='review' kind='textarea'/>
        <Input name='rating' kind='rating' label='Calificación (0-10)'/>

        <Button kind='primary' type='submit' isLoading={mutation.isPending}>
          {'Editar post'}
        </Button>
        <Button kind='secondary' onClick={() => navPost(ID)} disabled={mutation.isPending}>
          {'Cancelar'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditPost;