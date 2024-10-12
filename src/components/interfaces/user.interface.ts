import { ECRAFTABLE_ITEM } from "./craftableItem.interface";
import { EProduct } from "./product.interface";
import { EShippingMethod } from "./shipping.interface";
import { SocialChannel } from "./social.interface";
import { EDealerUpgrade, IRequirement, IUpgrade } from "./upgrade.interface";
import { IAchievement } from "./achievements.interface";

export interface UserLab {
  product: EProduct;
  title: string;
  image: string;
  capacityLevel: number;
  productionLevel: number;
  capacity: number;
  production: number;
  upgradeCapacityPrice: number;
  upgradeCapacity: number;
  lastCapacityUpgrade: Date;
  nextCapacityUpgrade: Date;
  upgradeProductionPrice: number;
  upgradeProduction: number;
  lastProductionUpgrade: Date;
  nextProductionUpgrade: Date;
  collectTime: Date;
  produced: number;
}

export interface LabPlot {
  plotId: number;
  lab?: UserLab;
}

export interface IUserShipping {
  method: EShippingMethod;
  title: string;
  image: string;
  capacityLevel: number;
  shippingTimeLevel: number;
  capacity: number;
  shippingTime: number;
  upgradeCapacityPrice: number;
  upgradeCapacity: number;
  lastCapacityUpgrade: Date;
  nextCapacityUpgrade: Date;
  upgradeShippingTimePrice: number;
  upgradeShippingTime: number;
  lastShippingTimeUpgrade: Date;
  nextShippingTimeUpgrade: Date;
  lastShipment: Date;
  nextShipment: Date;
  requirements: IRequirement[] | null;
}

export interface Product {
  name: EProduct;
  quantity: number;
  image: string;
  level: number;
  upgradePrice: number;
  lastUpgrade: Date;
  nextUpgrade: Date;
  marketDiscount: number;
  upgradeMarketDiscount: number;
  selected: boolean;
  slot: number | null;
}

export interface UserDealerUpgrade {
  upgrade: EDealerUpgrade;
  product: EProduct | null;
  title: string;
  image: number;
  level: number;
  amount: number;
  upgradePrice: number;
  lastUpgrade: Date;
  nextUpgrade: Date;
  upgradeAmount: number;
  requirements: IRequirement[] | null;
}

export interface IReputationLevel {
  level: number;
  minReputation: number;
  maxReputation: number;
  title: string;
}

export interface IReferredUsers {
  id: string;
  username: string;
  reward: number;
}

export interface IUserSocial {
  channel: SocialChannel;
  member: boolean;
  joined?: Date;
}

export interface ICraftedItem {
  itemId: ECRAFTABLE_ITEM;
  quantity: number;
}

export interface IUserAchievements {
  [key: number]: boolean;
}

export interface IUserInfo {
  id: string;
  username: string;
  cashAmount: number;
  upgrades: IUpgrade[];
  products: Product[];
  dealerUpgrades: UserDealerUpgrade[];
  shipping: IUserShipping[];
  labPlots: LabPlot[];
  labPlotPrice: number;
  referralToken: string;
  referredUsers: IReferredUsers[];
  customerAmount: number;
  customerAmountMax: number;
  lastSell: Date;
  customerAmountRemaining: number;
  robberyStrike: number;
  lastRobbery?: Date;
  lastShipment?: Date;
  nextShipment: Date;
  reputation: number;
  userLevel: IReputationLevel;
  socials?: IUserSocial[];
  wallet?: string;
  pvp?: IUserPvp;
  craftedItems?: ICraftedItem[];
  achievements?: IUserAchievements;
}

export interface IUserPvp {
  healthPoints: number;
  attackPower: number;
  defensePower: number;
  criticalChance: number;
  lastAttackDate: Date;
  attacksToday: number;
  attacksAvailable: number;
  activeEffects: Array<{
    itemId: ECRAFTABLE_ITEM;
    effect: { [key: string]: number };
    remainingRounds: number;
  }>;
}
