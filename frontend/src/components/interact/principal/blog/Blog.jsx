import { useEffect, useState } from 'react';

import { getPosts, setTitle } from '../../../useful/ApiService';


import Container from '../../../elements/Container';
import Text from '../../../elements/Text';
import PostsViewer from '../../../useful/postsViewer';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      try {
        const response = await getPosts();
        setError('');
        setPosts(response);

      } catch (error) {
        setError(`Error al cargar los posts: ${error.message || error}`);

      } finally {
        setLoading(false);

      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      {setTitle("", "Aquí se ven todos los posts.")}
      <Container className="max-w-3xl">
        <Text variant='title'>Posts agregados</Text>
        <Text variant='subtitle'>Ver todos los posts</Text>
        <PostsViewer
          posts={posts}
          loading={loading}
          error={error}
        />
      </Container>
    </>
  );  
};

export default Blog;