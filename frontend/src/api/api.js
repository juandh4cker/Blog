import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Accept-Language': 'es',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

export const apiRequest = async (endpoint, method = 'get', body = null) => {
  //console.log('API Request →', { url: `${api.defaults.baseURL}/${endpoint}`, method: method.toUpperCase(), data: body, });

  try {
    const response = await api.request({
      url: endpoint,
      method,
      data: body,
    });

    return response.data.data !== undefined ? response.data.data : response.data;
  } catch (error) {
    if (error.response) {
      //console.error('API Response Error ←', { status: error.response.status, data: error.response.data, });

      throw {
        message: error.response.data.error || error.response.statusText,
        status: error.response.status,
        data: error.response.data,
      };
    }

    throw error;
  }
};
