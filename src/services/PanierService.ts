import axios from 'axios';
import { CartItem } from '@/src/types/Cart';
import api from './apiConfig';
import { NoInternetConnectionException } from '../exception/NoInternetConnectionException';
import { UserNotConnectedException } from '../exception/UserNotConnectedException';
import { ProductAlreadyExistsException } from '../exception/ProductAlreadyExistsException';
import { ProductNotFoundException } from '../exception/ProductNotFoundException';
import { AppException } from '../exception/AppException';

class PanierService {
  
  // Fonction utilitaire centralisée pour gérer les erreurs Axios (DRY)
  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new NoInternetConnectionException("Vérifier votre connexion internet");
      }

      const status = error.response.status;
      const message = error.response.data?.message || "Erreur inconnue";

      if (status === 401) throw new UserNotConnectedException(message);
      if (status === 404) throw new ProductNotFoundException(message);
      if (status === 409) throw new ProductAlreadyExistsException(message);

      throw new AppException(message || "Une erreur est survenue. Réessayez plus tard.");
    }
    throw new AppException("Une erreur inattendue est survenue.");
  }

  async addProductToPanier(idPrice: string): Promise<void> {
    try {
      await api.post('/panier/addToPanier', null, { params: { idPrice } });
    } catch (error) {
      this.handleError(error);
    }
  }

  
  async deleteProductFromPanier(idPrice: string): Promise<void> {
    try {
      await api.delete(`/panier/product/${idPrice}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getQuantityInPanier(idPrice: string): Promise<number> {
    try {
      const response = await api.get('/panier/product/getQuantityInPanier', { params: { idPrice } });
      if (response.status === 200) {
        return parseInt(response.data?.toString(), 10) || 0;
      }
      return 0;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return 0;
      }
      this.handleError(error);
      return 0;
    }
  }

  async deletePanierByQuincaillerie(idQuincaillerie: string): Promise<void> {
    try {
      await api.delete(`/panier/${idQuincaillerie}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteAllPaniersByUser(): Promise<void> {
    try {
      await api.delete('/panier/all');
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllProductInPanier(): Promise<CartItem[]> {
    try {
      const response = await api.get('/panier/getAllProductInPanier');
      if (response.status === 200) {
        return response.data as CartItem[]; 
      }
      return [];
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async addQuantityToPanier(idPrice: string): Promise<void> {
    try {
      await api.post('/panier/addQuantityToPanier', null, { params: { idPrice } });
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeQuantityToPanier(idPrice: string): Promise<void> {
    try {
      await api.post('/panier/removeQuantityToPanier', null, { params: { idPrice } });
    } catch (error) {
      this.handleError(error);
    }
  }
}


export const panierService = new PanierService();