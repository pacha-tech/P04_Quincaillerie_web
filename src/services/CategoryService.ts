import { Category } from "../types/Category";
import api from "./apiConfig";

class CategoryService {

  async getAllCategory(): Promise<Category[]> {
    try {
      const response = await api.get<Category[]>("/category/allCategory");
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new Error("Impossible de récupérer les catégories.");
    }
  }


  async addCategory(name: string): Promise<void> {
    try {
      await api.post("/category/addCategory", { name });
    } catch (error) {
      this.handleError(error);
      throw new Error("Impossible d'ajouter la catégorie.");
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


export const categoryService = new CategoryService();