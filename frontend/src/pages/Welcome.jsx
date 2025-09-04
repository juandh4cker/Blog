import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useApi, useAuth, useNav } from '@/hooks';
import { registerSchema } from '@/schema'
import { Button, Container, Form, FormField, Message, Text } from '@/components/ui';

const Welcome = ({ inRegister = false }) => {
  const { from } = useNav();
   
  return (
    <Container variant='background' className='max-w-md'>
      <Text variant='title'>{'Bienvenido a WorldBlog'}</Text>
      <Text variant='subtitle'>
        {from
          ? 'Necesitas iniciar sesión para ver este contenido'
          : 'Descubre los mejores destinos alrededor del mundo'
        }
      </Text>

      <WelcomeForm inRegister={inRegister}/>

    </Container>
  );
};

export const WelcomeForm = ({ inRegister }) => {
  const { apiLogin, apiRegister } = useApi();
  const { setAuth } = useAuth();
  const { navBlog, navFrom } = useNav();
  
  const [ inLogin, setInLogin ] = useState(!inRegister);

  const [ usernameOrEmailInput, setUsernameOrEmailInput ] = useState('');
  const [ emailInput, setEmailInput ] = useState('');

  const changePage = () => {
    if (inLogin) {
      if (usernameOrEmailInput && usernameOrEmailInput.includes('@')) {
        setEmailInput(usernameOrEmailInput);
        setUsernameOrEmailInput('');
      }

    } else {
      if (!usernameOrEmailInput && emailInput) {
        setUsernameOrEmailInput(emailInput);
        setEmailInput('');
      }
    }

    setTimeout(() => {
      setInLogin(!inLogin);
    }, 0);
  }

  const onSuccess = (response) => {
    setAuth({ username: response, isAuthenticated: true });
    navFrom(navBlog);
  };

  const loginMutation = useMutation({
    mutationFn: ({ usernameOrEmail, password }) => apiLogin(usernameOrEmail, password),
    onSuccess: (response) => onSuccess(response)
  });

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }) => apiRegister(username, email, password),
    onSuccess: (response) => onSuccess(response)
  });

  const mutation = inLogin ? loginMutation : registerMutation;
  const error = mutation.error;
  const isLoading = mutation.isPending;

  return (
    <>
      <Form
        onSubmit={mutation.mutate} isSubmitting={isLoading}
        schema={inLogin ? null : registerSchema} confirmExit={false}
      >
        <FormField
          name={inLogin ? 'usernameOrEmail' : 'username'} 
          label={inLogin ? 'Nombre de usuario o email' : 'Nombre de usuario'} 
          value={usernameOrEmailInput} onValueChange={setUsernameOrEmailInput}
        />

        {!inLogin && (
          <FormField 
            name='email' variant='email'
            value={emailInput} onValueChange={setEmailInput}
          />
        )}
        
        <FormField name='password' variant='password' />

        {!inLogin && <FormField name='confirmPassword' variant='confirmPassword' />}

        <Button 
          type='submit' isLoading={isLoading}
          variant='submitForm' loadingText={inLogin ? 'Iniciando...' : 'Registrando...'}
        >
          {inLogin ? 'Iniciar Sesión': 'Registarme'}
        </Button>
        <Button 
          onClick={() => changePage()} isDisabled={isLoading}
          variant='secondForm'
        >
          {inLogin ? 'No tengo una cuenta' : 'Ya tengo una cuenta'}
        </Button>
        <Button
          onClick={navBlog} isDisabled={isLoading} 
          variant='secondForm'
        >
          {'Entrar como invitado'}
        </Button>
      </Form>
      
      {error && <Message error={error} />}
    </>
  )
};

export default Welcome;