import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useNav, useTitle } from '@/hooks';
import { fetchUser, followOrUnfollowUser } from '@/api/users';
import { Button, ButtonsContainer, Container, Text, Message } from '@/components/ui';
import ErrorPage from './ErrorPage';
import PostsList from '@/components/PostsList';

const User = () => {
  const { username } = useParams();
  const { navBack } = useNav();
  const queryClient = useQueryClient();
  const { setTitle } = useTitle(null, 'Aquí se ve un perfil');

  const {
    data: user,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (user) {
      setTitle(user.username);
    }

    if (isError) {
      setTitle('Error');
      setDescription(error.message || error)
    }
  }, [user, setTitle]);

  const followMutation = useMutation({
    mutationFn: () => followOrUnfollowUser(username),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', username]);
    }
  });

  const isSelf = !(user?.hasOwnProperty('isFollowing') === false);
  const isFollowing = user?.isFollowing || false;
  const postsLength = user?.posts?.length || 0;

  if (isLoading) return <Message loading />;

  if (isError) {
    if (error.message === 'Unauthorized' || error.message === 'Not found') {
      return <ErrorPage type={error.message} />;
    }
    return <Message error={`Error al cargar el perfil: ${error.message || error}`} />;
  }

  if (!user) return <ErrorPage type='Not found' />;

  const handleFollow = () => {
    followMutation.mutate();
  };

  return (
    <Container className='max-w-3xl'>
      <div className='flex flex-col items-center bg-[rgba(255,255,255,0.75)] shadow-[0_4px_20px_rgba(0,0,0,0.1)] border w-full gap-4 mb-5 p-3 rounded-[5px] border-solid border-[#ccc]'>
        <Text variant='title'>{user.username}</Text>
        <Text variant='subtitle' className='!my-0'>
          <b>{'Seguidores: '}</b>{user.followers}
        </Text>
        <Text variant='subtitle' className='!my-0'>
          <b>{'Posts publicados: '}</b>{postsLength}
        </Text>

        <ButtonsContainer>
          {isSelf && (
            <Button variant='small' onClick={handleFollow}disabled={followMutation.isPending} >
              {followMutation.isPending ? 'Procesando...' : isFollowing ? 'Siguiendo' : 'Seguir'}
            </Button>
          )}

          <Button variant='small' onClick={navBack}>{'Regresar'}</Button>
        </ButtonsContainer>

        {followMutation.isError && (
          <Message error={`Error al seguir: ${followMutation.error.message}`} className='mt-2' />
        )}
      </div>

      {postsLength > 0 ? (
        <>
          <Text variant='title' className='mt-6'>{'Posts del usuario'}</Text>
          <PostsList posts={user.posts} />
        </>
      ) : (
        <Message className='mt-6'>{' '}</Message>
      )}
    </Container>
  );
};

export default User;