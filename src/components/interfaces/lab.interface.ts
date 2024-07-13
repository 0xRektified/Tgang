import { EProduct } from "./product.interface";

export interface IBuyLab {
  labProduct: EProduct;
  plotId: number;
}

export interface ILab {
  id: number;
  title: string;
  description: string;
  labPrice: number;
  baseCapacity: number;
  baseCapacityUpgradePrice: number;
  baseProduction: number;
  baseProductionUpgradePrice: number;
  image: string;
}