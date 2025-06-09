import { useQuery } from '@tanstack/react-query';

import { useApi } from '@/hooks';
import { Container, Text, Message } from '@/components/ui';
import PostsList from '@/components/PostsList';

const Blog = () => {
  const { fetchPosts } = useApi();

  const {
    data: posts = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
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