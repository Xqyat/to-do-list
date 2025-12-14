import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCategories = () =>
  axios.get(`${API_URL}/categories`, {
    headers: getAuthHeader(),
  });

export const createCategory = (name) =>
  axios.post(
    `${API_URL}/categories`,
    { name },
    { headers: getAuthHeader() },
  );
