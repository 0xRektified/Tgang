import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { IMarketInfo } from "../components/interfaces/market.interface";

export function useMarketData(externalSetters?: {
  setMarketInfo?: React.Dispatch<React.SetStateAction<IMarketInfo | undefined>>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [marketInfo, setMarketInfoInternal] = useState<IMarketInfo | undefined>(
    undefined
  );
  const [loading, setLoadingInternal] = useState<boolean>(true);
  const [error, setErrorInternal] = useState<string | null>(null);

  const setMarketInfo = externalSetters?.setMarketInfo || setMarketInfoInternal;
  const setLoading = externalSetters?.setLoading || setLoadingInternal;
  const setError = externalSetters?.setError || setErrorInternal;

  useEffect(() => {
    const getMarketInfo = async () => {
      try {
        const marketResponse = await axiosInstance.get<IMarketInfo>(
          `/markets/NY`
        );
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

  return { marketInfo, setMarketInfo, loading, error };
}
