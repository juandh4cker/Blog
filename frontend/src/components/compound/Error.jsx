import { useNav } from '@/hooks';

import { Button, Container, Text } from '@/components';

const Error = ({ children, page }) => {
  const { navBack, navBlog } = useNav();

  const defaultError = 'Lo que buscas no existe o ha sido eliminado';

const props = page ? { kind: "background" } : {};

  return (
    <Container {...props} className='max-w-xl'>
      <Text kind='title'>{'Error'}</Text>
      <Text>{children ? children : defaultError}</Text>
      <Button.Group>
        <Button onClick={navBlog}>{'Ir al Blog'}</Button>
        <Button onClick={navBack}>{'Volver'}</Button>
      </Button.Group>
    </Container>
  );
};

export default Error;