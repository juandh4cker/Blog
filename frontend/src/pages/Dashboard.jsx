import { useQueryClient, useMutation } from '@tanstack/react-query';

import { useNav, useTitle } from '../hooks';
import { addPost } from '../api';
import { postSchema } from '../schema';
import { Button, Container, Form, Input, Message, Text } from '../components/ui';

const Dashboard = () => {
  useTitle('Dashboard', 'Aquí agregas posts.');

  const { navBack, navPost } = useNav();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addPost,
    onSuccess: (postID) => {
      queryClient.invalidateQueries(['posts']);
      navPost(postID);
    },
    onError: (error) => {
      console.error(`Error al agregar el post: ${error}`);
    }
  });

  return (
    <Container className='max-w-lg'>
      <Text variant='title'>{'Agregar un post'}</Text>
      <Text variant='subtitle'>{'Rellena los datos para agregarlos'}</Text>

      <Form
        defaultValues={{ name: '', location: '', imageUrl: '', review: '', rating: ''}}
        schema={postSchema} onSubmit={mutation.mutate} isSubmitting={mutation.isPending}
      >
        <Input name='name' placeholder='Nombre del post'/>
        <Input name='location' placeholder='Ubicación'/>
        <Input name='imageUrl' placeholder='URL de la imagen del post'/>
        <Input name='review' variant='textarea' />
        <Input name='rating' variant='rating'/>

        <Button type='submit' disabled={mutation.isPending}>{'Agregar post'}</Button>
        <Button variant='secondary' onClick={navBack} disabled={mutation.isPending}>{'Cancelar'}</Button>
      </Form>

      {mutation.isError && <Message error={mutation.error} />}
    </Container>
  );
};

export default Dashboard;