import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useApi, useNav } from '@/hooks';
import {
  Button,
  Container,
  Dropdown,
  Error,
  Image,
  Loading,
  Share,
  Text,
  UserCard,
  Comments,
} from '@/components';
import { timeSince, compactNumber, ratingStars, handleGoogleMaps } from '@/utils';

const Post = () => {
  const { fetchPost, deletePost, likePost } = useApi();
  const { navBlog, navPost, currentUrl } = useNav();
  const { ID } = useParams();

  const [onOpenComments, setOnOpenComments] = useState(false);
  const [onOpenShare, setOnOpenShare] = useState(false);

  const { data: post, isLoading, isError, error } = fetchPost(ID);
  const likePostMutation = likePost();
  const deletePostMutation = deletePost({
    onSuccess: () => navBlog(),
  });

  const handleDeletePost = (ID) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      deletePostMutation.mutate({ ID });
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !post) return <Error>{error}</Error>;

  const isLiking = post?.isLiking || false;
  const likes = post?.likes || 0;

  const postOptions = [
    {
      key: 'maps',
      children: 'Ver en maps',
      props: {
        onAction: () => handleGoogleMaps(post.name, post.location),
      },
    },
    {
      key: 'share',
      children: 'Compartir',
      props: {
        onAction: onOpenShare,
      },
    },
    {
      key: 'edit',
      children: 'Editar post',
      condition: post.editable,
      props: {
        onAction: () => navPost(ID, true),
      },
    },
    {
      key: 'delete',
      children: deletePostMutation.isPending ? 'Eliminando...' : 'Eliminar Post',
      condition: post.editable,
      props: {
        onAction: () => handleDeletePost(ID),
        disabled: deletePostMutation.isPending,
        className: 'text-danger',
        color: 'danger',
      },
    },
  ];

  return (
    <Container kind="background" className="w-fit p-2">
      <Container.Body className="grid grid-cols-[minmax(320px,1fr)_minmax(260px,320px)] gap-6 items-stretch">
        <Image src={post.imageUrl} alt={post.name} withWrapper withModal />

        <Container isDivided className="h-full flex flex-col justify-between">
          <Container.Header className="flex flex-row items-center justify-between">
            <div className="items-start justify-between flex flex-col">
              <h4 className="font-bold text-2xl">{post.name}</h4>
              <p className="font-medium">{post.location}</p>
              <p className="text-sm text-yellow-300">{ratingStars(post.rating)}</p>
            </div>

            <Dropdown items={postOptions}>
              <Button kind="icon">{'☰'}</Button>
            </Dropdown>
          </Container.Header>

          <Container.Body className="h-full">
            <Text className="text-left">{post.review}</Text>
          </Container.Body>

          <Container.Footer className="flex flex-row justify-between items-center">
            <UserCard name={post.creator} description={`Hace ${timeSince(post.createdAt)}`} />
            <div className="flex items-center gap-2">
              <Button.Tooltip
                content={`${compactNumber(likes)} like${likes === 1 ? '' : 's'}`}
                color="danger"
              >
                <Button
                  kind="icon"
                  onClick={() => likePostMutation.mutate({ ID })}
                  isLoading={likePostMutation.isPending}
                >
                  {isLiking ? '♥️' : '🤍'}
                </Button>
              </Button.Tooltip>

              <Button kind="icon" onClick={onOpenComments}>
                💬
              </Button>
            </div>
          </Container.Footer>
        </Container>
      </Container.Body>

      <Comments postID={ID} comments={post.comments} setOnOpen={setOnOpenComments} />
      <Share shareUrl={currentUrl} setOnOpen={setOnOpenShare} />
    </Container>
  );
};

export default Post;
