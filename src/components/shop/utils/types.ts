// Updated types.ts
export interface IUpgrade {
  id: number;
  title: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  image: string;
  locked: boolean;
  group: string;
  requirement: { title: string; level: number } | null;
}

export interface IUpgrades {
  dealer: IUpgrade[];
  farmer: IUpgrade[];
  gangster: IUpgrade[];
}

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  amountEarned: number;
}
