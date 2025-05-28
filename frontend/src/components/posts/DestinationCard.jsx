import { useState } from 'react';

import { useNav } from '../../hooks/useNav';

import Message from '../tags/Message';

const PostCard = ({ post }) => {
  const { navPost } = useNav();
  
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={() => navPost(post.ID)}
      className='flex flex-col items-center flex-grow flex-shrink basis-[calc(25%-1rem)] max-w-[27%] min-w-[150px] border border-[#ccc] rounded-[8px] overflow-hidden bg-white no-underline text-current p-2.5 my-2.5 shadow-md transition-transform duration-200 hover:-translate-y-1.5 hover:bg-gray-100'
    >
      {!imageLoaded && (
        <div className='w-full h-[200px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm'>
          <Message loading={true} />
        </div>
      )}
      <img
        src={post.imageUrl}
        alt={post.name}
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-[150px] object-contain block aspect-[4/3] bg-gray-50 p-1 ${imageLoaded ? 'block' : 'hidden'}`}
      />
      <h3 className='my-2.5 text-[1.2rem] text-center'>{post.name}</h3>
      <p className='my-1 text-base text-center'>
        <b>Ubicación:</b> {post.location}
      </p>
      <p className='my-1 text-base text-center'>
        <b>Calificación:</b> {post.rating}/10
      </p>
    </div>
  );
};

export default PostCard;