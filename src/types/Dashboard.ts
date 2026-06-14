export interface ChiffreAffaires {
  montant: number;
  evolutionPourcentage: number;
  tendance: string;
}

export interface Reputation {
  noteMoyenne: number;
  nombreAvis: number;
}

export interface StatistiquesCles {
  chiffreAffaires: ChiffreAffaires;
  reputation: Reputation;
  produitsActifs: number;
}

export interface TopProduit {
  rang: number;
  idPrice: string;
  imageUrl?: string;
  nom: string;
  quantiteVendue: number;
  tendance: string;
}

export interface DashboardData {
  statistiquesCles: StatistiquesCles;
  fondsEnAttente: number;
  topProduits: TopProduit[];
}
