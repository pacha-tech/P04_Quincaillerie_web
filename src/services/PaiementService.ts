import axios from 'axios';
import api from './apiConfig';
import { fetchEventSource } from '@microsoft/fetch-event-source'; // 🌟 Ajout de la dépendance
import { NoInternetConnectionException } from '../exception/NoInternetConnectionException';
import { UserNotConnectedException } from '../exception/UserNotConnectedException';
import { AppException } from '../exception/AppException';
import { Paiement } from '../types/Paiement';
import { ComptePaiement } from '../types/ComptePaiement';

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
      
      throw new AppException(message || "Une erreur est survenue lors du paiement. Réessayez plus tard.");
    }
    throw new AppException("Une erreur inattendue est survenue.");
  }

  // 1. Initialisation de la requête de paiement direct (USSD)
  async processPayment(idCommande: string , operator: string , phone: string): Promise<Paiement> {
    try {
      const response = await api.post( `/paiement/pay/${idCommande}?operator=${operator}&phoneNumber=${phone}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new Error("Erreur de paiement"); 
    }
  }

  async getInfosPaiementSeller(): Promise<ComptePaiement> {
    try{
      const response = await api.get('/getDetailVendeur');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new Error("Erreur lors de la récupération des informations de paiement");
    }
  }

  async modifyInfosPaiementSeller(data: ComptePaiement): Promise<ComptePaiement> {
    try {
      const response = await api.put('/modifyDetailVendeur', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new Error("Erreur lors de la mise à jour des informations de paiement");
    }
  }

  // 2. 🌟 Nouvelle méthode : Écoute en temps réel du statut via SSE
  async subscribeToPaymentStatus(
    transactionId: string,
    onStatusChange: (status: string) => void,
    onErrorCallback: (error: any) => void,
    signal: AbortSignal,
    token?: string | null
  ): Promise<void> {
    
    // On extrait dynamiquement la baseURL de ton instance Axios "api"
    const baseURL = api.defaults.baseURL || "http://localhost:8080";
    const url = `${baseURL}/quincaillerie/paiementNotification/stream/${transactionId}`;

    const headers: Record<string, string> = {
      'Accept': 'text/event-stream',
    };

    // Si la route nécessite une sécurité, on ajoute le jeton récupéré depuis Firebase
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    await fetchEventSource(url, {
      method: 'GET',
      headers: headers,
      signal: signal,

      onmessage(event) {
        // Correspond au .name("statut-paiement") configuré côté Spring Boot
        if (event.event === 'statut-paiement') {
          try {
            const data = JSON.parse(event.data);
            onStatusChange(data.status); // Transmet dynamiquement "SUCCESSFUL", "FAILED", etc.
          } catch (err) {
            console.error("Erreur lors du parsing du JSON SSE Paiement:", err);
          }
        }
      },

      onclose() {
        // Important : Quand le serveur Spring Boot appelle emitter.complete(), 
        // on lève une erreur volontaire pour forcer fetchEventSource à NE PAS réessayer.
        throw new Error("Fermeture normale du canal par le serveur.");
      },

      onerror(err) {
        if (err.message === "Fermeture normale du canal par le serveur.") {
          return; // Tout s'est bien passé, fermeture propre sans reconnexion.
        }
        console.error("Échec de la connexion réseau du flux SSE Paiement:", err);
        onErrorCallback(err);
        throw err; // Laisse fetchEventSource tenter une reconnexion uniquement sur crash réseau
      }
    });
  }
}

export const paiementService = new PaiementService();