
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { authentification } from '../config/firebase';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:9010/quincaillerie',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Augmenté à 10s pour les connexions mobiles instables
});

// --- INTERCEPTEUR DE REQUÊTE ---
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const auth = authentification;
    await auth.authStateReady();
    const user = auth.currentUser;

    if(user) {
      try{
        console.log("Récupération du token d'authentification pour la requête API...");
        const token = await user.getIdToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch(error) {
        console.error("Erreur lors de la récupération du token d'authentification :", error);
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
      localStorage.removeItem('firebase_token');
      localStorage.removeItem('user_role');
      
      console.warn("Session invalidée : localStorage nettoyé.");
    }
    return Promise.reject(error);
  }
);

export default api;