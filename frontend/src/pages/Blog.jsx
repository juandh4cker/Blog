import { useApi } from '@/hooks';
import { Container, Text, Posts } from '@/components';

const Blog = () => {
  const { fetchPosts } = useApi();
  const { data: posts, isLoading, isError, error } = fetchPosts();

  return (
    <Container kind="background" className="max-w-4xl">
      <Text kind="title">{'Blog'}</Text>
      <Text>{'Ver todos los posts agregados'}</Text>

      <Posts posts={posts} isLoading={isLoading} error={isError ? error : null} />
    </Container>
  );
};

export default Blog;
