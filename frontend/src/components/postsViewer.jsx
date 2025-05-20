import DestinationCard from "./DestinationCard";
import Message from "./tags/Message";

const PostsViewer = ({posts, loading, error}) => {
  return (
    <>
    {(loading || error) && <Message error={error} loading={loading} />}
    {!loading && !error && posts.length === 0 && <Message>{'No hay posts agregados.'}</Message>}
    {!loading && !error && (
      <div className="flex flex-wrap gap-8 justify-center">
        {posts.map((post) => (
          <DestinationCard
            key={post.ID}
            ID={post.ID}
            name={post.name}
            location={post.location}
            imageUrl={post.imageUrl}
            rating={post.rating}
          />
        ))}
      </div>
    )}
    </>
  )
}

export default PostsViewer;