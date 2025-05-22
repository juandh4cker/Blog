import PostCard from './DestinationCard';

import Message from '../tags/Message';

const PostsList = ({ posts }) => {
  return (
    <>
      {posts.length === 0 ? <Message>{'No hay posts agregados.'}</Message> : (
        <div className='flex flex-wrap gap-8 justify-center'>
          {posts.map((post) => (
            <PostCard key={post.ID} post={post}/>
          ))}
        </div>
      )}
    </>
  );
};

export default PostsList;