import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";

export function useCollectLabProduct() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const collectLabProduct = async (
    plotId: number,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post<IUserInfo>(
        `/labs/${plotId}/collect`
      );
      const newUserInfo = data;
      setUserInfo(newUserInfo);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        setError(message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { collectLabProduct, loading, error };
}
