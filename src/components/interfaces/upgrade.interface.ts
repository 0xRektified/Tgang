import { EProduct } from "./product.interface";

export enum EUpgradeCategory {
  PRODUCT = "product",
  DEALER = "dealer",
  SHIPPING = "shipping",
  GANGSTER = "gangster", // TODO: Implement gangster upgrades
}

export enum EDealerUpgrade {
  SOCIAL_MEDIA_CAMPAGIN = "social_media_campaign",
  STREET_PROMOTION_TEAM = "street_promotion_team",
  CLUB_PARTNERSHIP = "club_partnership",
  PRODUCT_QUALITY = "product_quality",
  LUXURY_PACKAGING = "luxury_packaging",
  HIGH_VALUE_CUSTOMERS = "high_value_customers",
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
