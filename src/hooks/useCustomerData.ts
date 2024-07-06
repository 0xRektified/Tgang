import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { ICustomerInfo } from "../components/interfaces/customer.interface";

export function useCustomerData() {
  const [customerInfo, setCustomerInfo] = useState<ICustomerInfo[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMarketInfo = async () => {
      try {
        const marketResponse = await axiosInstance.get<ICustomerInfo[]>(`/customers/NY`);
        setCustomerInfo(marketResponse.data);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setError("Failed to fetch market data");
      } finally {
        setLoading(false);
      }
    };

    getMarketInfo();
  }, []);

  return { customerInfo, loading, error };
}
