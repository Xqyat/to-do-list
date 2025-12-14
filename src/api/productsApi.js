import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProducts = (categoryId) => {
  const params = categoryId ? { categoryId } : {};
  return axios.get(`${API_URL}/products`, {
    params,
    headers: getAuthHeader(),
  });
};

export const getProduct = (id) =>
  axios.get(`${API_URL}/products/${id}`, {
    headers: getAuthHeader(),
  });

export const createProduct = (formData) =>
  axios.post(`${API_URL}/products`, formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (id, formData) =>
  axios.put(`${API_URL}/products/${id}`, formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (id) =>
  axios.delete(`${API_URL}/products/${id}`, {
    headers: getAuthHeader(),
  });
