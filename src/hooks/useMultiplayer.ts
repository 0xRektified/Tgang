import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";
import {
  IBattle,
  IHistoryBattleResult,
} from "../components/interfaces/multiplayer.interface";
import { ECRAFTABLE_ITEM } from "../components/interfaces/craftableItem.interface";

const PRECONDITION_REQUIRED = 428; // For social network requirement
const PRECONDITION_FAILED = 412; // For max attacks reached

interface ErrorResponse {
  statusCode: number;
  message: string;
}

export function useMultiplayer(
  userInfo: IUserInfo,
  setUserInfo: (value: React.SetStateAction<IUserInfo>) => void,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [battleHistory, setBattleHistory] = useState<IHistoryBattleResult[]>(
    [],
  );
  const [maxAttacksReached, setMaxAttacksReached] = useState(false);
  const [socialNetworkRequired, setSocialNetworkRequired] = useState(false);
  const [activeEffects, setActiveEffects] = useState<
    Array<{
      itemId: ECRAFTABLE_ITEM;
      effect: { [key: string]: number };
      remainingRounds: number;
    }>
  >([]);

  const searchPlayer = useCallback(async () => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    setSuccessMessage(null);
    try {
      const response = await axiosInstance.get<IUserInfo[]>(
        "/multiplayer/search",
      );
      setLoading(false);
      setSuccessMessage("Opponent found successfully");
      return response.data;
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message);
        setErrorCode(err.response.status);
      } else {
        setError("Failed to search for players");
      }
      console.error(err);
      return null;
    }
  }, []);

  const fetchuser = useCallback(async () => {
    try {
      const response = await axiosInstance.get<IUserInfo>(`/users`);
      if (response.data) {
        setUserInfo(response.data);
        return response.data; // Return the updated user info
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, [setUserInfo]);

  const startFight = useCallback(
    async (playerId: string, opponentId: string) => {
      setLoading(true);
      setError(null);
      setErrorCode(null);
      setSuccessMessage(null);
      setMaxAttacksReached(false);
      setSocialNetworkRequired(false);
      try {
        const response = await axiosInstance.post<IBattle>(
          `/multiplayer/start/${opponentId}`,
        );
        setLoading(false);
        setSuccessMessage("Fight started successfully");
        return response.data;
      } catch (err: any) {
        setLoading(false);
        if (err.response && err.response.data) {
          setError(err.response.data.message);
          setErrorCode(err.response.status);
          if (err.response.status === PRECONDITION_FAILED) {
            setMaxAttacksReached(true);
          } else if (err.response.status === PRECONDITION_REQUIRED) {
            setSocialNetworkRequired(true);
          }
        } else {
          setError("Failed to start fight");
        }
        console.error(err);
        return null;
      }
    },
    [],
  );

  const combatAction = useCallback(
    async (battleId: string, itemId?: ECRAFTABLE_ITEM) => {
      setLoading(true);
      setError(null);
      setErrorCode(null);
      setSuccessMessage(null);
      try {
        const response = await axiosInstance.post<IBattle>(
          `/multiplayer/combatAction/${battleId}`,
          { itemId },
        );
        setLoading(false);
        setSuccessMessage("Combat action performed successfully");
        return response.data;
      } catch (err: any) {
        setLoading(false);
        if (err.response && err.response.data) {
          setError(err.response.data.message);
          setErrorCode(err.response.status);
        } else {
          setError("Failed to perform combat action");
        }
        console.error(err);
        return null;
      }
    },
    [],
  );

  const fetchBattleHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    setSuccessMessage(null);
    try {
      const response = await axiosInstance.get<IHistoryBattleResult[]>(
        "/multiplayer/battle-results",
      );
      setLoading(false);
      setBattleHistory(response.data);
      return response.data;
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message);
        setErrorCode(err.response.status);
      } else {
        setError("Failed to fetch battle history");
      }
      console.error(err);
      return null;
    }
  }, []);

  const upsertBattleResult = useCallback((newBattle: IBattle) => {
    setBattleHistory((prevHistory) => {
      const historyBattle: IHistoryBattleResult = {
        battleId: newBattle.battleId,
        attacker: {
          id: newBattle.attacker.id,
          username: newBattle.attacker.username,
        },
        defender: {
          id: newBattle.defender.id,
          username: newBattle.defender.username,
        },
        round: newBattle.round,
        winner:
          newBattle.winner === "attacker"
            ? newBattle.attacker.id.toString()
            : newBattle.defender.id.toString(),
        cashLoot: newBattle.cashLoot || 0,
        productLoot: newBattle.productLoot || [],
      };

      const index = prevHistory.findIndex(
        (battle) => battle.battleId === newBattle.battleId,
      );
      if (index !== -1) {
        const updatedHistory = [...prevHistory];
        updatedHistory[index] = historyBattle;
        return updatedHistory;
      } else {
        return [historyBattle, ...prevHistory];
      }
    });
  }, []);

  const getActiveEffects = useCallback(() => {
    return activeEffects;
  }, [activeEffects]);

  return {
    searchPlayer,
    startFight,
    combatAction,
    fetchBattleHistory,
    upsertBattleResult,
    fetchuser,
    battleHistory,
    loading,
    error,
    errorCode,
    successMessage,
    maxAttacksReached,
    socialNetworkRequired,
    getActiveEffects,
    activeEffects,
  };
}
