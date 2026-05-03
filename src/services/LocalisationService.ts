import { Localisation } from "../types/Localisation";
import api from "./apiConfig";

class LocalisationService {
    async getLocalisation(lat: number , lng: number): Promise<Localisation> {
        try {
            const response = await api.get(`/localisation?lat=${lat}&lng=${lng}`);
            return response.data;
        }catch (error: any) {
            this.handleError(error);
            throw new Error("Impossible de charger la localisation");

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

export const localisationService = new LocalisationService();