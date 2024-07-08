import { EProduct } from "./product.interface";

export interface ICustomerInfo {
  customerIndex: number;
  product: EProduct;
  quantity: number;
  emoji?: string;
}
