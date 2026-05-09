import axios from 'axios';
import { AppException } from '../exception/AppException';
import { NoInternetConnectionException } from '../exception/NoInternetConnectionException';
import { UserNotConnectedException } from '../exception/UserNotConnectedException';
import api from './apiConfig';
import { CodeOtp } from '../types/CodeOtp';
import { promises } from 'dns';
import { ValidationRetraitDTO } from '../types/DTO/ValidationRetraitDTO';


class OtpService {

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
  }

  async getCodeOtp(idCommande: string): Promise<CodeOtp> {
    try {
      const response = await api.get(`/otp/getOtp/${idCommande}`);
            
      return response.data; 
      
    } catch (error) {
      this.handleError(error);
      throw new AppException("Une erreur inattendue est survenue.");
    }
  }

  async validateOtp(otp: ValidationRetraitDTO): Promise<string> {
    try{
        const response = await api.post('/otp/valider',otp);

        return response.data;
    }catch (erro) {
      this.handleError(erro);
      throw new AppException("Une erreur inattendue est survenue.");
    }
  }
}

export const otpService = new OtpService(); 