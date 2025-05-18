const API_BASE_URL = 'http://localhost:5000/api';

// API
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Accept-Language': 'es',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const route = `${API_BASE_URL}/${endpoint}`
    const response = await fetch(route, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error: ${response.statusText}`);
    }

    if (data.data !== undefined) {
      return data.data;
    }
    

    if (data.error !== undefined) {
      throw new Error(data.error);
    }

    return data;

  } catch (error) {
      throw error;
  }
};

//Token
export const verifyToken = async () => apiRequest('app/verify');

//Access
export const loginTry = async (emailOrUsername, password) => {
  return apiRequest('app/login', 'POST', { 'username_or_email': emailOrUsername, 'password': password });
}
export const registerTry = async (username, email, password) => {
  return apiRequest('app/register', 'POST', { 'username': username, 'email': email, 'password': password });
}

//Users
export const getUser = async (username) => apiRequest(`user/${username}`);
export const followntUser = async (username) => apiRequest(`user/${username}/follownt`, 'PUT');

//Posts
export const getPosts = async () => apiRequest('posts');
export const getPost = async (postID) => apiRequest(`post/${postID}`);
export const addPost = async (postData) => apiRequest('post/create', 'POST', postData);
export const editPost = async (postID, editedPost) => apiRequest(`post/${postID}/edit`, 'PUT', editedPost);
export const deletePost = async (postID) => apiRequest(`post/${postID}/delete`, 'DELETE');

//Comments
export const addComment = (postID, comment) => apiRequest(`post/${postID}/comment`, 'PUT', comment);
export const deleteComment = (postID, commentID) => apiRequest(`post/${postID}/comment/${commentID}/delete`, 'DELETE');

//LocalStorage
export const getLocalStorage = (item = 'username') => {
  const value = localStorage.getItem(item);
  return value ? JSON.parse(value) : null;
};
export const setLocalStorage = (value, key = 'username') => localStorage.setItem(key, JSON.stringify(value));

import { Helmet } from 'react-helmet';
export const setTitle = (title="WorldBlog", content="Esto es WorldBlog, un blog de destinos turísticos", name="description") => {
  let newTitle = "WorldBlog"
  if (title !== "") {
    newTitle = `${title} - WorldBlog`;
  }
  return (
    <Helmet>
      <title>{newTitle}</title>
      <meta name={name} content={content} />
    </Helmet>
  )
}
// no se usa
export const handleInputChange = (e, set) => {
  const { name, value } = e.target;
  set((prev) => ({
    ...prev,
    [name]: value
  }));
};