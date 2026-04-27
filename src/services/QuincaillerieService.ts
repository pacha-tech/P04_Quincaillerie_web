
import axios, { AxiosError } from 'axios';
import api from './apiConfig';
import { getAuth } from 'firebase/auth';
import { authentification } from '@/src/config/firebase';
import { QuincaillerieDetail } from '../types/QuincaillerieDetail';
import { RegisterQuincaillerieDTO } from '../types/DTO/RegisterQuincaillerieDTO';

// --- GESTION CENTRALISÉE DES ERREURS ---
const handleApiError = (error: unknown, contextMessage: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    
    if (!axiosError.response) {
      throw new Error("Vérifiez votre connexion internet.");
    }

    const message = axiosError.response.data?.message || "Erreur serveur";
    throw new Error(message || `Une erreur est survenue lors de ${contextMessage}.`);
  }
  
  throw new Error("Erreur de traitement des données.");
};


export const registerQuincaillerie = async (data: RegisterQuincaillerieDTO): Promise<void> => {
  try {
    const auth = authentification;
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Utilisateur non connecté. Impossible d'enregistrer la quincaillerie.");
    }

    
    const payload = {
      ...data,
      uid: user.uid
    };

    await api.post('/auth/registerUser', payload);
    
  } catch (error) {
    handleApiError(error, "l'inscription de la quincaillerie");
  }
};


export const getQuincaillerieById = async (idQuincaillerie: string): Promise<QuincaillerieDetail | null> => {
  try {
    const response = await api.get('/quincaillerie/details', {
      params: { idQuincaillerie }
    });
    
    return response.data;
  } catch (error) {
    handleApiError(error, "la récupération des détails de la boutique");
    return null; 
  }
};


export const getProfileQuincaillerie = async (): Promise<QuincaillerieDetail | null> => {
  try {
    const response = await api.get('/quincaillerie/details');
    return response.data;
  } catch (error) {
    
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    
    handleApiError(error, "la récupération de votre profil quincaillerie");
    return null;
  }
};