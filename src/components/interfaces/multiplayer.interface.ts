import { EProduct } from "./product.interface";
import { IUserPvp } from "./user.interface";

export interface Loot {
  name: EProduct;
  quantity: number;
}

export interface IBattleParticipant extends IUserPvp {
  id: number;
  username: string;
  healthPoints: number;
}

export interface IRoundResult {
  attackerDamage: number;
  defenderDamage: number;
  attackerCritical: boolean;
  defenderCritical: boolean;
}

export interface IBattle {
  battleId: string;
  attacker: IBattleParticipant;
  defender: IBattleParticipant;
  round: number;
  roundResults: IRoundResult[];
  winner?: string;
  cashLoot: number;
  productLoot: Loot[];
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