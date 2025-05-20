import { apiRequest } from './index';

export const addComment = (postID, comment) => apiRequest(`post/${postID}/comment`, 'PUT', comment);

export const deleteComment = (postID, commentID) => apiRequest(`post/${postID}/comment/${commentID}/delete`, 'DELETE');