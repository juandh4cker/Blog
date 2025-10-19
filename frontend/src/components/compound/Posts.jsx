import { useState } from 'react';

import { useNav } from '@/hooks';
import { Container, Image, Loading, Text, Error } from '@/components';

const Posts = ({ posts, isLoading, error }) => {
  if (!posts?.length && !isLoading) {
    return <Text>{'Aquí no hay nada'}</Text>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error>{error}</Error>;
  }

  const multiPosts = Array(1).fill(posts).flat(); // Varios posts

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-5">
      {multiPosts.map((post) => (
        <PostCard post={post} key={post.ID} />
      ))}
    </div>
  );
};

const PostCard = ({ post }) => {
  const { navPost } = useNav();
  const [isLoaded, setLoaded] = useState(false);

  return (
    <Container
      disableBody
      isPressable
      onPress={() => navPost(post.ID)}
      className="group w-full col-span-12 sm:col-span-4 transition-transform duration-200 hover:scale-105 break-inside-avoid mb-4"
    >
      <Container.Header className="absolute z-10 text-white top-1 flex-col items-start justify-between group-hover:hidden">
        <h4 className="text-large font-bold drop-shadow-[0_0_2px_black]">{post.name}</h4>
        <p className="text-base font-bold drop-shadow-[0_0_2px_black]">{'Ciudad'}</p>
        <p className="text-sm drop-shadow-[0_0_2px_black]">{post.location}</p>
      </Container.Header>

      <Image
        width={250}
        height={isLoaded ? null : 300}
        alt={post.name}
        src={post.imageUrl}
        onLoad={() => setLoaded(true)}
        className="z-0 w-full h-full object-cover"
      />
      {/* `https://app.requestly.io/delay/5000/${post.imageUrl}` */}
    </Container>
  );
};

export default Posts;
