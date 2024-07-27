import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";

export function useBuyLabPlot() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buyLabPlot = async (
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post<IUserInfo>(`/labs/buy-plot`);
      const newUserInfo = data;
      setUserInfo(newUserInfo);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { buyLabPlot, loading, error };
}
