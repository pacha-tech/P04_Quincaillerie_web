
export interface ProductStock {
  id: string;
  name: string;
  brand: string;
  category: string;
  stock: number;
  unit: string;
  sellPrice: number;
  imageUrl?: string;
  descriptionProduit: string;
  purchasePrice: number;
  pricepromo?: number;
  inPromotion: boolean;
  taux?: number;
}