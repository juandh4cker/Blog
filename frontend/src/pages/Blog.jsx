import { useEffect, useState } from 'react';

import { useTitle } from '../hooks/useTitle';

import { fetchPosts } from '../api/posts';

import PostsList from '../components/posts/postsViewer';

import Container from '../components/tags/Container';
import Text from '../components/tags/Text';

const Blog = () => {
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useTitle(
    "",
    "Aquí se ven todos los posts."
  );

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      
      try {
        const response = await fetchPosts();
        setError('');
        setPosts(response);

      } catch (error) {
        setError(`Error al cargar los posts: ${error.message || error}`);

      } finally {
        setLoading(false);

      }
    };

    getPosts();
  }, []);

  return (
    <>
      <Container className="max-w-3xl">
        <Text variant='title'>Blog</Text>
        <Text variant='subtitle'>Ver todos los posts agregados</Text>
        <PostsList
          posts={posts}
          loading={loading}
          error={error}
        />
      </Container>
    </>
  );  
};

export default Blog;