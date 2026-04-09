import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';

const BASE_URL = "http://localhost:8080/api"

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }else{
      delete config.headers.Authorization
    }
    return config
  },
  (error) => Promise.reject(error)
)
type ApiError = {
  message: string
} 
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (error.response.data.message === 'Unauthenticated.'){
            window.location.href = '/login'
            localStorage.removeItem('auth-token')
            localStorage.removeItem('user')
          }
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