import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo, IUserPvp } from "../components/interfaces/user.interface";
import { EProduct } from "../components/interfaces/product.interface";

export interface Loot {
  name: EProduct;
  quantity: number;
}

// Add this new interface
export interface ICombatResult {
  winner: string;
  loser: string;
  rounds: number;
  roundResults: {
    attackerHp: number;
    defenderHp: number;
    attackerDamage: number;
    defenderDamage: number;
  }[];
  loot: number;
  productLoot: Loot[];
}

export function useMultiplayer(
  userInfo: IUserInfo,
  setUserInfo: (value: React.SetStateAction<IUserInfo>) => void,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [combatResult, setCombatResult] = useState<ICombatResult | null>(null);

  const searchPlayer = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/multiplayer/search`);
      return response.data;
    } catch (err) {
      setError("Failed to search player");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const startFight = useCallback(
    async (playerId: string, opponentId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.post<ICombatResult>(
          `/multiplayer/fight/${opponentId}`,
        );
        setLoading(false);
        const result = response.data;
        setCombatResult(result);

        setUserInfo((prevUserInfo: IUserInfo) => {
          const isWinner = result.winner === prevUserInfo.username;
          const updatedPvp: IUserPvp = prevUserInfo.pvp || {
            victory: 0,
            defeat: 0,
            lastAttackDate: new Date(),
            attacksToday: 0,
            lastDefendDate: new Date(),
            baseHp: 100,
            protection: 0,
            damage: 10,
            accuracy: 50,
            evasion: 5,
            attacksAvailable: 0,
          };

          if (isWinner) {
            updatedPvp.victory += 1;
          } else {
            updatedPvp.defeat = (updatedPvp.defeat ?? 0) + 1;
          }

          return {
            ...prevUserInfo,
            pvp: updatedPvp,
            cashAmount: isWinner
              ? prevUserInfo.cashAmount + result.loot
              : prevUserInfo.cashAmount - result.loot,
          };
        });

        return result;
      } catch (err) {
        setLoading(false);
        setError("Failed to start fight");
        console.error(err);
      }
    },
    [setUserInfo],
  );

  return {
    searchPlayer,
    startFight,
    loading,
    error,
    combatResult,
    setCombatResult,
  };
}
