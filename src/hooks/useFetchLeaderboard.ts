import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { Leaderboard } from "../components/interfaces/leaderboard.interface";

export function useFetchLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get<Leaderboard[]>(
        `/users/leaderboard`
      );

      setLeaderboard(data);
      return data;
    } catch (error) {
      setError("Failed to fetch leaderboard data");
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [leaderboard]);

  return { leaderboard, setLeaderboard, loading, error, fetchLeaderboard };
}
