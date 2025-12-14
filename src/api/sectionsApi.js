import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPublicSections = () =>
  axios.get(`${API_URL}/sections/public`);

export const getSections = () =>
  axios.get(`${API_URL}/sections`, {
    headers: getAuthHeader(),
  });

export const getSection = (id) =>
  axios.get(`${API_URL}/sections/${id}`, {
    headers: getAuthHeader(),
  });

export const createSection = (formData) =>
  axios.post(`${API_URL}/sections`, formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
  });

export const updateSection = (id, formData) =>
  axios.put(`${API_URL}/sections/${id}`, formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
  });

export const deleteSection = (id) =>
  axios.delete(`${API_URL}/sections/${id}`, {
    headers: getAuthHeader(),
  });

export const updateSectionsOrder = (orderArray) =>
  axios.put(
    `${API_URL}/sections/order`,
    { order: orderArray },
    { headers: getAuthHeader() }
  );
