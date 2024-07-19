import { EProduct } from "./product.interface";

export interface MarketProduct {
  name: EProduct;
  price: number;
  discountPrice: number;
}

export interface IMarketInfo {
  id: string;
  name: string;
  products: MarketProduct[];
}
