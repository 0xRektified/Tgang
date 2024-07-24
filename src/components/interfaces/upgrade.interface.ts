import { EProduct } from "./product.interface";

export enum EUpgradeCategory {
  PRODUCT = "product",
  DEALER = "dealer",
  SHIPPING = "shipping",
  GANGSTER = "gangster", // TODO: Implement gangster upgrades
}

export enum EDealerUpgrade {
  CUSTOMER_AMOUNT = "customer_amount",
  CUSTOMER_NEEDS = "customer_needs",
}

export interface IRequirement {
  product: EProduct;
  level: number;
}

export interface DealerUpgrade {
  title: string;
  description: string;
  basePrice: number;
  upgradeMultiplier: number;
  baseAmount: number;
  amountMultiplier: number;
  image: string;
  requirements: IRequirement[] | null;
}

export interface ProductUpgrade {
  title: string;
  description: string;
  basePrice: number;
  upgradeMultiplier: number;
  image: string;
  requirements: IRequirement[] | null;
}

export interface IUpgrade {
  [EUpgradeCategory.PRODUCT]: Record<EProduct, ProductUpgrade>;
  [EUpgradeCategory.DEALER]: Record<EDealerUpgrade, DealerUpgrade>;
  [EUpgradeCategory.GANGSTER]: Record<any, any>;
}
