import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { IMarketInfo } from "../components/interfaces/market.interface";

export function useMarketData() {
  const [marketInfo, setMarketInfo] = useState<IMarketInfo | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      const marketResponse = await axiosInstance.get<IMarketInfo>(
        `/markets/NY`
      );
      setMarketInfo(marketResponse.data);
      return { marketInfo: marketResponse.data };
    } catch (error) {
      console.error("Failed to fetch market data:", error);
      setError("Failed to fetch market data");
      return { marketInfo: undefined };
    } finally {
      setLoading(false);
    }
  }, []);

  return { marketInfo, setMarketInfo, loading, error, fetchMarketData };
}
