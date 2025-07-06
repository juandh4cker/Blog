import { useNav } from '@/hooks';

import { Button, Container, Message, Text } from '@/components/ui';

const ErrorPage = ({ error, message }) => {
  const { navBack, navBlog } = useNav();

  const title = error === 'Unauthorized'
    ? 'No autorizado'
    : 'No encontrado';

  const subtitle =
    error  === 'Unauthorized'
      ? 'No tienes permiso para acceder a este lugar.'
      : 'Lo que buscas no existe.';

  if (error === 'Unauthorized' || error === 'Not found') {
    return (
      <Container>
        <Text variant='title'>{title}</Text>
        <Text variant='subtitle'>{subtitle}</Text>
        <Container variant='button'>
          <Button onClick={navBlog}>{'Ir al Blog'}</Button>
          <Button variant='secondary' onClick={navBack}>{'Volver'}</Button>
        </Container>
      </Container>
    );
  }

  return <Message error={`Error${message ? ` al ${message}` : ''}: ${error}`} />;
};

export default ErrorPage;
