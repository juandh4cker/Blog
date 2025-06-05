import { useQuery } from '@tanstack/react-query';

import { useTitle } from '../hooks';
import { fetchPosts } from '../api';
import { Container, Text, Message } from '../components/ui';
import PostsList from '../components/PostsList';

const Blog = () => {
  useTitle('', 'Aquí se ven todos los posts.');

  const {
    data: posts = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 60000,
  });

  return (
    <Container className='max-w-3xl'>
      <Text variant='title'>{'Blog'}</Text>
      <Text variant='subtitle'>{'Ver todos los posts agregados'}</Text>

      {(isLoading || isError) ? (
        <Message error={error} loading={isLoading} />
      ) : (
        <PostsList posts={posts} />
      )}
    </Container>
  );
};

export default Blog;