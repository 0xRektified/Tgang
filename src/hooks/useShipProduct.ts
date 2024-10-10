import { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";
import { EProduct } from "../components/interfaces/product.interface";
import { EShippingMethod } from "../components/interfaces/shipping.interface";

const useShipProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const shipProduct = async (
    marketId: string,
    batch: {
      shippingMethod: EShippingMethod;
      product: EProduct;
      amount: number;
    },
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axiosInstance.post<IUserInfo>(
        `/shipping/${marketId}/ship`,
        {
          ...batch,
        }
      );
      setUserInfo(response.data);
      setSuccessMessage(`Successfully shipped ${batch.amount} ${batch.product}(s) using ${batch.shippingMethod}.`);
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

  return { shipProduct, loading, error, successMessage };
};

export default useShipProduct;
