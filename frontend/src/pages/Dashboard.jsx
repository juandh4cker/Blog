import { useState } from 'react';

import { useNav, useTitle } from '../hooks';
import { addPost } from '../api';
import { postSchema } from '../schema';

import { Button, Container, Form, Input, Message, Text } from '../components/ui';

const Dashboard = () => {
  const { navBack, navPost } = useNav();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useTitle('Dashboard', 'Aquí agregas posts.');

  const onSubmit = async (data) => {
    setError('')

    return addPost(data)
      .then((response) => {
        navPost(`/post/${response}`);
      })
      .catch((error) => {
        setError(`Error al agregar el post: ${error.message || error}`);
      })
  };

  return (
    <Container className='max-w-lg'>
      <Text variant='title'>Agregar un post</Text>
      <Text variant='subtitle'>Rellena los datos para agregarlos</Text>
      <Form
        defaultValues={{ name: '', location: '', imageUrl: '', review: '', rating: ''}} 
        schema={postSchema} onSubmit={onSubmit} isSubmitting={setLoading}
      >
        <Input name="name" placeholder='Nombre del post'/>
        <Input name="location" placeholder='Ubicación'/>
        <Input name="imageUrl" placeholder='URL de la imagen del post'/>
        <Input name="review" variant='textarea' placeholder='Reseña'/>
        <Input name="rating" variant='rating' placeholder='Calificación (0-10)'/>
        <Button type='submit' disabled={loading}>{'Agregar post'}</Button>
        <Button variant='secondary' onClick={navBack} disabled={loading}>{'Cancelar'}</Button>
      </Form>
      {error && <Message error={error} />}
    </Container>
  );
};

export default Dashboard;