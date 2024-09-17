import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { ILab } from "../components/interfaces/lab.interface";
import { EProduct } from "../components/interfaces/product.interface";

export function useFetchLabs() {
  const [labs, setLabs] = useState<Record<EProduct, ILab>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLabs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get<Record<EProduct, ILab>>(
        `/labs`
      );

      setLabs(data);
      return { labs: data };
    } catch (error) {
      console.error("Failed to fetch upgrades data:", error);
      setError("Failed to fetch upgrades data");
      return { upgrades: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  return { labs, setLabs, loading, error, fetchLabs };
}
