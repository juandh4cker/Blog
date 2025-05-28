import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useNav } from '../hooks/useNav';
import { useForm } from '../hooks/useForm';
import { useTitle } from '../hooks/useTitle';

import { editPost, fetchPost } from '../api/posts';

import Button from '../components/tags/Button';
import Container from '../components/tags/Container';
import Form from '../components/tags/Form';
import Input from '../components/tags/Input';
import Message from '../components/tags/Message';
import Text from '../components/tags/Text';

const EditPost = () => {
  const { navPost } = useNav();
  const { ID } = useParams();

  const { formData, setFormData, setInputData } = useForm({ name: '', location: '', imageUrl: '', review: '', rating: ''});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { setTitle, setDescription } = useTitle(null, 'Aquí se ve un post');

  const loadPost = async () => {
    fetchPost(ID)
      .then((postData) => {
        if (!postData.editable) navPost(ID);

        setFormData(postData);
        setTitle(postData.name);
        setDescription(postData.review);
      })
      .catch((error) => {
        setError(`Error al editar el post: ${error.message || error}`);
        setTitle('Error');
      })
      .finally(() => {
        setLoading(false);
      })
    };

  useEffect(() => {
    loadPost();
  }, [ID]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const rating = parseFloat(formData.rating);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      setError('La calificación debe estar entre 1 y 10.');
      return;
    }

    const updatedPost = {
      ...formData,
      rating,
    };

    setError('')
    setLoading(true);

    editPost(ID, updatedPost)
      .then(() => {
        navPost(ID);
      })
      .catch((error) => {
        setError(`Error al actualizar el post: ${error.message || error}`);
      })
      .finally(() => {
        setLoading(false);
      })
  };

  return (
    <>
      <Container className='max-w-lg'>
        <Text variant='title'>Editar Post</Text>
        <Text variant='subtitle'>Edita los detalles del post</Text>
        <Form onSubmit={handleUpdatePost}>
          <Input placeholder='Nombre del post' {...setInputData('name')} />
          <Input placeholder='Ubicación' {...setInputData('location')} />
          <Input placeholder='URL de la imagen del post' {...setInputData('imageUrl')} />
          <Input variant='textarea' placeholder='Reseña' {...setInputData('review')} />
          <Input variant='rating' placeholder='Calificación (0-10)' {...setInputData('rating')} />
          <Button type='submit' disabled={loading}>{'Editar post'}</Button>
          <Button variant='secondary' onClick={() => navPost(ID)}>{'Cancelar'}</Button>
        </Form>
        {error && <Message error={error} />}
      </Container>
    </>
  );
};

export default EditPost;