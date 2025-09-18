import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useApi, useNav, useTitle, useToast } from '@/hooks';
import { Button, Container, Dropdown, Error, Image, Loading, Share, Text, UserCard, Comments } from '@/componentes';

import { timeSince, compactNumber, ratingStars } from '@/utils';

const Post = () => {
  const { setTitle, setDescription } = useTitle(null, 'Aquí se ve un post');
  const { fetchPost, deletePost, likePost } = useApi();
  const { navBlog, navPost, currentUrl } = useNav();
  const { ID } = useParams();
  const { toastError } = useToast();
  const queryClient = useQueryClient();

  const [onOpenComments, setOnOpenComments] = useState(false);
  const [onOpenShare, setOnOpenShare] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['post', ID],
    queryFn: () => fetchPost(ID),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (post) {
      setTitle(post.name);
      setDescription(post.review);
    }

    if (isError) {
      setTitle('Error');
      setDescription(error?.message || String(error || 'Error desconocido'));
    }
  }, [post, isError, error, setTitle, setDescription]);

  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(ID),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      navBlog();
    },
    onError: (error) => {
      toastError('Error al eliminar el post', error.message || String(error));
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => likePost(ID),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', ID]);
    },
    onError: (error) => {
      toastError('Error al dar like', error.message || String(error));
    },
  });

  const handleDeletePost = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      deletePostMutation.mutate();
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !post) return <Error>{error}</Error>;

  const isLiking = post?.isLiking || false;
  const likes = post?.likes || 0;

  const handleGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      post.name + ', ' + post.location
    )}`;
    window.open(url, '_blank');
  };

  const items = [
    { key: 'maps', children: 'Ver en maps', props: { onAction: handleGoogleMaps } },
    { key: 'share', children: 'Compartir', props: { onAction: onOpenShare } },
    { key: 'edit', children: 'Editar post', condition: post.editable, props: { onAction: () => navPost(ID, true) } },
    {
      key: 'delete',
      children: deletePostMutation.isPending ? 'Eliminando...' : 'Eliminar Post',
      condition: post.editable,
      props: { onAction: handleDeletePost, kind: 'danger', disabled: deletePostMutation.isPending, className: 'text-danger', color: 'danger' },
    },
  ];

  return (
    <Container kind="background" className="w-fit">
      <div className="grid grid-cols-[minmax(320px,1fr)_minmax(260px,320px)] gap-6 items-stretch">
        <Image src={post.imageUrl} alt={post.name} withWrapper withModal />

        <Container isDivided className="h-full flex flex-col justify-between" >
          <Container.Header className="flex flex-row items-center justify-between">
            <div className="items-start justify-between flex flex-col">
              <h4 className="font-bold text-2xl">{post.name}</h4>
              <p className="font-medium">{post.location}</p>
              <p className="text-sm text-yellow-300">{ratingStars(post.rating)}</p>
            </div>

            <Dropdown>
              <Dropdown.Trigger>
                <Button kind="icon" color="primary" variant="light">{'☰'}</Button>
              </Dropdown.Trigger>

              {items.map((item) =>
                item.condition === false ? null :
                  <Dropdown.Item key={item.key} {...item.props}>{item.children}</Dropdown.Item>
              )}
            </Dropdown>
          </Container.Header>

          <Container.Body className="h-full">
            <Text className="text-left">{post.review}</Text>
          </Container.Body>

          <Container.Footer className="flex flex-row justify-between items-center">
            <UserCard name={post.creator} description={`Hace ${timeSince(post.createdAt)}`} />
            <div className="flex items-center gap-2">
              <Button.Tooltip content={`${compactNumber(likes)} like${likes === 1 ? '' : 's'}`}>
                <Button variant="light" kind="icon" color="primary" onClick={() => likeMutation.mutate()} isLoading={likeMutation.isPending}>
                  {isLiking ? '♥️' : '🤍'}
                </Button>
              </Button.Tooltip>

              <Button color="primary" onClick={onOpenComments} variant="light" kind="icon">
                💬
              </Button>
            </div>
          </Container.Footer>
        </Container>
      </div>

      <Comments comments={post.comments} postID={ID} setOnOpen={setOnOpenComments} />
      <Share setOnOpen={setOnOpenShare} shareUrl={currentUrl} />
    </Container>
  );
};

export default Post;