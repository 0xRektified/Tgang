import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";

export function useUpgradeLabCapacity() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const upgradeLabCapacity = async (
    plotId: number,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.put<IUserInfo>(
        `/labs/${plotId}/capacity`
      );
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

  return { upgradeLabCapacity, loading, error };
}
