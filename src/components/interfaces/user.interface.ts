import { EProduct } from "./product.interface";

export interface Product {
  name: EProduct;
  unlocked: boolean;
  selected: boolean;
  quantity: number;
  maxCarry: number;
  slot: number | null;
}

export interface IUserUpgrade {
  id: number;
  title: string;
  description: string;
  level: number;
  maxLevel: number;
  levelPrices: number[];
  value: number[];
  image: string;
  locked: boolean;
  group: string;
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
  upgrades: IUserUpgrade[];
  carryingGear: CarryingGear[];
  carryAmount: number;
  carryCapacity: number;
}
