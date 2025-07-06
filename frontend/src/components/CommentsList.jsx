import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi, useNav } from '@/hooks';
import { timeSince } from '@/utils/timeSince';
import { Button, Text, Message } from './ui';

const CommentsList = ({ postID, comments }) => {
  const queryClient = useQueryClient();
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!comments?.length) {
    return <Message className='my-2'>{'No hay comentarios agregados'}</Message>;
  }

  return (
    <div className='w-full my-2 flex flex-wrap gap-1 justify-center'>
      {comments.map((comment, index) => (
        <Comment
          key={comment.ID}
          index={index}
          postID={postID}
          comment={comment}
          expanded={expandedIndex === index}
          toggleExpand={() => setExpandedIndex((prev) => (prev === index ? null : index))}
          queryClient={queryClient}
        />
      ))}
    </div>
  );
};

const Comment = ({ postID, comment, expanded, toggleExpand, queryClient }) => {
  const { navUser } = useNav();
  const { deleteComment } = useApi();

  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(postID, comment.ID),
    onSuccess: () => {
      queryClient.setQueryData(['post', postID], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          comments: oldData.comments.filter(c => c.ID !== comment.ID)
        };
      });
    }
  });

  const handleDelete = (e) => {
    e.stopPropagation();

    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      deleteMutation.mutate();
    }
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    navUser(comment.creator);
  };

  return (
    <div
      onClick={toggleExpand}
      className='
        w-11/12 p-4 mb-4 rounded-lg cursor-pointer
        bg-white border border-solid border-gray-300
        shadow-[0_2px_6px_rgba(0,0,0,0.05)]
        transition-transform duration-200 ease-in-out
        hover:bg-gray-200 hover:scale-105'
    >
      <Text>
        <Text variant='hipertext' tag='b' onClick={handleNavigate}>{comment.creator}</Text>
        {`: ${comment.content}`}
      </Text>
      <Text>
        <b>{'Calificación: '}</b>
        {`${comment.rating}/10`}
      </Text>

      {expanded && (
        <div className='mt-3'>
          {comment.editable && (
            <Button variant='small' onClick={handleDelete}disabled={deleteMutation.isPending} >
              {deleteMutation.isPending ? 'Eliminando...' : 'Borrar'}
            </Button>
          )}
          <Text variant='subtitle' className='mt-2'>
            {`Subido hace: ${timeSince(comment.createdAt)}`}
          </Text>
        </div>
      )}

      {deleteMutation.isError && (
        <Message error={`Error al eliminar el comentario: ${deleteMutation.error.message}`} className='mt-2' />
      )}
    </div>
  );
};

export default CommentsList;