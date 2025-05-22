import { useState } from 'react';

import { useTitle } from '../hooks/useTitle';

import Login from '../components/access/Login'
import Register from '../components/access/Register';

import Container from '../components/tags/Container';
import Text from '../components/tags/Text';

const LandingPage = () => {
  const [ inLogin, setInlogin ] = useState(true);

  useTitle('Inicio', 'Inicia sesión o registrate');

  return (
    <>
      <Container className='max-w-md'>
        <Text variant='title'>{'Bienvenido a WorldBlog'}</Text>
        <Text variant='subtitle'>{'Descubre los mejores destinos alrededor del mundo'}</Text>
        {inLogin ? <Login setInLogin={setInlogin}/> : <Register setInLogin={setInlogin}/>}
      </Container>
    </>
  );
};

export default LandingPage;