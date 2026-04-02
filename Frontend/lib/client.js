import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
client.interceptors.request.use(
  (config) => {
    // In Web, we use localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem('userToken') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem('userToken');
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default client;