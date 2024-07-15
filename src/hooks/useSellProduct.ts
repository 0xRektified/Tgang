import { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo, Product } from "../components/interfaces/user.interface";

const useSellProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const sellProduct = async (
    marketId: string,
    batch: { product: string; amountToSell: number }[],
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(`/products/${marketId}/sell`, {
        batch,
      });
      setUserInfo(response.data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { sellProduct, loading, error };
};

export default useSellProduct;
