import { useNav, useTitle } from '../hooks';

import { Button, ButtonContainer, Container, Text} from '../components/tags';

const ErrorPage = ({ type = 'Not Found' }) => {
  const { navBack, navBlog } = useNav();
  const { title } = useTitle(type === 'Unauthorized' ? 'No autorizado' : 'Página no encontrada', 'Error');

  const message =
    type === 'Unauthorized'
      ? 'No tienes permiso para acceder a esta página.'
      : 'La página que buscas no existe.';

  return (
    <>
      <Container>
        <Text variant='title'>{title}</Text>
        <Text variant='subtitle'>{message}</Text>
        <ButtonContainer>
          <Button onClick={navBlog}>{'Ir al Blog'}</Button>
          <Button variant='secondary' onClick={navBack}>{'Volver'}</Button>
        </ButtonContainer>
      </Container>
    </>
  );
};

export default ErrorPage;
