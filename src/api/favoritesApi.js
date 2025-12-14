import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getFavorites = () =>
  axios.get(`${API_URL}/favorites`, {
    headers: getAuthHeader(),
  });

export const addFavorite = (productId) =>
  axios.post(
    `${API_URL}/favorites/${productId}`,
    {},
    { headers: getAuthHeader() },
  );

export const removeFavorite = (productId) =>
  axios.delete(`${API_URL}/favorites/${productId}`, {
    headers: getAuthHeader(),
  });
