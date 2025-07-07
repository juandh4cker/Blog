import { useQuery } from '@tanstack/react-query';

import { useApi } from '@/hooks';
import { Container, Text, Message } from '@/components/ui';

import PostsList from '@/components/PostsList';

import {Button} from "@heroui/react";

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
      <Button color="primary" onClick={() => console.log('XD')}>XD</Button>;

      {(isLoading || isError)
        ? <Message loading={isLoading} error={error} />
        : <PostsList posts={posts} />
      }
    </Container>
  );
};

export default Blog;