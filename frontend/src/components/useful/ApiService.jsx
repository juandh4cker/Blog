const API_BASE_URL = 'http://localhost:5000/api';

//API
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Accept-Language': 'es',
      'Content-Type': 'application/json',
    },
  };
  
  const token = getLocalStorage('token');
  if (token) {
    options.headers['Authorization'] = token;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API error: ${error.message}`);
    throw error;
  }
};

//Token
export const verifyToken = async () => {
  try {
    const isAuthenticated = await apiRequest('user/verify');
    return isAuthenticated;
  } catch (error) {
    console.error(`Error verifying token: ${error.message}`);
    return false;
  }
}

//Access
export const loginTry = async (emailOrUsername, password) => {
  return apiRequest('user/login', 'POST', { 'email_or_username': emailOrUsername, 'password': password });
}

export const registerTry = async (username, email, password) => {
  return apiRequest('user/register', 'POST', { 'username': username, 'email': email, 'password': password });
}

//Users
export const fetchUsers = (id = null) => {
  if (id) {
    return apiRequest(`users/${id}`);
  } else {
    return apiRequest('users');
  }

};

//Blogs
export const fetchDestino = (id = null) => {
  if (id) {
    return apiRequest(`blogs/${id}`);
  } else {
    return apiRequest('blogs');
  }

};
//export const addDestino = (destino) => apiRequest('blogs', 'POST', destino);
export const deleteDestinoById = (id) => apiRequest(`blogs/${id}`, 'DELETE');

//Comments
export const getComments = async (id) => {
  try {
    const blog = await fetchDestino(id);
    return blog.comments || [];
    
  } catch (error) {
    console.error(`Error fetching comments: ${error.message}`);
    return [];s
  }
};
export const addComment = (id, comment) => apiRequest(`blogs/${id}`, 'PUT', comment);
export const deleteComment = (id, commentId) => apiRequest(`blogs/${id}/comments/${commentId}`, 'DELETE');

//LocalStorage
export const getLocalStorage = (item = null) => {
  if (item) {
    const value = localStorage.getItem(item);
    return value ? JSON.parse(value) : null;
  }

  const allItems = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    allItems[key] = JSON.parse(localStorage.getItem(key));
  }
  return allItems;
};
export const setLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));