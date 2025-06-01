import { useState } from 'react';

import { useNav } from '../hooks';

import { deleteComment }  from '../api';

import { tiempoDesde } from '../utils/tiempoDesde';

import { Button, Text, Message } from './ui';

const CommentsList = ({ postID, comments, loadData, setError }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  if (!comments?.length) {
    return <Message className='my-2'>{'No hay comentarios agregados'}</Message>;
  }

  return (
    <div className='my-2 flex flex-wrap gap-1 justify-center'>
      {comments.map((comment, index) => (
        <Comment 
          key={comment.ID}
          index={index}
          postID={postID}
          comment={comment}
          loadData={loadData}
          expanded={expandedIndex === index}
          toggleExpand={() => setExpandedIndex((prev) => (prev === index ? null : index))}
          setError={setError} 
        />
      ))}
    </div>
  );
};

const Comment = ({ index, postID, comment, loadData, expanded, toggleExpand, setError }) => {
  const { navUser } = useNav();

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      deleteComment(postID, comment.ID)
        .then(() => {
          loadData();
        })
        .catch((error) => {
          setError(`Error al eliminar el comentario: ${error.message || error}`);
        });
    };
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    navUser(comment.creator);
  };

  return (
    <div
      key={index} onClick={toggleExpand}
      className="
        w-[90%] p-4 mb-4 rounded-lg cursor-pointer
        bg-white border border-solid border-[#ddd]
        shadow-[0_2px_6px_rgba(0,0,0,0.05)]
        transition-transform duration-200 ease-in-out
        hover:bg-gray-200 hover:scale-105"
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
        <>
          {comment.editable && (
            <Button variant='small' onClick={handleDelete}>{'Borrar'}</Button>
          )}
          <Text variant='subtitle'>{`Subido hace: ${tiempoDesde(comment.createdAt)}`}</Text>
        </>
      )}
    </div>
  );
};

export default CommentsList;