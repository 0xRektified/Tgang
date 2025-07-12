import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";

export interface Pool {
  id: string;
  cash: {
    name: string;
    reserve: number;
  };
  product: {
    name: string;
    reserve: number;
  };
  feePercent: number;
}

export function useFetchPools() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = async (): Promise<Pool[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/pools`);
      const poolsData = response.data;
      setPools(poolsData);
      return poolsData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        setError(message);
      } else {
        setError("An unexpected error occurred");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { pools, setPools, loading, error, fetchPools };
}