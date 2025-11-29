import Constants from 'expo-constants';
import axios from 'axios';

const baseURL = Constants.expoConfig?.extra?.API_URL || 'https://api.example.com';

console.log('API Base URL:', baseURL);

export const client = axios.create({
  baseURL,
});

// Add request interceptor for debugging
client.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.log('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
client.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('Response Error:', error.message);
    if (error.response) {
      console.log('Response data:', error.response.data);
      console.log('Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);
