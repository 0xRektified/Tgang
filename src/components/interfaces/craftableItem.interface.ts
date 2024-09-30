import { EProduct } from "./product.interface";

export enum ECRAFTABLE_ITEM {
  BOOSTER_ATTACK_2 = "BOOSTER_ATTACK_2",
  BOOSTER_DEFENSE_1 = "BOOSTER_DEFENSE_1",
  HEALTH_POTION = "HEALTH_POTION",
}

export type PvpEffect = {
  healthPoints?: number;
  protection?: number;
  damage?: number;
  criticalChance?: number;
  evasion?: number;
  accuracy?: number;
};

export interface CraftableItem {
  itemId: ECRAFTABLE_ITEM;
  name: string;
  image: string;
  requirements: {
    [key in EProduct]?: number;
  };
  pvpEffect: PvpEffect;
  duration: number;
}

export const CRAFTABLE_ITEMS: Record<ECRAFTABLE_ITEM, CraftableItem> = {
  [ECRAFTABLE_ITEM.BOOSTER_ATTACK_2]: {
    itemId: ECRAFTABLE_ITEM.BOOSTER_ATTACK_2,
    name: "Attack Booster II",
    image: "/assets/pvp/craftables/caps1.png",
    requirements: {
      [EProduct.HERB]: 2,
      [EProduct.MUSHROOM]: 1,
    },
    pvpEffect: {
      damage: 2,
      criticalChance: 5,
    },
    duration: 3,
  },
  [ECRAFTABLE_ITEM.BOOSTER_DEFENSE_1]: {
    itemId: ECRAFTABLE_ITEM.BOOSTER_DEFENSE_1,
    name: "Defense Booster I",
    image: "/assets/pvp/craftables/caps2.png",
    requirements: {
      [EProduct.ACID]: 1,
      [EProduct.CRYSTAL]: 1,
    },
    pvpEffect: {
      protection: 1,
      evasion: 3,
    },
    duration: 2,
  },
  [ECRAFTABLE_ITEM.HEALTH_POTION]: {
    itemId: ECRAFTABLE_ITEM.HEALTH_POTION,
    name: "Health Potion",
    image: "/assets/pvp/craftables/caps3.png",
    requirements: {
      [EProduct.HERB]: 1,
      [EProduct.PILL]: 1,
    },
    pvpEffect: {
      healthPoints: 10,
    },
    duration: 1,
  },
};
