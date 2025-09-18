import { useNav } from '@/hooks';

import { Button, Container, Text } from '@/componentes';

const Error = ({ children }) => {
  const { navBack, navBlog } = useNav();

  const defaultError = 'Lo que buscas no existe o ha sido eliminado';

  return (
    <Container>
      <Text kind='title'>{'Error'}</Text>
      <Text>{children ? children : defaultError}</Text>
      <Container kind='button'>
        <Button onClick={navBlog}>{'Ir al Blog'}</Button>
        <Button onClick={navBack}>{'Volver'}</Button>
      </Container>
    </Container>
  );
};

export default Error;