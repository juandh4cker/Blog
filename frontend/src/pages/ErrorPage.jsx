import { useNav } from '@/hooks';

import { Button, ButtonsContainer, Container, Message, Text } from '@/components/ui';

const ErrorPage = ({ error, message, type }) => {
  const { navBack, navBlog } = useNav();

  const title = type === 'Unauthorized'
    ? 'No autorizado'
    : 'No encontrado';

  const subtitle =
    type  === 'Unauthorized'
      ? 'No tienes permiso para acceder a este lugar.'
      : 'Lo que buscas no existe.';

      if (error === 'Unauthorized' || error === 'Not found') {
    return (
      <Container>
        <Text variant='title'>{title}</Text>
        <Text variant='subtitle'>{subtitle}</Text>
        <ButtonsContainer>
          <Button onClick={navBlog}>{'Ir al Blog'}</Button>
          <Button variant='secondary' onClick={navBack}>{'Volver'}</Button>
        </ButtonsContainer>
      </Container>
    );
  }

  return <Message error={`Error${message ? ` al ${message}` : ''}: ${error}`} />;
};

export default ErrorPage;
