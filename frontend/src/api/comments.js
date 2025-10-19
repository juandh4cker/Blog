import { apiRequest } from './api';

export const addComment = (postID, comment) => {
  return apiRequest(`post/${postID}/comment`, 'PUT', comment);
};

export const deleteComment = (postID, commentID) => {
  return apiRequest(`post/${postID}/comment/${commentID}/delete`, 'DELETE');
};
