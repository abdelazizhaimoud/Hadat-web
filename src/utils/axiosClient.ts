import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';

const BASE_URL = "http://localhost:8000/api"
const token = localStorage.getItem('auth-token')

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('Unauthorized access');
          break;
        case 403:
          console.log('Forbidden access');
          break;
        case 404:
          console.log('Resource not found');
          break;
        case 500:
          console.log('Server error');
          break;
        default:
          console.log('An error occurred');
      }
    } else if (error.request) {
      console.log('No response received from server');
    } else {
      console.log('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;