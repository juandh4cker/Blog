import { apiRequest } from './api';

export const fetchPosts = () => {
  return apiRequest('posts');
};

export const fetchPost = (postID) => {
  return apiRequest(`post/${postID}`);
};

export const addPost = (postData) => {
  return apiRequest('post/create', 'POST', postData);
};

export const editPost = (postID, postData) => {
  return apiRequest(`post/${postID}/edit`, 'PUT', postData);
};

export const deletePost = (postID) => {
  return apiRequest(`post/${postID}/delete`, 'DELETE');
};

export const likePost = (postID) => {
  return apiRequest(`post/${postID}/likent`, 'PUT');
};
