import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { authentification } from '../config/firebase';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});


api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const user = authentification.currentUser;
      let token = null;

      if (user) {
        try {
        
          token = await user.getIdToken(false);
          
          localStorage.setItem('firebase_token', token);
        } catch (error) {
          console.error("Erreur lors de la récupération du token Firebase :", error);
        }
      } 
      
      if (!token) {
        token = localStorage.getItem('firebase_token');
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem('firebase_token');
      localStorage.removeItem('user_role');
      
      console.warn("Session invalidée (401) : localStorage nettoyé.");
      
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;