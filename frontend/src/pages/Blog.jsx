import { useEffect, useState } from 'react';

import { useTitle } from '../hooks';

import { fetchPosts } from '../api';

import { Container, Text, Message } from '../components/ui';

import PostsList from '../components/PostsList';

const Blog = () => {
  useTitle('', 'Aquí se ven todos los posts.');

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getPosts = async () => {
    setLoading(true);

    fetchPosts()
      .then((response) => {
        setError('');
        setPosts(response);
      })
      .catch((error) => {
        setError(`Error al cargar los posts: ${error.message || error}`);
      })
      .finally(() => {
        setLoading(false);
      })
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Container className='max-w-3xl'>
      <Text variant='title'>{'Blog'}</Text>
      <Text variant='subtitle'>{'Ver todos los posts agregados'}</Text>
      {(loading || error) && <Message error={error} loading={loading} />}
      {!(loading || error) && <PostsList posts={posts} />}
    </Container>
  );
};

export default Blog;