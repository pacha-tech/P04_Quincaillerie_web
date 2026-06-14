
export interface ProductStock {
  idPrice: string;
  name: string;
  brand: string;
  category: string;
  stock: number;
  unit: string;
  sellPrice: number;
  imageUrl?: string;
  description: string;
  purchasePrice: number;
  pricepromo?: number;
  inPromotion: boolean;
  taux?: number;
}