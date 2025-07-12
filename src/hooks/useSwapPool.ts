import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";

export interface SwapRequest {
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  minAmountOut: number;
}

export interface SwapResponse {
  success: boolean;
  message: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  amountOut: number;
  newPrice: number;
}

export function useSwapPool() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const swap = async (
    swapRequest: SwapRequest,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ): Promise<SwapResponse | null> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axiosInstance.post(`/pools/swap`, swapRequest);
      const swapResult: SwapResponse = response.data.swap;
      const updatedUser: IUserInfo = response.data.user;
      
      setUserInfo(updatedUser);
      setSuccessMessage(swapResult.message);
      return swapResult;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        setError(message);
      } else {
        setError("An unexpected error occurred");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { swap, loading, error, successMessage };
}