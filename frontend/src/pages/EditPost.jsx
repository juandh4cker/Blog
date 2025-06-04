import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useNav, useTitle } from '../hooks';
import { editPost, fetchPost } from '../api';
import { postSchema } from '../schema';

import { Button, Container, Form, Input, Message, Text } from '../components/ui';

const EditPost = () => {
  const { navPost } = useNav();
  const { ID } = useParams();
  const formRef = useRef();

  const [post, setPost] = useState({ name: '', location: '', imageUrl: '', review: '', rating: ''});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { setTitle, setDescription } = useTitle(null, 'Aquí se edita un post');

  const loadPost = async () => {
    return fetchPost(ID)
      .then((postData) => {
        if (!postData.editable) navPost(ID);

        setPost(postData);
        setTitle(postData.name);
        setDescription(postData.review);

        if (formRef.current) {
          formRef.current.reset(postData);
        }
      })
      .catch((error) => {
        setError(`Error al editar el post: ${error.message || error}`);
        setTitle('Error');
      })
    };

  useEffect(() => {
    loadPost();
  }, [ID]);

  const onSubmit = async (data) => {
    setError('')

    return editPost(ID, data)
      .then(() => {
        navPost(ID);
      })
      .catch((error) => {
        setError(`Error al actualizar el post: ${error.message || error}`);
      })
  };

  return (
    <Container className='max-w-lg'>
      <Text variant='title'>Editar Post</Text>
      <Text variant='subtitle'>Edita los detalles del post</Text>
      <Form
        defaultValues={post} ref={formRef}
        schema={postSchema} onSubmit={onSubmit} isSubmitting={setLoading}
      >
        <Input name="name" placeholder='Nombre del post'/>
        <Input name="location" placeholder='Ubicación'/>
        <Input name="imageUrl" placeholder='URL de la imagen del post'/>
        <Input name="review" variant='textarea' placeholder='Reseña'/>
        <Input name="rating" variant='rating' placeholder='Calificación (0-10)'/>
        <Button type='submit' disabled={loading}>{'Editar post'}</Button>
        <Button variant='secondary' onClick={() => navPost(ID)} disabled={loading}>{'Cancelar'}</Button>
      </Form>
      {error && <Message error={error} />}
    </Container>
  );
};

export default EditPost;