import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useNav, useTitle } from '../hooks';

import Login from '../components/access/Login'
import Register from '../components/access/Register';

import { Button, Container, Message, Text } from '../components/tags';

const LandingPage = () => {
  const { navBlog } = useNav();
  const location = useLocation();

  const from = location.state?.from;

  const [ inLogin, setInlogin ] = useState(true);
  const [error, setError] = useState('');

  useTitle('Inicio', 'Inicia sesión o registrate');

  return (
    <Container className='max-w-md'>
      <Text variant='title'>{'Bienvenido a WorldBlog'}</Text>
      <Text variant='subtitle'>
        {from ?
            'Necesitas iniciar sesión para ver este contenido'
          :
            'Descubre los mejores destinos alrededor del mundo'
        }
      </Text>
      {inLogin ? 
        <Login setInLogin={setInlogin} setError={setError} from={from}/> 
        : 
        <Register setInLogin={setInlogin} setError={setError} from={from}/>
      }
      <Button variant='secondary' className='w-full' onClick={navBlog}>{'Entrar como invitado'}</Button>
      {error && <Message error={error} />}
    </Container>
  );
};

export default LandingPage;