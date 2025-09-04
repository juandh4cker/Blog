import { useState } from 'react';
import { useNav } from '@/hooks';

import { Message, Loading, Button,Image, Container } from './ui';

const PostsList = ({ posts, isLoading, error }) => {
  if (!posts?.length) {
    return <Message>{'No hay posts agregados'}</Message>;
  }

  if (error) {
    return <Message error={error} />
  }

  if (isLoading) {
    return <Loading />;
  }

  const multiPosts = Array(1).fill(posts).flat();

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
  const [ isLoaded, setLoaded ] = useState(false);

  return (
      <Container disableBody className="group w-full col-span-12 sm:col-span-4 transition-transform duration-200
        hover:scale-105 break-inside-avoid mb-4">
        <Container.Header className="absolute z-10 top-1 flex-col items-start">
          <h4 onClick={() => navPost(post.ID)} className='text-white font-bold text-large drop-shadow-[0_0_2px_black] hover:cursor-pointer'>{post.name}</h4>
        </Container.Header>

        <Container isPressable disableBody onPress={() => navPost(post.ID)}>
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

        <Container.Footer className="absolute bg-black/40 bottom-0 z-10 border-t border-default-600 dark:border-default-100 hidden group-hover:flex flex-row justify-between items-center pt-1 pb-2 px-4">
          <div className="flex flex-col items-start hover:cursor-pointer">
            <p className="text-base text-white font-bold" onClick={() => alert('ciudad')}>Ciudad</p>
            <p className="text-sm text-white" onClick={() => alert('pais')}>{post.location}</p>
          </div>
          <Button onClick={() => navPost(post.ID)}>
            Ver
          </Button>      
        </Container.Footer>
      </Container>
  );
};

export default PostsList;