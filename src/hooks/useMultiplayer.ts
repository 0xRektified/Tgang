import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";
import {
  IBattle,
  IHistoryBattleResult,
} from "../components/interfaces/multiplayer.interface";

// Add these constants at the top of the file
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
      const { data } = await axiosInstance.get<IUserInfo>(`/users`);
      setUserInfo(data);
    } catch (error: any) {
      console.error("Failed to fetch user");
    }
  }, [setUserInfo]);

  const performAttack = useCallback(async (battleId: string) => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    setSuccessMessage(null);
    try {
      const response = await axiosInstance.post<IBattle>(
        `/multiplayer/attack/${battleId}`,
      );
      setLoading(false);
      setSuccessMessage("Attack performed successfully");
      return response.data;
    } catch (err: any) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message);
        setErrorCode(err.response.status);
      } else {
        setError("Failed to perform attack");
      }
      console.error(err);
      return null;
    }
  }, []);

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
        console.log(`response`);
        console.log(response);
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
        cashLoot: newBattle.cashLoot,
        productLoot: newBattle.productLoot,
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

  return {
    searchPlayer,
    startFight,
    performAttack,
    fetchBattleHistory,
    upsertBattleResult,
    battleHistory,
    loading,
    error,
    errorCode,
    successMessage,
    maxAttacksReached,
    socialNetworkRequired,
  };
}
