import { IRequirement } from "./upgrade.interface";

export enum EShippingMethod {
  ENVELOPE = "Envelope",
  PACKAGE = "Package",
  PALLET = "Pallet",
  TRUCK = "Truck",
  CONTAINER = "Container",
  PLANE = "Plane",
  ROCKET = "Rocket",
}

export interface IShippingMethod {
  title: EShippingMethod;
  description: string;
  basePrice: number;
  baseCapacityUpgradePrice: number;
  baseCapacity: number;
  baseShippingTimeUpgradePrice: number;
  baseShippingTime: number;
  capacityLevel: number;
  shippingTimeLevel: number;
  image: string;
  requirements: IRequirement[] | null;
}
