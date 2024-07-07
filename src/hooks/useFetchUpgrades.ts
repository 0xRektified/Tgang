import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUpgrade } from "../components/shop/utils/types";

export function useFetchUpgrades() {
  const [upgrades, setUpgrades] = useState<IUpgrade[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUpgrades = async () => {
      try {
        const upgradesResponse = await axiosInstance.get<IUpgrade[]>(
          `/upgrades`
        );
        setUpgrades(upgradesResponse.data);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setError("Failed to fetch market data");
      } finally {
        setLoading(false);
      }
    };

    getUpgrades();
  }, []);

  return { upgrades, loading, error };
}
