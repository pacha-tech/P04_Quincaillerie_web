import axios from "axios";
import api from "./apiConfig";
import { NoInternetConnectionException } from "../exception/NoInternetConnectionException";
import { UserNotConnectedException } from "../exception/UserNotConnectedException";
import { AppException } from "../exception/AppException";
import { CommandeStats } from "../types/CommandeStats";


class ChartService {
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new NoInternetConnectionException("Vérifiez votre connexion internet.");
      }

      const status = error.response.status;
      const message = error.response.data?.message || "Erreur lors de la récupération des statistiques.";

      if (status === 401) {
        throw new UserNotConnectedException("Session expirée. Veuillez vous reconnecter.");
      }

      throw new AppException(message);
    }
    throw new AppException("Une erreur inattendue est survenue.");
  }


  async getCommandeStatsChart(jours: number = 7): Promise<CommandeStats[]> {
    try {
     
      const response = await api.get(`/stats/commandesChart`, {
        params: { jours }
      });
            
      return response.data; 
      
    } catch (error) {
      this.handleError(error);
    }
  }
}


export const chartService = new ChartService();