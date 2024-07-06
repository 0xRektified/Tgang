// Updated types.ts
export interface Upgrade {
  id: number;
  title: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  image: string;
  locked: boolean;
  requirement: { title: string; level: number } | null;
}

export interface Upgrades {
  dealer: Upgrade[];
  farmer: Upgrade[];
  gangster: Upgrade[];
}

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  amountEarned: number;
}
