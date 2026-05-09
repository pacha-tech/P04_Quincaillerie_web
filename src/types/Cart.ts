export interface CartItem {
  idPrice: string;
  idQuincaillerie: string;
  productName: string;
  storeName: string;
  price: number;
  pricePromo?: number;
  inPromotion: boolean;
  quantity: number;
  stock:number;
  imageUrl: string;
}