
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  // Utilise ta variable d'environnement ou ton URL par défaut
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Augmenté à 10s pour les connexions mobiles instables
});

// --- INTERCEPTEUR DE REQUÊTE ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Vérification de sécurité pour le SSR (Server Side Rendering)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('firebase_token');
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

// Dans ton fichier api.ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 1. On vide le stockage SANS redirection
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      
      console.warn("Session invalidée : localStorage nettoyé.");
    }
    return Promise.reject(error);
  }
);

export default api;