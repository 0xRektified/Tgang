import { useState } from "react"; // Import useState
import axios from "axios";
import axiosInstance from "../api/axiosConfig";

export function useMultiplayer() {
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  const searchPlayer = async () => {
    setLoading(true); // Set loading to true
    setError(null); // Reset error state
    try {
      const response = await axiosInstance.get(`/multiplayer/search`);
      return response.data;
    } catch (err) {
      setError("Failed to search player"); // Set error message
      return null; // Return null on error
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const startFight = async (userId: string, opponentId: string) => {
    setLoading(true); // Set loading to true
    setError(null); // Reset error state
    try {
      const response = await axiosInstance.post("/multiplayer/fight", {
        userId,
        opponentId,
      });
      return response.data;
    } catch (err) {
      setError("Failed to start fight"); // Set error message
      return null; // Return null on error
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const enablePvp = async () => {
    setLoading(true); // Set loading to true
    setError(null); // Reset error state
    try {
      const response = await axiosInstance.post("/multiplayer/enable-pvp");
      return response.data;
    } catch (err) {
      setError("Failed to enable PvP"); // Set error message
      return null; // Return null on error
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return { searchPlayer, startFight, enablePvp, loading, error }; // Return loading and error states
}
