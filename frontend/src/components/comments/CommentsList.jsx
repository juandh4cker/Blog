import { useState } from "react";

import Comment from "./Comment"

const CommentsList = ({ comments, postID, setError, loadData }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  return (
    <>
      {comments.map((comment, index) => (
        <Comment 
          key={comment.ID} 
          index={index}
          comment={comment}
          postID={postID} 
          loadData={loadData}
          expanded={expandedIndex === index}
          setExpanded={() => setExpandedIndex((prev) => (prev === index ? null : index))}
          setError={setError} 
        />
      ))}
    </>
  )
}

export default CommentsList;