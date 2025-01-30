const API_BASE_URL = 'http://localhost:5000/api';

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

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

export const fetchDestino = (id = null) => {
  if (id) {
    return apiRequest(`blogs/${id}`);
  } else {
    return apiRequest('blogs');
  }

};

export const fetchUsers = (id = null) => {
  if (id) {
    return apiRequest(`users/${id}`);
  } else {
    return apiRequest('users');
  }

};

export const loginTry = async (emailOrUsername, password) => {
  apiRequest('login', 'POST', { 'email_or_username': emailOrUsername, 'password': password });

}

export const getComments = async (id) => {
  try {
    const blog = await fetchDestino(id);
    return blog.comments || [];
    
  } catch (error) {
    console.error(`Error fetching comments: ${error.message}`);
    return [];
  }
};


export const addComment = (id, comment) => apiRequest(`blogs/${id}`, 'PUT', comment);
export const deleteComment = (id, commentId) => apiRequest(`blogs/${id}/comments/${commentId}`, 'DELETE');
export const deleteDestinoById = (id) => apiRequest(`blogs/${id}`, 'DELETE');

export const getLocalStorage = (item = null) => {
  if (item) {
    return JSON.parse(localStorage.getItem(item));
  }

  const allItems = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    allItems[key] = JSON.parse(localStorage.getItem(key));
  }
  return allItems;
};
export const setLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));