import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { deleteComment } from '../api/comments';

import Text from './tags/Text';
import Button from './tags/Button';

const Comment = ({ ID, index, comment, tiempoDesde, setError, loadData}) => {
  const navigate = useNavigate();

  const [expandedCommentIndex, setExpandedCommentIndex] = useState(null);
  
  const handleCommentUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
      await deleteComment(ID, commentId);
      loadData();

      } catch (error) {
      setError(`Error al eliminar el comentario: ${error.message || error}`);

      }
    }
  };

  return (
    <div
      key={index}
      className="bg-white border shadow-[0_2px_6px_rgba(0,0,0,0.05)] w-[90%] transition-transform duration-[0.2] ease-[ease] mb-4 p-4 rounded-lg border-solid border-[#ddd] hover:bg-[#e0e0e0] hover:scale-[1.02] cursor-pointer"
      onClick={() => setExpandedCommentIndex((prev) => (prev === index ? null : index))}
    >
      <Text>
        <b
          className="text-[1.1rem] text-[#2980B9] my-2 cursor-pointer underline"
          onClick={(e) => {
            e.stopPropagation();
            handleCommentUserClick(comment.creator);
            }
          }
        >
          {comment.creator}
        </b>: {comment.content}
      </Text>
      <Text>
        <b>Calificación:</b> {comment.rating}/10
      </Text>
      <Text variant="subtitle">
        Subido hace: {tiempoDesde(comment.createdAt)}
      </Text>
      {comment.editable && expandedCommentIndex === index && (
      <Button
        className="small"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteComment(comment.ID);
          }
        }
      >
        {"Borrar"}
      </Button>
      )}
    </div>
  )
};

export default Comment;