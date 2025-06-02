import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('rol', response.data.rol);
  return response.data;
};

export const getToken = () => localStorage.getItem('token');
export const getRol = () => localStorage.getItem('rol');

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('rol');
};
