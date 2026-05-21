
export interface ProductInCategory {
  idPrice: string;
  quincaillerieName: string;
  idQuincaillerie: string;
  latitudeQuincaillerie: number;
  longitudeQuincaillerie: number;
  name: string;
  brand: string;
  idCategory: string;
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