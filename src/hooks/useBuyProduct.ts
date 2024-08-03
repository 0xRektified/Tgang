import { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo, Product } from "../components/interfaces/user.interface";

const useBuyProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buyProduct = async (
    marketId: string,
    productName: string,
    quantity: number,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<IUserInfo>(
        `/markets/${marketId}/buy`,
        {
          product: productName,
          quantity,
        }
      );
      setUserInfo(response.data);
      return true; // Indicate success
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        setError(message);
      } else {
        setError("An unexpected error occurred");
      }
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  return { buyProduct, loading, error };
};

export default useBuyProduct;
