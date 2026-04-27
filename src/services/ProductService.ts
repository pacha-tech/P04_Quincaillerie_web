import axios, { AxiosError } from 'axios';
import { ProductSearch } from '../types/productSearch';
import { ProductRecommended } from '../types/ProductRecommended';
import api from './apiConfig';
import { AddProductDTO } from '../types/DTO/AddProductDTO';
import { ProductStock } from '../types/ProductStock';


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
    } else if (status === 409) {
      throw new Error(message || "Ce produit existe déjà.");
    } else if (status === 415) {
      throw new Error("Format de données non supporté. Vérifiez vos fichiers ou le format JSON.");
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
    const response = await api.get(`/products/search`, {
      params: { name: query }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "la recherche de produits");
    return [];
  }
};

export const getProductsByQuincaillerie = async (): Promise<ProductStock[]> => {
  try {
    const response = await api.get('/products/getStock');
    return response.data;
  } catch (error) {
    handleApiError(error, "la récupération des stocks du magasin");
    return [];
  }
};

export const getRecommandationByProductAndStore = async (idProduct: string, idQuincaillerie: string): Promise<ProductRecommended[]> => {
  try {
    const response = await api.get('/products/recommendations', {
      params: { idProduct, idQuincaillerie }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "la récupération des recommandations");
    return [];
  }
};


export const addProduct = async (productData: AddProductDTO, imageFile?: File): Promise<void> => {
  try {
    const formData = new FormData();

    // Ajout du JSON en tant que chaîne de caractères (comme dans ton Dart : MultipartFile.fromString)
    formData.append("data", new Blob([JSON.stringify(productData)], { type: "application/json" }));

    // Ajout de l'image si elle existe
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Le Content-Type 'multipart/form-data' est généralement géré automatiquement par Axios quand il voit un FormData
    await api.post('/products/addProduct', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    handleApiError(error, "l'ajout du produit");
  }
};

export const updateProduct = async (idProduit: string, changes: Record<string, any>, imageFile?: File): Promise<void> => {
  try {
    const formData = new FormData();

    // On extrait l'image des "changes" si elle y a été glissée (pour imiter ta logique Dart)
    let finalImageFile = imageFile;
    const dataToEncode = { ...changes };

    if (dataToEncode.imageFile instanceof File) {
      finalImageFile = dataToEncode.imageFile;
      delete dataToEncode.imageFile;
    }

    // Ajout des données JSON
    formData.append("data", new Blob([JSON.stringify(dataToEncode)], { type: "application/json" }));

    // Ajout de l'image
    if (finalImageFile) {
      formData.append("image", finalImageFile);
    }

    await api.patch(`/products/${idProduit}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    handleApiError(error, "la mise à jour du produit");
  }
};

export const deleteProduct = async (idProduct: string): Promise<void> => {
  try {
    await api.delete(`/products/${idProduct}`);
  } catch (error) {
    handleApiError(error, "la suppression du produit");
  }
};

export const getProductById = async (productId: string): Promise<ProductSearch> => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "la récupération du produit");
    throw error; 
  }
};