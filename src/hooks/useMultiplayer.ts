import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";
import { IBattle } from "../components/interfaces/multiplayer.interface";

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

  const searchPlayer = useCallback(async () => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    setSuccessMessage(null);
    try {
      const response = await axiosInstance.get<IUserInfo[]>("/multiplayer/search");
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
  }, []);

  const performAttack = useCallback(
    async (battleId: string) => {
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
    },
    [setUserInfo],
  );

  const startFight = useCallback(
    async (playerId: string, opponentId: string) => {
      setLoading(true);
      setError(null);
      setErrorCode(null);
      setSuccessMessage(null);
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
        } else {
          setError("Failed to start fight");
        }
        console.error(err);
        return null;
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
    errorCode,
    successMessage,
  };
}
