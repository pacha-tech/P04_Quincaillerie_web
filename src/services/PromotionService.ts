
import api from './apiConfig';
import { AddPromotionDTO } from '../types/DTO/AddPromotionDTO';
import {ProductOutPromotion} from '../types/ProductOutPromotion';
import { ProductSearch } from '../types/productSearch';
import { Promotion } from '../types/Promotion';



class PromotionService {

  async addPromotion(addPromotion: AddPromotionDTO): Promise<void> {
    try {
      console.log(addPromotion.nom);
      console.log(addPromotion);
      await api.post("/promotion/addPromotion", addPromotion);
    } catch (e: any) {
      this.handleError(e);
    }
  }

  async getAllProductOutPromotion(): Promise<ProductOutPromotion[]> {
    try {
      const response = await api.get<ProductOutPromotion[]>("/promotion/allProductOutPromotion");
      return response.data.map(item => ({
        id: item.id,
        nom: item.nom,
        price: item.price,
        category: item.category,
        imageUrl: item.imageUrl,
      }));
    } catch (e: any) {
      this.handleError(e);
      throw new Error("Impossible de charger les produits");
    }
  }

  async getAllProductInPromotion(): Promise<ProductSearch[]> {
    try {
      const response = await api.get<ProductSearch[]>("/promotion/allProductInPromotion");
      return response.data.map(item => ({
        idProduct: item.idProduct,
        name: item.name,
        priceSearchProductsDTO: item.priceSearchProductsDTO,
        unite: item.unite,
        idCategory: item.idCategory,
        imageUrl: item.imageUrl,
        description: item.description,
      }));
    } catch (e: any) {
      this.handleError(e);
      throw new Error("Impossible de charger les produits en promotion");
    }
  }

  async getAllPromotion(): Promise<Promotion[]> {
    try {
      const response = await api.get<Promotion[]>("/promotion/allPromotion");
      console.log(response);
      return response.data.map(item => ({
        idCampagne: item.idCampagne,
        name: item.name,
        taux: item.taux,
        dateDebut: item.dateDebut,
        dateFin: item.dateFin,
        estActif: item.estActif,
        nbreProduits: item.nbreProduits,
      }));
    } catch (e: any) {
      this.handleError(e);
      throw new Error("Impossible de charger les promotions");
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

export const promotionService = new PromotionService();
