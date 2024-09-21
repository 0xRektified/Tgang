import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";
import { IBattle } from "../components/interfaces/multiplayer.interface";

export function useMultiplayer(
  userInfo: IUserInfo,
  setUserInfo: (value: React.SetStateAction<IUserInfo>) => void,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [combatResult, setCombatResult] = useState<IBattle | null>(null);

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

  const fetchuser = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get<IUserInfo>(`/users`);
      setUserInfo(data);
    } catch (error: any) {
      console.error("Failed to fetch user");
    }
  }, []);

  const performAttack = async (battleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post<IBattle>(
        `/multiplayer/attack/${battleId}`,
      );
      setLoading(false);
      setCombatResult(data);

      if (data.winner) {
        fetchuser();
      }

      return data;
    } catch (err) {
      setLoading(false);
      setError("Failed to perform attack");
      console.error(err);
    }
  };

  const startFight = useCallback(
    async (playerId: string, opponentId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.post<IBattle>(
          `/multiplayer/start/${opponentId}`,
        );
        setLoading(false);
        const result = response.data;
        setCombatResult(result);

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
    performAttack,
    loading,
    error,
    combatResult,
    setCombatResult,
  };
}
