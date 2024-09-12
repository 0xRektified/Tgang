import axios from "axios";
import axiosInstance from "../api/axiosConfig";

export function useMultiplayer() {
  const searchPlayer = async () => {
    const response = await axiosInstance.get(`/multiplayer/search`);
    return response.data;
  };

  const startFight = async (userId: string, opponentId: string) => {
    const response = await axiosInstance.post("/multiplayer/fight", {
      userId,
      opponentId,
    });
    return response.data;
  };

  const enablePvp = async () => {
    const response = await axiosInstance.post("/multiplayer/enable-pvp");
    return response.data;
  };

  return { searchPlayer, startFight, enablePvp };
}
