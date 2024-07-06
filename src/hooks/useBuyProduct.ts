import { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";
import { Product } from "../components/interfaces/user.interface";

interface BuyProductResponse {
  user: {
    cashAmount: number;
    products: Product[];
    reputation: number;
  };
}

const useBuyProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buyProduct = async (
    marketId: string,
    productName: string,
    quantity: number,
    setCashAmount: React.Dispatch<React.SetStateAction<number>>,
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<BuyProductResponse>(
        `/products/${marketId}/buy`,
        {
          product: productName,
          quantity,
        }
      );
      const { user } = response.data;
      setCashAmount(user.cashAmount);
      setProducts(user.products);
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

  return { buyProduct, loading, error };
};

export default useBuyProduct;
