import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useNav, useTitle } from '../hooks';

import { fetchUser, followOrUnfollowUser } from '../api/users';

import ErrorPage from './ErrorPage';
import PostsList from '../components/PostsList';

import { Button, ButtonContainer, Container, Text, Message } from '../components/ui';

const User = () => {
  const { username } = useParams();
  const { navBack } = useNav();

  const [user, setUser] = useState(null);
  const [postsLength, setPostsLength] = useState(0);
  const [isSelf, setIsSelf] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { setTitle } = useTitle( null, 'Aquí se ve un perfil');

  const loadUser = async () => {
    fetchUser(username)
      .then((userData) => {
        setUser(userData);
        setPostsLength(userData.posts.length);
        setTitle(userData.username)

        if (userData.hasOwnProperty('isFollowing')) {
          setIsSelf(false)
          setIsFollowing(userData.isFollowing);

        } else {
          setIsSelf(true)
        }
      })
      .catch((error) => {
        if (error.message === 'Unauthorized') {
          setError('Unauthorized')

        } else if (error.message === 'Not found') {
          setError('Not found')

        } else {
          setError(`Error al cargar el perfil: ${error.message || error}`);
          setTitle('Error')
        }
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const handleFollow = () => {
    followOrUnfollowUser(username)
      .then(() => {
        loadUser();
      })
      .catch((error) => {
        setError(`Error al seguir: ${error.message || error}`);
      });
  };

  useEffect(() => {
    loadUser();
  }, [username]);


  if (loading) {
    return <Message loading={loading} />;
  }

  if (error === 'Unauthorized' || error === 'Not found') {
    return <ErrorPage type={error} />;
  }

  if (!user) {
    return <ErrorPage type='Not found' />;
  }

  return (
    <Container className='max-w-3xl'>
      <div className='flex flex-col items-center bg-[rgba(255,255,255,0.75)] shadow-[0_4px_20px_rgba(0,0,0,0.1)] border w-full gap-4 mb-5 p-3 rounded-[5px] border-solid border-[#ccc]'>
        <Text variant='title'>{user.username}</Text>
        <Text variant='subtitle' className='!my-0'>
          <b>Seguidores:</b> {user.followers}
        </Text>
        <Text variant='subtitle' className='!my-0'>
          <b>Posts publicados:</b> {postsLength}
        </Text>
        <ButtonContainer>
          {!isSelf && (
            <Button variant='small' onClick={handleFollow}>{isFollowing ? 'Siguiendo' : 'Seguir'}</Button>
          )}
          <Button variant='small' onClick={navBack}>{'Regresar'}</Button>
        </ButtonContainer>
      </div>
      {postsLength !== 0 && <Text variant='title'>{'Posts del usuario'}</Text>}
      <PostsList posts={user.posts} />
    </Container>
  );
};

export default User;