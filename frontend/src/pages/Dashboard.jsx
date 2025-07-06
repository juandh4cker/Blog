import { useQueryClient, useMutation } from '@tanstack/react-query';

import { useApi, useNav } from '@/hooks';
import { postSchema } from '@/schema';
import { Button, Container, Form, FormField, Message, Text } from '@/components/ui';

const Dashboard = () => {
  const { addPost } = useApi();
  const { navBack, navPost } = useNav();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (postData) => addPost(postData),
    onSuccess: (postID) => {
      queryClient.invalidateQueries(['posts']);
      navPost(postID);
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
        <FormField name='name' placeholder='Nombre del post'/>
        <FormField name='location' placeholder='Ubicación'/>
        <FormField name='imageUrl' placeholder='URL de la imagen del post'/>
        <FormField name='review' variant='textarea' />
        <FormField name='rating' variant='rating'/>

        <Button type='submit' disabled={mutation.isPending}>
          {mutation.isPending ? 'Agregando post...' : 'Agregar post'}
        </Button>
        <Button variant='secondary' onClick={navBack} disabled={mutation.isPending}>
          {'Cancelar'}
        </Button>
      </Form>

      {mutation.isError && <Message error={mutation.error} />}
    </Container>
  );
};

export default Dashboard;