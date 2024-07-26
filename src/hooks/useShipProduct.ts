import { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";
import { EProduct } from "../components/interfaces/product.interface";
import { EShippingMethod } from "../components/interfaces/shipping.interface";

const useShipProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const shipProduct = async (
    marketId: string,
    batch: {
      shippingMethod: EShippingMethod;
      product: EProduct;
      amount: number;
    },
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<IUserInfo>(
        `/shipping/${marketId}/ship`,
        {
          ...batch,
        }
      );
      setUserInfo(response.data);
      return true; // Indicate success
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  return { shipProduct, loading, error };
};

export default useShipProduct;
