export enum EShippingMethod {
  ENVELOPE = 'Envelope',
  PACKAGE = 'Package',
  PALLET = 'Pallet',
  TRUCK = 'Truck',
  CONTAINER = 'Container',
  PLANE = 'Plane',
  ROCKET = 'Rocket',
}

export interface IShippingMethod {
  title: EShippingMethod;
  description: string;
  basePrice: number;
  baseCapacityUpgradePrice: number;
  baseCapacity: number;
  basShippingTimeUpgradePrice: number;
  basShippingTime: number;
  image: string;
  requirement: Requirement | null;
}

export type UpgradeRequirementType = 'fixed' | 'linear';

export interface Requirement {
  referredUsers: number;
  type: UpgradeRequirementType;
}
