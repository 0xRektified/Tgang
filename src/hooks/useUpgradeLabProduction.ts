import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";

export function useUpgradeLabProduction() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const upgradeLabProduction = async (
    plotId: number,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { data } = await axiosInstance.put<IUserInfo>(
        `/labs/${plotId}/production`
      );
      const newUserInfo = data;
      setUserInfo(newUserInfo);
      setSuccessMessage("Lab production upgraded successfully!");
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

  return { upgradeLabProduction, loading, error, successMessage };
}
