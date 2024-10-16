import { EProduct } from "./product.interface";

export enum ECRAFTABLE_ITEM {
  BOOSTER_ATTACK_1 = "BOOSTER_ATTACK_1",
  BOOSTER_DEFENSE_1 = "BOOSTER_DEFENSE_1",
  HEALTH_POTION_SMALL = "HEALTH_POTION_SMALL",
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
  [ECRAFTABLE_ITEM.BOOSTER_ATTACK_1]: {
    itemId: ECRAFTABLE_ITEM.BOOSTER_ATTACK_1,
    name: "Attack Booster I",
    image: "/assets/pvp/craftables/caps1.png",
    requirements: {
      [EProduct.POWDER]: 3,
      [EProduct.PILL]: 1,
    },
    pvpEffect: {
      damage: 10,
      criticalChance: 3,
    },
    duration: 3,
  },
  [ECRAFTABLE_ITEM.BOOSTER_DEFENSE_1]: {
    itemId: ECRAFTABLE_ITEM.BOOSTER_DEFENSE_1,
    name: "Defense Booster I",
    image: "/assets/pvp/craftables/caps2.png",
    requirements: {
      [EProduct.HERB]: 10,
      [EProduct.MUSHROOM]: 5,
    },
    pvpEffect: {
      protection: 7,
      evasion: 3,
    },
    duration: 3,
  },
  [ECRAFTABLE_ITEM.HEALTH_POTION_SMALL]: {
    itemId: ECRAFTABLE_ITEM.HEALTH_POTION_SMALL,
    name: "Small Health Potion",
    image: "/assets/pvp/craftables/caps3.png",
    requirements: {
      [EProduct.HERB]: 10,
      [EProduct.ACID]: 3,
    },
    pvpEffect: {
      healthPoints: 25,
    },
    duration: 1,
  },
};
