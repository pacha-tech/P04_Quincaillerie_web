import { MouvementStock } from "../utils/MouvementStock";

export interface LastMouvement {
    date: string;
    type: MouvementStock;
    quantite: number
    commentaire: string;
}