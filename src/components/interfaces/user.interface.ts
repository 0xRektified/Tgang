import { EProduct } from "./product.interface";
import { EShippingMethod } from "./shipping.interface";
import { EDealerUpgrade, IRequirement, IUpgrade } from "./upgrade.interface";

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
  upgradeProductionPrice: number;
  upgradeProduction: number;
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
  upgradeShippingTimePrice: number;
  upgradeShippingTime: number;
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
  wallet?: string;
}
