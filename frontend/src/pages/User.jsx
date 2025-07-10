import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useApi, useNav, useTitle } from '@/hooks';
import { Button, Container, Text, Message } from '@/components/ui';
import ErrorPage from './ErrorPage';
import PostsList from '@/components/PostsList';

const User = () => {
  const { setTitle, setDescription } = useTitle(null, 'Aquí se ve un perfil');

  const [ inPosts, setInPosts ] = useState(true);
  const { fetchUser, followOrUnfollowUser } = useApi();
  const { navBack } = useNav();
  const { username } = useParams();
  const queryClient = useQueryClient();

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
    },
    onError: (error) => {
      console.error(error)
    }
  });

  const isSelf = !(user?.hasOwnProperty('isFollowing') === false);
  const isFollowing = user?.isFollowing || false;
  const postsLength = user?.posts?.length || 0;

  if (isLoading) return <Message loading />;
  if (isError) return <ErrorPage error={error.message || error} message={'cargar el perfil'}/>
  if (!user) return <ErrorPage error='Not found' />;

  const handleFollow = () => {
    followMutation.mutate();
  };

  return (
    <Container className='max-w-3xl'>
      <div className='flex flex-col items-center
        bg-[rgba(255,255,255,0.75)] shadow-[0_4px_20px_rgba(0,0,0,0.1)]
        border w-full gap-4 mb-5 p-3 rounded-md border-solid border-gray-300'
      >
        <Text variant='title'>{user.username}</Text>
        <Text variant='subtitle' className='!my-0'>
          <b>{'Seguidores: '}</b>{user.followers}
        </Text>
        <Text variant='subtitle' className='!my-0'>
          <b>{'Posts publicados: '}</b>{postsLength}
        </Text>

        <Container variant='button'>
          {isSelf && (
            <Button onClick={handleFollow} isLoading={followMutation.isPending} loadingText='Cargando...'>
              {isFollowing ? 'Siguiendo' : 'Seguir'}
            </Button>
          )}

          <Button onClick={() => setInPosts(!inPosts)}>{`Ver ${inPosts? 'likes' : 'posts'}`}</Button>
          <Button variant='share' />
        </Container>

        {followMutation.isError && (
          <Message error={`Error al seguir: ${followMutation.error.message}`} className='mt-2' />
        )}
      </div>

      <Text variant='title' className='mt-6'>{`${inPosts? 'Posts' : 'Likes'} del usuario`}</Text>
      {inPosts
        ? <PostsList posts={user.posts} />
        : <PostsList posts={user.likes} />
      }
    </Container>
  );
};

export default User;