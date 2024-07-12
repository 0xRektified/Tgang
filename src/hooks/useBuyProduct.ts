import { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";
import { Product } from "../components/interfaces/user.interface";

interface BuyProductResponse {
  carryingGear: any[];
  cashAmount: number;
  carryAmount: number;
  id: number;
  products: Product[];
  reputation: number;
  username: string;
}

const useBuyProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buyProduct = async (
    marketId: string,
    productName: string,
    quantity: number,
    setCashAmount: React.Dispatch<React.SetStateAction<number>>,
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
    setCarryAmount: React.Dispatch<React.SetStateAction<number>>
  ): Promise<boolean> => {
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
      setCashAmount(response.data.cashAmount);
      setProducts(response.data.products);
      setCarryAmount(response.data.carryAmount);
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

  return { buyProduct, loading, error };
};

export default useBuyProduct;
