
export interface Promotion {
  idCampagne: string;
  name: string;
  taux: string;
  dateDebut: string;
  dateFin: string;
  estActif: boolean;
  nbreProduits?: number;
}