import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import {
  EDealerUpgrade,
  EUpgradeCategory,
} from "../components/interfaces/upgrade.interface";
import { IUserInfo } from "../components/interfaces/user.interface";
import { EProduct } from "../components/interfaces/product.interface";
import { IMarketInfo } from "../components/interfaces/market.interface";

export function useBuyUpgrades() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const buyUpgrade = async (
    params: {
      category: EUpgradeCategory;
      upgrade: EProduct | EDealerUpgrade;
    },
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>,
    setMarketInfo: React.Dispatch<React.SetStateAction<IMarketInfo | undefined>>
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axiosInstance.post(`/upgrades/buy`, {
        category: params.category,
        upgrade: params.upgrade,
      });
      const { user: newUserInfo, market: newMarketInfo } = response.data;
      setUserInfo(newUserInfo);
      setMarketInfo(newMarketInfo);
      setSuccessMessage("Upgrade purchased successfully.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        setError(message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { buyUpgrade, loading, error, successMessage };
}