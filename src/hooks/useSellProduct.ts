import { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";
import { Product } from "../components/interfaces/user.interface";

const useSellProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sellProduct = async (
    marketId: string,
    customers: number[],
    setCashAmount: React.Dispatch<React.SetStateAction<number>>,
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `/products/${marketId}/sell`,
        customers
      );
      setCashAmount(response.data.cashAmount);
      setProducts(response.data.products);
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

  return { sellProduct, loading, error };
};

export default useSellProduct;
