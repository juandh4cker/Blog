import { useQueryClient, useMutation } from '@tanstack/react-query';

import { useApi, useNav, useToast } from '@/hooks';
import { postSchema } from '@/schema';
import { Button, Container, Form, Input, Text } from '@/components';

const Dashboard = () => {
  const { addPost } = useApi();
  const { navBack, navPost } = useNav();
  const { toastError } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (postData) => addPost(postData),
    onSuccess: (postID) => {
      queryClient.invalidateQueries(['posts']);
      navPost(postID);
    },
    onError: (error) => toastError("Error al crear el post", error.message),
  });

  return (
    <Container kind='background' className='w-lg'>
      <Text kind='title'>{'Agregar un post'}</Text>
      <Text>{'Rellena los datos para agregarlos'}</Text>

      <Form
        schema={postSchema} onSubmit={mutation.mutate} isSubmitting={mutation.isPending}
      >
        <Input name='name' label='Nombre del post'/>
        <Input name='location' label='Ubicación'/>
        <Input name='imageUrl' label='URL de la imagen del post'/>
        <Input name='review' kind='textarea' />
        <Input name='rating' kind='rating'/>

        <Button kind='primary' type='submit' isLoading={mutation.isPending}>
          {'Agregar post'}
        </Button>
        <Button kind='secondary' onClick={navBack} isDisabled={mutation.isPending}>
          {'Cancelar'}
        </Button>
      </Form>
    </Container>
  );
};

export default Dashboard;