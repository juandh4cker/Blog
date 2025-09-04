import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useApi, useNav, useTitle, useToast } from '@/hooks';
import { Button, Container, Message, Text, UserCard, ImageModal, Image } from '@/components/ui';
import ShareModal from '@/components/ShareModal';
import Comments from '@/components/Comments';
import { timeSince, compactNumber, ratingStars } from '@/utils';

import ErrorPage from './ErrorPage';

const Post = () => {
  const { setTitle, setDescription } = useTitle(null, 'Aquí se ve un post');
  
  const { fetchPost, deletePost, likePost } = useApi();
  const { navBlog, navPost, currentUrl } = useNav();
  const { ID } = useParams();
  const { toastError } = useToast();
  const queryClient = useQueryClient();

  const [ onOpenComments, setOnOpenComments ] = useState();
  const [ onOpenShare, setOnOpenShare ] = useState();
  const [ onOpenImage, setOnOpenImage ] = useState();

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
      setDescription(error.message || error)
    }
  }, [post, setTitle]);

  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(ID),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      navBlog();
    },
    onError: (error) => {
      toastError("Error al eliminar el post", error.message);
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => likePost(ID),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', ID]);
    },
    onError: (error) => {
      toastError("Error al dar like", error.message);
    },
  });

  const handleDeletePost = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      deletePostMutation.mutate();
    }
  };

  const isLiking = post?.isLiking || false;
  const likes = post?.likes || 0;

  if (isLoading) return <Message loading />;
  if (isError) return <ErrorPage error={error.message || error} message={'cargar el post'}/>
  if (!post) return <ErrorPage error='Not found' />;

  const handleGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      post.name + ', ' + post.location
    )}`;
    window.open(url, '_blank');
  };

  const dropdownItems = [
    {onClick: handleGoogleMaps, key:"maps", text: 'Ver en maps'},
    {onClick: onOpenShare, key:"share", text: 'Compartir'},
    {onClick: () => navPost(ID, true), key:"edit", text: 'Editar post', condition: post.editable},
    {onClick: handleDeletePost, key:"delete", condition: post.editable, text: deletePostMutation.isPending ? 'Eliminando...' : 'Eliminar Post', props: {className: 'text-danger', color:'danger', disabled: deletePostMutation.isPending}}, 
  ]

  "Version 3 - Card Container h"

  return (
    <Container variant='background' className='max-w-4xl flex flex-row h-[90vh]'>
      <div className="w-2/3 h-full flex justify-center items-center col-span-12 sm:col-span-7" onClick={onOpenImage}>
        <Image
          removeWrapper
          alt={post.name}
          src={post.imageUrl}
          className="w-full h-full object-contain"
        />
      </div>

      <Container isDivided className='w-1/3 h-full flex flex-col items-center justify-between'>
        <Container.Header className='flex flex-row items-center justify-between'>
          <div className='items-start justify-between flex flex-col'>
            <h4 className="font-bold text-2xl">{post.name}</h4>
            <p className="font-medium">{post.location}</p>
            <p className="text-sm text-yellow-300">{ratingStars(post.rating)}</p>
          </div>
          <Button variant="dropdown"  
            backdrop='opaque'
            triggerProps={{isIconOnly:true, color:'primary', variant:'light'}}
            triggerContent={'☰'}
            items={dropdownItems}
          />
        </Container.Header>
        
        <Container.Body className='h-full'>
          <Text className="whitespace-pre-wrap break-words text-left overflow-y-auto">{post.review}</Text>
        </Container.Body>

        <Container.Footer className='flex flex-row justify-between items-center'>
          <UserCard user={post.creator} description={`Hace ${timeSince(post.createdAt)}`}/>
          <Button heroVariant='light' tooltip={`${compactNumber(likes)} like${likes === 1 ? '' : 's'}`} variant='icon' color='primary' onClick={() => likeMutation.mutate()} disabled={likeMutation.isPending}>
            {likeMutation.isPending ? '💙' : isLiking ? '♥️' : '🤍'} 
          </Button>
          <Button color='primary' onClick={onOpenComments} heroVariant='light' variant='icon'>
            💬
          </Button>
        </Container.Footer>
      </Container>

      <Comments comments={post.comments} postID={ID} setOnOpen={setOnOpenComments}/>
      <ShareModal setOnOpen={setOnOpenShare} shareUrl={currentUrl} />
      <ImageModal post={post} setOnOpen={setOnOpenImage}/>

    </Container>
  )
};

export default Post;