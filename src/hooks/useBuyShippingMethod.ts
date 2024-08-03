import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";
import { EShippingMethod } from "../components/interfaces/shipping.interface";

export function useBuyShippingMethod() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const buyShippingMethod = async (
    method: EShippingMethod,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axiosInstance.post(`/shipping/${method}/buy`);
      const newUserInfo = response.data as IUserInfo;
      setUserInfo(newUserInfo);
      setSuccessMessage("Shipping method purchased successfully.");
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

  return { buyShippingMethod, loading, error, successMessage };
}
