import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useTitle from '../hooks/useTitle';

import { getUser, followOrUnfollowUser } from '../api/users';

import ErrorPage from './ErrorPage';
import PostsViewer from '../components/postsViewer';

import Button from '../components/tags/Button';
import Container from '../components/tags/Container';
import Text from '../components/tags/Text';
import Message from '../components/tags/Message';

const Perfil = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [postsLength, setPostsLength] = useState(0);
  const [isSelf, setIsSelf] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { setTitle, setDescription } = useTitle(
    null,
    "Aquí se ve un perfil"
  );

  const fetchUser = async () => {
    try {
      const userData = await getUser(username);
      setUser(userData);
      setPostsLength(userData.posts.length);
      setTitle(userData.username)

      if (userData.hasOwnProperty("isFollowing")) {
        setIsSelf(false)
        setIsFollowing(userData.isFollowing);

      } else {
        setIsSelf(true)

      }

    } catch (error) {
      if (error.message === "Unauthorized") {
        setError("Unauthorized")
        
      } else if (error.message === "Not found") {
        setError("Not found")
        
      } else {
        setError(`Error al cargar el perfil: ${error.message || error}`);
        setTitle('Error')

      }
    } finally {
      setLoading(false);

    }
  };
  
  const handleFollowToggle = async () => {
    try {
      await followOrUnfollowUser(username)
      await fetchUser()

    } catch (error) {
      setError(`Error al seguir: ${error.message || error}`);

    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUser();
    
  }, [username]);


  if (loading) {
    return <Message loading={loading} />;
  }

  if (error === "Unauthorized" || error === "Not found") {
    return <ErrorPage type={error} />;
  }

  if (!user) {
    return <ErrorPage type="Not found" />;
  }

  return (
    <>
      <Container className="max-w-3xl">
        <div className="flex flex-col items-center bg-[rgba(255,255,255,0.75)] shadow-[0_4px_20px_rgba(0,0,0,0.1)] border w-full gap-4 mb-5 p-3 rounded-[5px] border-solid border-[#ccc]">
          <Text variant='title'>{user.username}</Text>
          <Text variant='subtitle' className='!my-0'>
            <b>Seguidores:</b> {user.followers}
          </Text>
          <Text variant='subtitle' className='!my-0'>
            <b>Posts publicados:</b> {postsLength}
          </Text>
          <div className='flex justify-between gap-4 items-center'>
            {!isSelf && (
              <Button 
                variant='small' 
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Siguiendo' : 'Seguir'}
              </Button>
            )}
            <Button 
              variant='small'
              onClick={() => navigate(-1)}
            >
              {"Regresar"}
            </Button>
          </div>
        </div>
        {postsLength !== 0 && <Text variant='title'>{"Posts del usuario"}</Text>}
        <PostsViewer
          posts={user.posts}
          loading={loading}
          error={error}
        />
      </Container>
    </>
  );
};

export default Perfil;