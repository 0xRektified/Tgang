export enum EDealerUpgrade {
  WEED = 1000,
  COKE = 1001,
  METH = 1002,
  HEROIN = 1003,
  CUSTOMER_AMOUNT = 1004,
  CUSTOMER_NEEDS = 1005,
}

export interface IRequirement {
  title: string;
  level: number;
}

export interface IUpgrade {
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
  requirement?: IRequirement | null;
}

export interface IUpgradesCategory {
  category: string;
  upgrades: IUpgrade[];
}
