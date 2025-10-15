import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_HOSPITAL_API_URL || 'http://localhost:5000';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(normalizedError));
  }
);
