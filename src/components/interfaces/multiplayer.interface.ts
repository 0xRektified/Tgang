import { EProduct } from "./product.interface";
import { IUserInfo, IUserPvp } from "./user.interface";
import { ECRAFTABLE_ITEM } from "./craftableItem.interface";

export interface Loot {
  name: EProduct;
  quantity: number;
}

export interface IBattleParticipant {
  id: number;
  username: string;
  pvp: IUserPvp;
  selectedItems?: { itemId: ECRAFTABLE_ITEM; quantity: number }[];
}

export interface IRoundResult {
  attackerDamage: number;
  defenderDamage: number;
  attackerCritical: boolean;
  defenderCritical: boolean;
  usedItem?: ECRAFTABLE_ITEM;
}

export interface IBattle {
  battleId: string;
  attacker: IBattleParticipant;
  defender: IBattleParticipant;
  opponent?: IUserInfo;
  round: number;
  roundResults: IRoundResult[];
  winner?: string;
  cashLoot?: number;
  productLoot?: Loot[];
}

export interface IHistoryBattleResult {
  battleId: string;
  attacker: {
    id: number;
    username: string;
  };
  defender: {
    id: number;
    username: string;
  };
  round: number;
  winner: string;
  cashLoot: number;
  productLoot: Loot[];
  createdAt?: Date;
}
