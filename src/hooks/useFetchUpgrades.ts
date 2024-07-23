import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUpgrade } from "../components/interfaces/upgrade.interface";
import { IUserInfo } from "../components/interfaces/user.interface";

export function useFetchUpgrades(userInfo: IUserInfo | null) {
  const [upgrades, setUpgrades] = useState<IUpgrade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpgrades = useCallback(async () => {
    try {
      setLoading(true);
      const upgradesResponse = await axiosInstance.get<IUpgrade[]>(`/upgrades`);

      let updatedUpgrades = upgradesResponse.data;

      setUpgrades(updatedUpgrades);
      return { upgrades: updatedUpgrades };
    } catch (error) {
      setError("Failed to fetch upgrades data");
      return { upgrades: [] };
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  return { upgrades, setUpgrades, loading, error, fetchUpgrades };
}
