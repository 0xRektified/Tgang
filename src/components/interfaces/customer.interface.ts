import { EProduct } from "./product.interface";

export interface ICustomerInfo {
  name: string;
  product: EProduct;
  price: number;
  quantity: number;
}
