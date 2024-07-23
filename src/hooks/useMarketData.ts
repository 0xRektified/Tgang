import { useState, useCallback, useEffect } from "react";
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

  useEffect(() => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Calculate time until the next full hour
    const timeUntilNextHour =
      (60 - minutes - 1) * 60 * 1000 + (60 - seconds) * 1000 - milliseconds;

    console.log("Time until next hour:", timeUntilNextHour);

    const fetchAtNextFullHour = () => {
      // Fetch data immediately at the next full hour
      fetchMarketData();

      // Set an interval to fetch data every hour thereafter
      const interval = setInterval(fetchMarketData, 60 * 60 * 1000);

      return () => clearInterval(interval);
    };

    // Set a timeout to fetch data at the next full hour
    const timeout = setTimeout(fetchAtNextFullHour, timeUntilNextHour);

    // Cleanup on unmount
    return () => clearTimeout(timeout);
  }, [fetchMarketData]);

  return { marketInfo, setMarketInfo, loading, error, fetchMarketData };
}
