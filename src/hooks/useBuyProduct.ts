import { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo, Product } from "../components/interfaces/user.interface";

const useBuyProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const buyProduct = async (
    marketId: string,
    productName: string,
    quantity: number,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axiosInstance.post<IUserInfo>(
        `/markets/${marketId}/buy`,
        {
          product: productName,
          quantity,
        }
      );
      setUserInfo(response.data);
      setSuccessMessage(`Successfully bought ${quantity} ${productName}(s).`);
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

  return { buyProduct, loading, error, successMessage };
};

export default useBuyProduct;
