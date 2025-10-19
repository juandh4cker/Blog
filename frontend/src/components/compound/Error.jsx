import { useNav } from '@/hooks';

import { Button, Container, Text } from '@/components';

const Error = ({ children, page = true }) => {
  const { navBack, navBlog } = useNav();

  const defaultError = 'Lo que buscas no existe o ha sido eliminado';

  const props = page ? { kind: 'background' } : {};

  let displayMessage;
  if (children) {
    if (typeof children === 'object' && 'message' in children) {
      displayMessage = children.message;
    } else {
      displayMessage = children;
    }
  } else {
    displayMessage = defaultError;
  }

  return (
    <Container {...props} className="max-w-xl">
      <Text kind="title">{'Error'}</Text>
      <Text>{displayMessage}</Text>
      <Button.Group>
        <Button onClick={navBlog}>{'Ir al Blog'}</Button>
        <Button onClick={navBack}>{'Volver'}</Button>
      </Button.Group>
    </Container>
  );
};

export default Error;
