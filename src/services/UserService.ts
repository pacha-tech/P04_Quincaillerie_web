import { authentification } from '@/src/config/firebase';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import axios, { AxiosError } from 'axios';
import { RegisterCustomerDTO } from '../types/DTO/RegisterCustomerDTO';
import { RegisterSellerDTO } from '../types/DTO/RegisterSellerDTO';
import { UserInfos } from '../types/UserInfos';
import api from './apiConfig';
import { AuthResponse } from '../types/AuthResponse';




class UserService {
  
  /*
  async registerToFirebase(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(auth, email, password);
  }
    */

  
  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(authentification, email, password);
  }

  async registerCustomer(registerCustomerDTO: RegisterCustomerDTO, photo?: File): Promise<AuthResponse> {
    try {
      const formData = new FormData();

      
      const jsonBlob = new Blob([JSON.stringify(registerCustomerDTO)], {
        type: 'application/json'
      });
      
      
      formData.append('data', jsonBlob);

    
      if (photo) {
        formData.append('photo', photo);
      }


      const response = await api.post('/auth/registerCustomer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;

    } catch (error) {
      this.handleError(error);
      throw new Error("Une erreur inattendue est survenue.");
    }
  }

  
  async registerSeller(registerSellerDTO: RegisterSellerDTO | FormData): Promise<AuthResponse> {
    console.log("Données envoyées :", registerSellerDTO);
    try {
      const response = await api.post('/auth/registerSeller', registerSellerDTO);

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new Error("Une erreur inattendue est survenue.");
    }
  }

  
  async getUserInfo(): Promise<UserInfos> {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new Error("Une erreur inattendue est survenue.");
    }
  }

  private handleError(error: any) {
    console.error("Erreur API :", error);
    if (!error.response) {
      throw new Error("Vérifiez votre connexion internet");
    }

    const status = error.response.status;
    const message = error.response.data?.message || "Une erreur est survenue";

    if (status === 404) {
      throw new Error(message);
    } else if (status === 403) {
      throw new Error("Vous n'avez pas l'autorisation d'accéder à ces informations.");
    } else {
      throw new Error("Une erreur est survenue. Réessayez plus tard.");
    }
  }

}


export const userService = new UserService();