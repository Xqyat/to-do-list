import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTasks = () => 
  axios.get(`${API_URL}/tasks`, { headers: getAuthHeader() });

export const getTask = (id) => 
  axios.get(`${API_URL}/tasks/${id}`, { headers: getAuthHeader() });

export const createTask = (formData) => 
  axios.post(`${API_URL}/tasks`, formData, { headers: getAuthHeader() });

export const updateTask = (id, formData) => 
  axios.put(`${API_URL}/tasks/${id}`, formData, { headers: getAuthHeader() });

export const deleteTask = (id) => 
  axios.delete(`${API_URL}/tasks/${id}`, { headers: getAuthHeader() });
