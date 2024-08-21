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
  // PRODUCT_QUALITY = "product_quality",
  // LUXURY_PACKAGING = "luxury_packaging",
  // HIGH_VALUE_CUSTOMERS = "high_value_customers",
  COMBO_PACKS = "combo_packs",
  HIGH_END_PACKAGING = "high_end_packaging",
  PARTY_PACKS = "party_packs",
  HIGH_DOSE_PACKAGES = "high_dose_packages",
  FESTIVAL_BLOTTERS = "festival_blotters",
  BULK_BAGS = "bulk_bags",
}

export type UpgradeRequirementType = 'fixed' | 'linear';
export type RequirementType = 'product' | 'referredUsers';

export interface IRequirement {
  product?: EProduct;
  level: number;
  requirement: RequirementType;
  type: UpgradeRequirementType;
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
  baseDiscount: number;
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
