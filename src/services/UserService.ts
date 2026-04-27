import { authentification } from '@/src/config/firebase';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import axios, { AxiosError } from 'axios';
import { RegisterCustomerDTO } from '../types/DTO/RegisterCustomerDTO';
import { RegisterSellerDTO } from '../types/DTO/RegisterSellerDTO';
import { UserInfos } from '../types/UserInfos';
import api from './apiConfig';




class UserService {
  
  /*
  async registerToFirebase(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(auth, email, password);
  }
    */

  
  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(authentification, email, password);
  }

  
  async registerCustomer(registerCustomerDTO: RegisterCustomerDTO | FormData): Promise<void> {
    try {
      await api.post('/auth/registerCustomer', registerCustomerDTO);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error("Vérifiez votre connexion internet");
        }
        throw new Error(error.response.data?.message || "Une erreur est survenue lors de l'inscription.");
      }
      throw new Error("Une erreur inattendue est survenue.");
    }
  }

  
  async registerSeller(registerSellerDTO: RegisterSellerDTO | FormData): Promise<void> {
    console.log("Données envoyées :", registerSellerDTO);
    try {
      await api.post('/auth/registerSeller', registerSellerDTO);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error("Vérifiez votre connexion internet");
        }
        throw new Error(error.response.data?.message || "Une erreur est survenue lors de l'inscription vendeur.");
      }
      throw new Error("Une erreur inattendue est survenue.");
    }
  }

  
  async getUserInfo(): Promise<UserInfos> {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error("Vérifiez votre connexion internet");
        }
        throw new Error("Impossible de récupérer les informations de l'utilisateur.");
      }
      throw new Error("Une erreur inattendue est survenue.");
    }
  }
}


export const userService = new UserService();