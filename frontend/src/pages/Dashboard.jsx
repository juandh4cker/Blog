import { useState } from 'react';

import { useNav } from '../hooks/useNav';
import { useForm } from '../hooks/useForm';
import { useTitle } from '../hooks/useTitle';
import { addPost } from '../api/posts';

import Button from '../components/tags/Button';
import Container from '../components/tags/Container';
import Form from '../components/tags/Form';
import Input from '../components/tags/Input';
import Message from '../components/tags/Message';
import Text from '../components/tags/Text';

const Dashboard = () => {
  const { navBack, navPost } = useNav();

  const { formData, setInputData } = useForm({ name: '', location: '', imageUrl: '', review: '', rating: ''});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useTitle('Dashboard', 'Aquí agregas posts.');

  const handleAddPost = async (e) => {
    e.preventDefault();

    const rating = parseFloat(formData.rating);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      setError('La calificación debe estar entre 1 y 10.');
      return;
    } 

    const postData = {
      ...formData,
      rating
    };

    setError('')
    setLoading(true);

    addPost(postData)
    .then((response) => {
      navPost(`/post/${response}`);
    })
    .catch((error) => {
      setError(`Error al agregar el post: ${error.message || error}`);
    })
    .finally(() => {
      setLoading(false);
    })
  };

  return (
    <Container className='max-w-lg'>
      <Text variant='title'>Agregar un post</Text>
      <Text variant='subtitle'>Rellena los datos para agregarlos</Text>
      <Form onSubmit={handleAddPost}>
        <Input placeholder='Nombre del post' {...setInputData('name')} />
        <Input placeholder='Ubicación' {...setInputData('location')} />
        <Input placeholder='URL de la imagen del post' {...setInputData('imageUrl')} />
        <Input variant='textarea' placeholder='Reseña' {...setInputData('review')} />
        <Input variant='rating' placeholder='Calificación (0-10)' {...setInputData('rating')} />
        <Button type='submit' disabled={loading}>{'Agregar post'}</Button>
        <Button variant='secondary' onClick={navBack}>{'Cancelar'}</Button>
      </Form>
      {error && <Message error={error} />}
    </Container>
  );
};

export default Dashboard;