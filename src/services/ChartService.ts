import axios from "axios";
import api from "./apiConfig";
import { NoInternetConnectionException } from "../exception/NoInternetConnectionException";
import { UserNotConnectedException } from "../exception/UserNotConnectedException";
import { AppException } from "../exception/AppException";
import { CommandeStats } from "../types/CommandeStats";
import { VentesStats } from "../types/VentesCharts";
import { IndicateursPerformance } from "../types/IndicateursPerformance";
import { ChartMouvementProduct } from "../types/ChartMouvementProduct";
import { LastMouvement } from "../types/LastMouvement";
import { CampagnePromoStats } from "../types/CampagnePromoStats";


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

  async getVentesStatsChart(jours: number = 7): Promise<VentesStats[]> {
    try {
     
      const response = await api.get(`/stats/ventesChart`, {
        params: { jours }
      });
            
      return response.data; 
      
    } catch (error) {
      this.handleError(error);
    }
  }

  async getIndicateursProduct(idPrice: string, jours: number = 30): Promise<IndicateursPerformance> {
    try {
      const response = await api.get(`/stats/product/${idPrice}/kpis`, {
        params: { jours }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getStatsProductChart(idPrice: string, jours: number = 7): Promise<ChartMouvementProduct[]> {
    try {
      const response = await api.get(`/stats/product/${idPrice}/chart`, {
        params: { jours }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getLastMouvement(idPrice: string): Promise<LastMouvement> {
    try {
      const response = await api.get(`/stats/product/${idPrice}/dernier-mouvement`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getDetailPromotion(idCampagne: string): Promise<CampagnePromoStats> {
    try {
      const response = await api.get(`/stats/campagne/${idCampagne}/detail`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}


export const chartService = new ChartService();