import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useApi, useNav, useTitle, useToast } from '@/hooks';
import { Button, Container, Message, Tab, Avatar, Divider } from '@/components/ui';
import ErrorPage from './ErrorPage';

import PostsList from '@/components/PostsList';
import ShareModal from '@/components/ShareModal';

const User = () => {
  const { fetchUser, followOrUnfollowUser } = useApi();
  const { toastError } = useToast();
  const { username } = useParams();
  const { currentUrl } = useNav();

  const [ onOpenShare, setOnOpenShare ] = useState();

  const queryClient = useQueryClient();
  
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { setTitle } = useTitle(
    user?.username,
    'Perfil de usuario en WorldBlog',
    { enableRouteDefaults: false }
  );

  const followMutation = useMutation({
    mutationFn: () => followOrUnfollowUser(username),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', username]);
    },
    onError: (error) => {
      toastError("Error al seguir", error.message);
    },
  });

  const isSelf = user?.hasOwnProperty('isFollowing') === false;
  const isFollowing = user?.isFollowing || false;
  const postsLength = user?.posts?.length || 0;

  if (isLoading) return <Message loading />;
  if (isError || !user) return <ErrorPage />;

  const tabs = [
    {
      key: 'Posts',
      data: user?.posts,
    },
    {
      key: 'Likes',
      data: user?.likes,
    },
  ];

  return (
    <Container variant='background' className='max-w-3xl'>
      <Container className='w-full'>
        <Container.Body className='flex flex-row justify-around items-center h-38 p-6'>
          <Avatar
            isBordered 
            showFallback 
            src="https://www.svgrepo.com/show/452030/avatar-default.svg"
            name={user.username}
            className='w-26 h-26 text-large'
          />

          <Divider orientation="vertical" />

          <div className='flex flex-col items-center justify-around w-7/12 h-full'>
            <div className='flex flex-col w-full justify-between items-center md:flex-row gap-2'>
              <h2 className='font-medium text-3xl'>{user.username}</h2>
              <Container variant='button'>
                {!isSelf && (
                  <Button onClick={() => followMutation.mutate()} isLoading={followMutation.isPending}>
                    {isFollowing ? 'Siguiendo' : 'Seguir'}
                  </Button>
                )}
                <Button onClick={onOpenShare}>{'Compartir'}</Button>
              </Container>
            </div>

            <p className='w-full text-center'>
              {`${user.followers} seguidor${user.followers === 1 ? '' : 'es'} • ${postsLength} post${postsLength === 1 ? '' : 's'}`}
            </p>
          </div>
        </Container.Body>
      </Container>
      
      <Tab 
        items={tabs} 
        render={(item) => <PostsList posts={item.data} />} 
      />

      <ShareModal setOnOpen={setOnOpenShare} shareUrl={currentUrl} />
    </Container>
  );
};

export default User;