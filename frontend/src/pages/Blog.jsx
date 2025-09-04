import { useQuery } from '@tanstack/react-query';

import { useApi } from '@/hooks';
import { Container, Text } from '@/components/ui';

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
    <Container variant='background' className='max-w-4xl'>
      <Text variant='title'>{'Blog'}</Text>
      <Text variant='subtitle'>{'Ver todos los posts agregados'}</Text>

      <PostsList posts={posts} isLoading={isLoading} error={isError ? error : null}/>

    </Container>
  );
};

export default Blog;