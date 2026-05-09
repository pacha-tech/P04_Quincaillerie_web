import { StatutCommande } from "../utils/StatutCommande";

export interface Commande {
    idCommande: string;
    dateCommande: string;
    statut: StatutCommande;
    montantTotal: number;
    nombreArticles: number;
    nomQuincaillerie: string;
    factureUrl: string;
    clientName: string;
}