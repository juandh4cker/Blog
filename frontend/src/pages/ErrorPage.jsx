import { useNav } from '@/hooks';

import { Button, Container, Text } from '@/components/ui';

const ErrorPage = () => {
  const { navBack, navBlog } = useNav();

  return (
    <Container variant='background'>
      <Text variant='title'>Error</Text>
      <Text variant='subtitle'>Lo que buscas no existe o ha sido eliminado</Text>
      <Container variant='button'>
        <Button onClick={navBlog}>{'Ir al Blog'}</Button>
        <Button onClick={navBack}>{'Volver'}</Button>
      </Container>
    </Container>
  );
};

export default ErrorPage;
