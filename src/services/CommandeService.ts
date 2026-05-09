import axios from 'axios';
import api from './apiConfig';
import { NoInternetConnectionException } from '../exception/NoInternetConnectionException';
import { UserNotConnectedException } from '../exception/UserNotConnectedException';
import { AppException } from '../exception/AppException';
import { CommandeResponse } from '../types/CommandeResponse';
import { Commande } from '../types/Commande';
import { CommandeDetail } from '../types/CommandeDetail';

class CommandeService {
  
  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new NoInternetConnectionException("Vérifier votre connexion internet");
      }

      const status = error.response.status;
      const message = error.response.data?.message || "Erreur lors de la commande";

      if (status === 401) throw new UserNotConnectedException(message);
      
      throw new AppException(message);
    }
    throw new AppException("Une erreur inattendue est survenue.");
  }


   
  async passCommand(idQuincaillerie: string | null): Promise<CommandeResponse[]> {
    try {
      const response = await api.post<CommandeResponse[]>('/commande/pass', null, {
        params: {
          idQuincaillerie: idQuincaillerie
        }
      });
      
      return response.data;
      
    } catch (error) {
      this.handleError(error);
    
      throw error; 
    }
  };

  async validateCommandeByquincaillerie(idCommande: string): Promise<string> {
    try {
      const response = await api.post<string>(`/commande/validate/${idCommande}`,null);
      
      return response.data;
      
    } catch (error) {
      this.handleError(error);
    
      throw error; 
    }
  };

  async annulationCommandeByquincaillerie(idCommande: string): Promise<string> {
    try {
      const response = await api.post<string>(`/commande/cancel/${idCommande}`,null);
      
      return response.data;
      
    } catch (error) {
      this.handleError(error);
    
      throw error; 
    }
  };

  async getAllCommandeByUser(): Promise<Commande[]> {
      try {
        const response = await api.get('/commande/getAllCommandesByUser');
        console.log(response.data);
        if (response.status === 200) {
          return response.data; 
        }
        return [];
      } catch (error) {
        this.handleError(error);
        return [];
      }
  }

  async getAllCommandeByQuincaillerie(): Promise<Commande[]> {
      try {
        const response = await api.get('/commande/getAllCommandesByQuincaillerie');
        console.log(response.data);
        if (response.status === 200) {
          return response.data; 
        }
        return [];
      } catch (error) {
        this.handleError(error);
        return [];
      }
  }

  async getDetailCommande(idCommande: string): Promise<CommandeDetail[]> {
    try {
      const response = await api.get(`/commande/details/${idCommande}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
        return [];
    }
  }

}

export const commandeService = new CommandeService();