import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";
import { EShippingMethod } from "../components/interfaces/shipping.interface";

export function useUpgradeShippingCapacity() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const upgradeShippingCapacity = async (
    method: EShippingMethod,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>,
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { data } = await axiosInstance.put<IUserInfo>(
        `/shipping/${method}/capacity`,
      );
      setError(null);
      const newUserInfo = data;
      setUserInfo(newUserInfo);
      setSuccessMessage("Shipping capacity upgraded successfully!");
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

  return { upgradeShippingCapacity, loading, error, successMessage };
}
