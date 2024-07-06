import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { IMarketInfo } from "../components/interfaces/market.interface";

export function useMarketData() {
  const [marketInfo, setMarketInfo] = useState<IMarketInfo | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMarketInfo = async () => {
      try {
        const marketResponse = await axiosInstance.get<IMarketInfo>(`/markets/NY`);
        setMarketInfo(marketResponse.data);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setError("Failed to fetch market data");
      } finally {
        setLoading(false);
      }
    };

    getMarketInfo();
  }, []);

  return { marketInfo, loading, error };
}
