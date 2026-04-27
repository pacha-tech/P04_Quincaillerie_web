
export interface Price {
  idPrice: string;
  price: number;
  stock: number;
  promotion: string | null;
  quincaillerieName: string;
  idQuincaillerie: string;
  longitudeQuincaillerie: number;
  latitudeQuincaillerie: number;
  pricePromo: number;
  inPromotion: boolean;
  taux: string;
}