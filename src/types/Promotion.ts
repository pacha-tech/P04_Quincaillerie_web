
export interface Promotion {
  name: string;
  taux: string;
  dateDebut: string;
  dateFin: string;
  estActif: boolean;
  nbreProduits?: number;
}