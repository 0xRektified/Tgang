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
  collectTime: Date;
  produced: number;
  leftover: number;
}

export interface LabPlot {
  plotId: number;
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

export interface IUserInfo {
  id: string;
  username: string;
  cashAmount: number;
  products: Product[];
  upgrades: IUserUpgrade[];
  labPlots: LabPlot[];
  labPlotPrice: number;
  referralToken: string;
  referredUsers: string[];
  customerAmount: number;
  lastSell: Date;
  customerAmountRemaining: number;
}
