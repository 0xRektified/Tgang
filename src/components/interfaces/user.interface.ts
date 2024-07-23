import { EProduct } from "./product.interface";
import {
  EDealerUpgrade,
  EShippingUpgrade,
  IUpgrade,
} from "./upgrade.interface";

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
}

export interface LabPlot {
  plotId: number;
  lab?: UserLab;
}

export interface Product {
  product: EProduct;
  name: EProduct;
  quantity: number;
  image: string;
  level: number;
  upgradePrice: number;
  marketDiscount: number;
  selected: boolean;
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

export interface UserDealerUpgrade {
  product: EDealerUpgrade;
  title: string;
  image: number;
  level: number;
  upgradePrice: number;
  amount: number;
}

export interface UserShippingUpgrade {
  product: EShippingUpgrade;
  title: string;
  image: number;
  level: number;
  upgradePrice: number;
  amount: number;
}

export interface IReputationLevel {
  level: number;
  minReputation: number;
  maxReputation: number;
  title: string;
}
export interface IUserInfo {
  id: string;
  username: string;
  cashAmount: number;
  upgrades: IUpgrade[];
  products: Product[];
  dealerUpgrades: UserDealerUpgrade[];
  shippingUpgrades: UserShippingUpgrade[];
  labPlots: LabPlot[];
  labPlotPrice: number;
  referralToken: string;
  referredUsers: string[];
  customerAmount: number;
  lastSell: Date;
  customerAmountRemaining: number;
  robberyStrike: number;
  lastRobbery?: Date;
  lastShipment?: Date;
  nextShipment: Date;
  reputation: number;
  userLevel: IReputationLevel;
}
