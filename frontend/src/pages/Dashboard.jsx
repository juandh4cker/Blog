import { useApi, useNav } from '@/hooks';
import { postSchema } from '@/schema';
import { Button, Container, Form, Input, Text } from '@/components';

const Dashboard = () => {
  const { addPost } = useApi();
  const { navBack, navPost } = useNav();

  const addPostMutation = addPost({
    onSuccess: (postID) => navPost(postID),
  });

  return (
    <Container kind="background" className="w-lg">
      <Text kind="title">{'Agregar un post'}</Text>
      <Text>{'Rellena los datos para agregarlos'}</Text>

      <Form
        schema={postSchema}
        onSubmit={addPostMutation.mutate}
        isSubmitting={addPostMutation.isPending}
      >
        <Input name="name" label="Nombre del post" />
        <Input name="location" label="Ubicación" />
        <Input name="imageUrl" label="URL de la imagen del post" />
        <Input name="review" kind="textarea" />
        <Input name="rating" kind="rating" />

        <Button kind="primary" type="submit" isLoading={addPostMutation.isPending}>
          {'Agregar post'}
        </Button>
        <Button kind="secondary" onClick={navBack} isDisabled={addPostMutation.isPending}>
          {'Cancelar'}
        </Button>
      </Form>
    </Container>
  );
};

export default Dashboard;
