import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useApi, useNav } from '@/hooks';
import { postSchema } from '@/schema';
import { Button, Container, Error, Form, Input, Text, Loading } from '@/components';

const EditPost = () => {
  const { editPost, fetchPost } = useApi();
  const { navPost } = useNav();
  const { ID } = useParams();
  const formRef = useRef();

  const [editable, setEditable] = useState(null);

  const { data: post, isLoading, isError, error } = fetchPost(ID);

   useEffect(() => {
    if (post?.editable === false) {
      setEditable(false);
      navPost(ID);
      
    } else if (post?.editable === true) {
      setEditable(true);
    };
  }, [post, navPost, ID]);

  const editPostMutation = editPost({
    onSuccess: () => navPost(ID)
  });

  const handleSubmit = (formData) => {
    const fieldsToCompare = ['name', 'location', 'imageUrl', 'review', 'rating'];

    const hasChanges = fieldsToCompare.some(
      field => formData[field] !== post[field]
    );

    if (hasChanges) {
      editPostMutation.mutate({ ID, data: formData });

    } else {
      navPost(ID);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error>{error}</Error>;;
  if (editable === false) return null;

  return (
    <Container kind='background' className='max-w-lg'>
      <Text kind='title'>{'Editar Post'}</Text>
      <Text kind='subtitle'>{'Edita los detalles del post'}</Text>

      <Form
        defaultValues={post} ref={formRef}
        schema={postSchema} onSubmit={handleSubmit} isSubmitting={editPostMutation.isPending}
      >
        <Input name='name' label='Nombre del post'/>
        <Input name='location' label='Ubicación'/>
        <Input name='imageUrl' label='URL de la imagen del post'/>
        <Input name='review' kind='textarea'/>
        <Input name='rating' kind='rating' label='Calificación (0-10)'/>

        <Button kind='primary' type='submit' isLoading={editPostMutation.isPending}>
          {'Editar post'}
        </Button>
        <Button kind='secondary' onClick={() => navPost(ID)} disabled={editPostMutation.isPending}>
          {'Cancelar'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditPost;