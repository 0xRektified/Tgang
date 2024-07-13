import { EProduct } from "./product.interface";

export interface UserLab {
  product: EProduct;
  title: string;
  image: string;
  capacityLevel: number;
  productionLevel: number;
  capacity: number;
  production: number;
  upgradeCapacityPrice: number;
  upgradeProductionPrice: number;
}

export interface LabPlot {
  id: number;
  lab?: UserLab;
}

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
  id: number;
  title: string;
  capacity: number;
}

export interface IUserInfo {
  id: string;
  username: string;
  cashAmount: number;
  products: Product[];
  upgrades: IUserUpgrade[];
  carryingGear: CarryingGear[];
  labPlots: LabPlot[];
  carryAmount: number;
  carryCapacity: number;
  referralToken: string;
  referredUsers: string[];
}
