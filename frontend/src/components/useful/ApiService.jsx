import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

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

export const updateDestinoComments = (id, comments) => apiRequest(`blogs/${id}`, 'PUT', { comments });
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

