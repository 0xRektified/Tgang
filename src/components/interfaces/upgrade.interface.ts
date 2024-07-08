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
