import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";

export function useUpgradeLabCapacity() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const upgradeLabCapacity = async (
    plotId: number,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>,
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { data } = await axiosInstance.put<IUserInfo>(
        `/labs/${plotId}/capacity`,
      );
      const newUserInfo = data;
      setError(null);

      setUserInfo(newUserInfo);
      setSuccessMessage("Lab capacity upgraded successfully!");
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

  return { upgradeLabCapacity, loading, error, successMessage };
}
