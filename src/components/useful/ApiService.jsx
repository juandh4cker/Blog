const API_BASE_URL = 'https://67253fdfc39fedae05b45582.mockapi.io/api/v1';

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

export const fetchDestinoById = (id) => apiRequest(`blogs/${id}`);
export const fetchUsers = () => apiRequest('users');
export const updateDestinoComments = (id, comments) =>
  apiRequest(`blogs/${id}`, 'PUT', { comments });
export const deleteDestinoById = (id) => apiRequest(`blogs/${id}`, 'DELETE');
