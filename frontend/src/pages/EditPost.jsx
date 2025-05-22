import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useNav } from '../hooks/useNav';
import { useTitle } from '../hooks/useTitle';

import { editPost, fetchPost } from '../api/posts';

import Button from '../components/tags/Button';
import Container from '../components/tags/Container';
import Form from '../components/tags/Form';
import Input from '../components/tags/Input';
import Message from '../components/tags/Message';
import Text from '../components/tags/Text';

const EditPost = () => {
  const { navigateBack, navigatePost } = useNav();
  const { ID } = useParams();

  const [formData, setFormData] = useState({ name: '', location: '', imageUrl: '', review: '', rating: ''});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { setTitle, setDescription } = useTitle(null, 'Aquí se ve un post');

  useEffect(() => {
    const getPost = async () => {
      fetchPost(ID)
      .then((postData) => {
        if (!postData.editable) navigatePost(ID);

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

    getPost();
  }, [ID]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const rating = parseFloat(formData.rating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      setError('La calificación debe estar entre 0 y 10.');
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
      navigatePost(ID);
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
          <Input
            placeholder='Nombre del post'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            placeholder='Ubicación'
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <Input
            placeholder='URL de la imagen del post'
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          <Input
            variant='textarea'
            placeholder='Reseña'
            value={formData.review}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
          />
          <Input
            variant='rating'
            placeholder='Calificación (0-10)'
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          />
          <Button type='submit' disabled={loading}>{'Editar post'}</Button>
          <Button variant='secondary' onClick={navigateBack}>{'Cancelar'}</Button>
        </Form>
        {error && <Message error={error} />}
      </Container>
    </>
  );
};

export default EditPost;