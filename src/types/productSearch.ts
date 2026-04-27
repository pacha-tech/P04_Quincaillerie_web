import {Price}  from './Price';

export interface ProductSearch {
  idProduct: string;
  idCategory: string;
  name: string;
  unite: string;
  description?: string;
  imageUrl: string;
  quincaillerie: string;
  priceSearchProductsDTO: Price[];
}