import { EProduct } from "./product.interface";

export interface ICustomerInfo {
  customerIndex: number;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  emoji?: string;
}

export interface ICustomerSellRequest {
  product: EProduct;
  quantity: number;
  customerIndex: number;
}
