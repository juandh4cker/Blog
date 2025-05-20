import { apiRequest } from './index';

export const fetchPosts = () => apiRequest('posts');

export const getPost = (postID) => apiRequest(`post/${postID}`);

export const addPost = (postData) => apiRequest('post/create', 'POST', postData);

export const editPost = (postID, editedPost) => apiRequest(`post/${postID}/edit`, 'PUT', editedPost);

export const deletePost = (postID) => apiRequest(`post/${postID}/delete`, 'DELETE');