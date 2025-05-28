import { useState } from 'react';

import { useNav } from '../hooks/useNav';
import { useTitle } from '../hooks/useTitle';

import Login from '../components/access/Login'
import Register from '../components/access/Register';

import Container from '../components/tags/Container';
import Text from '../components/tags/Text';
import Button from '../components/tags/Button';
import Message from '../components/tags/Message';

const LandingPage = () => {
  const { navBlog } = useNav();

  const [ inLogin, setInlogin ] = useState(true);
  const [error, setError] = useState('');

  useTitle('Inicio', 'Inicia sesión o registrate');

  return (
    <Container className='max-w-md'>
      <Text variant='title'>{'Bienvenido a WorldBlog'}</Text>
      <Text variant='subtitle'>{'Descubre los mejores destinos alrededor del mundo'}</Text>
      {inLogin ? <Login setInLogin={setInlogin} setError={setError}/> : <Register setInLogin={setInlogin} setError={setError}/>}
      <Button variant='secondary' className='w-full' onClick={navBlog}>{'Entrar como invitado'}</Button>
      {error && <Message error={error} />}
    </Container>
  );
};

export default LandingPage;