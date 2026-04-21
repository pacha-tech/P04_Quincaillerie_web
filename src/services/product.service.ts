import axios, { AxiosError } from 'axios';
import { ProductSearch } from '../types/productSearch';
import api from './apiConfig';

// 👉 1. On crée une fonction réutilisable pour gérer TOUTES les erreurs de ce service
const handleApiError = (error: unknown, contextMessage: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    
    if (!axiosError.response) {
      throw new Error("Vérifiez votre connexion internet.");
    }

    const status = axiosError.response.status;
    const message = axiosError.response.data?.message || "Erreur serveur";

    if (status === 404) {
      throw new Error(`Non trouvé : ${message}`);
    } else if (status === 403) {
      console.log(axiosError.response.data?.message);
      throw new Error("Vous n'avez pas l'autorisation d'effectuer cette action.");
    } else {
      // On utilise le contextMessage pour savoir d'où vient l'erreur
      throw new Error(message || `Une erreur est survenue lors de ${contextMessage}.`);
    }
  }
  
  throw new Error("Erreur de traitement des données.");
};


export const getPromotedProducts = async (): Promise<ProductSearch[]> => {
  try {
    const response = await api.get('/promotion/allProductInPromotion');
    return response.data;
  } catch (error) {
    handleApiError(error, "la récupération des promotions");
    return [];
  }
};


export const searchProducts = async (query: string): Promise<ProductSearch[]> => {
  try {
    const response = await api.get(`/products/search?name=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "la recherche de produits");
    return [];
  }
};

/*
export const searchProducts = async (query: string): Promise<ProductSearch[]> => {
    try {
      // Pour le test, on met l'URL en dur pour être sûr à 100%
      const response = await api.get(`http://localhost:9010/quincaillerie/product/search?name=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      // Regarde ta console Node.js (le terminal où tourne Next.js) !
      console.log("URL TENTÉE :", error.config?.url);
      console.log("HEADERS ENVOYÉS :", error.config?.headers);
      
      handleApiError(error, "la recherche de produits");
      return [];
    }
  }
    */