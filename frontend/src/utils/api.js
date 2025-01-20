// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://735g4v95-5000.inc1.devtunnels.ms',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials:true,
});

export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
};

export default api;