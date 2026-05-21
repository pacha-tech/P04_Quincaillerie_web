import axios from 'axios';
import api from './apiConfig';
import { NoInternetConnectionException } from '../exception/NoInternetConnectionException';
import { UserNotConnectedException } from '../exception/UserNotConnectedException';
import { AppException } from '../exception/AppException';
import { Paiement } from '../types/Paiement';


class PaiementService {
  
  // Fonction utilitaire centralisée pour gérer les erreurs Axios (DRY)
  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new NoInternetConnectionException("Vérifier votre connexion internet");
      }

      const status = error.response.status;
      const message = error.response.data?.message || "Erreur inconnue lors du paiement";

      if (status === 401) throw new UserNotConnectedException(message);
      
      // Si tu as créé une exception spécifique pour les paiements échoués (ex: 400 Bad Request)
      // if (status === 400) throw new PaymentFailedException(message);

      throw new AppException(message || "Une erreur est survenue lors du paiement. Réessayez plus tard.");
    }
    throw new AppException("Une erreur inattendue est survenue.");
  }


  async processPayment(idCommande: string): Promise<Paiement> {
    try {
      
      const response = await api.post( `/paiement/pay/${idCommande}`, null);
      
      
      return response.data;
      
    } catch (error) {
      this.handleError(error);
      
      throw new Error("Erreur de paiement"); 
    }
  }
}


export const paiementService = new PaiementService();