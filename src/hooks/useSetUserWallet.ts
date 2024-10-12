import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";

export function useSetUserWallet() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const setWallet = async (
    tonWalletAddress: string,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>,
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { data } = await axiosInstance.post<IUserInfo>(`/users/wallet`, {
        tonWalletAddress,
      });
      setError(null);
      const newUserInfo = data;
      setUserInfo(newUserInfo);
      setSuccessMessage("wallet connected successfully!");
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

  return { setWallet, loading, error, successMessage };
}
