import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { EShippingMethod, IShippingMethod } from "../components/interfaces/shipping.interface";

export function useFetchShippingMethods() {
  const [shippingMethods, setShippingMethods] = useState<Record<EShippingMethod, IShippingMethod>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShippingMethods = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get<Record<EShippingMethod, IShippingMethod>>(`/shipping`);

      setShippingMethods(data);
      return { shippingMethods: data };
    } catch (error) {
      console.error("Failed to fetch upgrades data:", error);
      setError("Failed to fetch upgrades data");
      return { shippingMethods: undefined };
    } finally {
      setLoading(false);
    }
  }, []);

  return { shippingMethods, setShippingMethods, loading, error, fetchShippingMethods };
}
