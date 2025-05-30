import { useEffect, useState } from 'react';

import { useTitle } from '../hooks';

import { fetchPosts } from '../api/posts';

import PostsList from '../components/posts/postsViewer';

import { Container, Text, Message } from '../components/tags';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useTitle('', 'Aquí se ven todos los posts.');

  useEffect(() => {
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

    getPosts();
  }, []);

  return (
    <>
      <Container className='max-w-3xl'>
        <Text variant='title'>{'Blog'}</Text>
        <Text variant='subtitle'>{'Ver todos los posts agregados'}</Text>
        {(loading || error) && <Message error={error} loading={loading} />}
        {!loading && !error && <PostsList posts={posts} />}
      </Container>
    </>
  );  
};

export default Blog;