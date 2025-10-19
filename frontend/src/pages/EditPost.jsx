import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useApi, useNav } from '@/hooks';
import { Button, Container, Error, Form, Input, Text } from '@/components';
import { postSchema } from '@/schema';

const EditPost = () => {
  const { editPost, fetchPost } = useApi();
  const { navPost } = useNav();
  const { ID } = useParams();
  const formRef = useRef();

  const { data: post, isLoading, isError, error } = fetchPost(ID);

  useEffect(() => {
    if (post) {
      formRef.current?.reset(post);
    }
  }, [post]);

  useEffect(() => {
    if (post?.editable === false) {
      navPost(ID);
    }
  }, [post, navPost, ID]);

  const editPostMutation = editPost({
    onSuccess: () => navPost(ID),
  });

  const handleSubmit = (formData) => {
    const fieldsToCompare = ['name', 'location', 'imageUrl', 'review', 'rating'];
    const hasChanges = fieldsToCompare.some((field) => formData[field] !== post[field]);

    if (hasChanges) {
      editPostMutation.mutate({ ID, data: formData });
    } else {
      navPost(ID);
    }
  };

  if (isError) return <Error>{error}</Error>;
  if (!isLoading && !post?.editable) return null;

  return (
    <Container kind="background" className="max-w-lg">
      <Text kind="title">{'Editar Post'}</Text>
      <Text kind="subtitle">{'Edita los detalles del post'}</Text>

      <Form
        key={post?.ID}
        ref={formRef}
        defaultValues={post}
        schema={postSchema}
        onSubmit={handleSubmit}
        isSubmitting={editPostMutation.isPending}
      >
        <Input name="name" label="Nombre del post" isDisabled={isLoading} />
        <Input name="location" label="Ubicación" isDisabled={isLoading} />
        <Input name="imageUrl" label="URL de la imagen del post" isDisabled={isLoading} />
        <Input name="review" kind="textarea" isDisabled={isLoading} />
        <Input name="rating" kind="rating" label="Calificación (0-10)" isDisabled={isLoading} />

        <Button kind="primary" type="submit" isLoading={isLoading || editPostMutation.isPending}>
          {'Editar post'}
        </Button>
        <Button
          kind="secondary"
          onClick={() => navPost(ID)}
          isDisabled={editPostMutation.isPending}
        >
          {'Cancelar'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditPost;
