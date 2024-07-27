import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import {
  EDealerUpgrade,
  EUpgradeCategory,
} from "../components/interfaces/upgrade.interface";
import {
  IUserInfo,
} from "../components/interfaces/user.interface";
import { EProduct } from "../components/interfaces/product.interface";

export function useBuyUpgrades() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buyUpgrade = async (
    params: {
      category: EUpgradeCategory;
      upgrade: EProduct | EDealerUpgrade;
    },
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(`/upgrades/buy`, {
        category: params.category,
        upgrade: params.upgrade,
      });
      const newUserInfo = response.data as IUserInfo;
      setUserInfo(newUserInfo);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { buyUpgrade, loading, error };
}
