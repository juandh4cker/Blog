import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useApi, useNav } from '@/hooks';
import {
  Button,
  Container,
  Divider,
  Error,
  Loading,
  Posts,
  Share,
  Tabs,
  Text,
  UserCard,
} from '@/components';

const User = () => {
  const { fetchUser, followOrUnfollowUser } = useApi();
  const { currentUrl, navDashboard } = useNav();
  const { username } = useParams();
  const [onOpenShare, setOnOpenShare] = useState();

  const { data: user, isLoading, isError, error } = fetchUser(username);
  const followOrUnfollow = followOrUnfollowUser();

  if (isLoading) return <Loading />;
  if (isError || !user) return <Error>{error}</Error>;

  const isSelf = user?.hasOwnProperty('isFollowing') === false;
  const isFollowing = user?.isFollowing || false;
  const postsLength = user?.posts?.length || 0;

  const tabItems = [
    {
      key: 'posts',
      title: 'Posts',
      data: user?.posts,
    },
    {
      key: 'likes',
      title: 'Likes',
      data: user?.likes,
    },
  ];

  return (
    <Container kind="background" className="max-w-3xl">
      <Container className="w-full">
        <Container.Body className="flex flex-row justify-around items-center h-38 p-6">
          <UserCard kind="bigAvatar" src={user.profilePicture} />

          <Divider vertical />

          <div className="flex flex-col items-center justify-around w-7/12 h-full">
            <div className="flex flex-col w-full justify-between items-center md:flex-row gap-2">
              <Text className="font-medium text-3xl">{user.username}</Text>
              <Button.Group>
                {isSelf ? (
                  <Button onClick={navDashboard}>{'Nuevo post'}</Button>
                ) : (
                  <Button
                    onClick={() => followOrUnfollow.mutate({ username })}
                    isLoading={followOrUnfollow.isPending}
                  >
                    {isFollowing ? 'Siguiendo' : 'Seguir'}
                  </Button>
                )}
                <Button onClick={onOpenShare}>{'Compartir'}</Button>
              </Button.Group>
            </div>

            <Text>
              {`${user.followers} seguidor${user.followers === 1 ? '' : 'es'} • ${postsLength} post${postsLength === 1 ? '' : 's'}`}
            </Text>
          </div>
        </Container.Body>
      </Container>

      <Tabs items={tabItems}>
        {(item) => (
          <Tabs.Tab key={item.key} title={item.title}>
            <Posts posts={item.data} />
          </Tabs.Tab>
        )}
      </Tabs>

      <Share shareUrl={currentUrl} setOnOpen={setOnOpenShare} />
    </Container>
  );
};

export default User;
