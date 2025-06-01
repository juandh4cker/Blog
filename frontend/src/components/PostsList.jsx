import { useState } from 'react';

import { useNav } from '../hooks';

import { Message, Text } from './ui';

const PostsList = ({ posts }) => {
  if (!posts?.length) {
    return <Message>{'No hay posts agregados'}</Message>;
  }

  return (
    <div className='mt-4 flex flex-wrap gap-8 justify-center'>
      {posts.map((post) => (
        <PostCard key={post.ID} post={post}/>
      ))}
    </div>
  );
};

const PostCard = ({ post }) => {
  const { navPost } = useNav();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={() => navPost(post.ID)}
      className='
        mt-2 flex flex-col items-center
        flex-grow flex-shrink basis-1/4 max-w-1/4 min-w-[200px]
        p-2.5 border border-gray-300 rounded-lg shadow-md
        bg-white text-current no-underline overflow-hidden
        transition-transform duration-200
        hover:-translate-y-1.5 hover:bg-gray-100'
    >
      {!imageLoaded && (
        <div className='w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm'>
          <Message loading={true} />
        </div>
      )}
      <img
        src={post.imageUrl} alt={post.name} onLoad={() => setImageLoaded(true)}
        className={`w-full h-45 object-contain bg-gray-50 p-2 ${imageLoaded ? 'block' : 'hidden'}`}
      />
      <Text className='text-2xl font-bold'>{post.name}</Text>
      <Text className='!my-1 !text-sm'>
        <b>{'Ubicación: '}</b>{post.location}
      </Text>
      <Text className='!my-1 !text-sm'>
        <b>{'Calificación: '}</b>{post.rating}{'/10'}
      </Text>
    </div>
  );
};

export default PostsList;