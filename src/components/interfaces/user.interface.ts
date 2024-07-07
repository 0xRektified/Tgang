import { EProduct } from "./product.interface";

export interface Product {
  name: EProduct;
  unlocked: boolean;
  selected: boolean;
  quantity: number;
  maxCarry: number;
  slot: number | null;
}

export interface CarryingGear {
  name: string;
  capacity: number;
}

export interface IUserInfo {
  id: string;
  username: string;
  cashAmount: number;
  products: Product[];
  carryingGear: CarryingGear[];
  carryAmount: number;
  carryCapacity: number;
}
