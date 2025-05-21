import { useNavigate } from 'react-router-dom';

import  { deleteComment }  from '../../api/comments';

import  { tiempoDesde } from '../../utils/tiempoDesde';

import Button from '../tags/Button';
import Text from '../tags/Text';

const Comment = ({ index, comment, postID, loadData , expanded, setExpanded, setError }) => {
  const navigate = useNavigate();
  
  const handleCommentUserClick = (user) => {
    navigate(`/user/${user}`);
    
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      try {
        await deleteComment(postID, commentId);
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
      onClick={setExpanded}
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
      {expanded && (
        <>
          {comment.editable && (
            <Button
              variant="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteComment(comment.ID);
              }}
            >
              {"Borrar"}
            </Button>
          )}
          <Text variant="subtitle">
            Subido hace: {tiempoDesde(comment.createdAt)}
          </Text>
        </>
      )}

    </div>
  )
};

export default Comment;