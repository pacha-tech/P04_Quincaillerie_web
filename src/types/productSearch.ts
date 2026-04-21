import {Price}  from './Price.service';

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