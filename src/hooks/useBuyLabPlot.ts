import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import {
  IUserInfo,
  LabPlot,
} from "../components/interfaces/user.interface";
import { IBuyLab } from "../components/interfaces/lab.interface";

export function useBuyLabPlot() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buyLabPlot = async (
    setCashAmount: React.Dispatch<React.SetStateAction<number>>,
    setLabPlots: React.Dispatch<
      React.SetStateAction<LabPlot[]>
    >,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo | undefined>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post<IUserInfo>(`/labs/buy-plot`);
      const newUserInfo = data;
      const newCashAmount = newUserInfo.cashAmount;
      const updatedUpgrades = newUserInfo.upgrades;

      setCashAmount(newCashAmount);

      setLabPlots((prevPlots) => {
        if (!prevPlots) return prevPlots;
        return newUserInfo.labPlots;
      });

      setUserInfo((prevUserInfo) => {
        if (!prevUserInfo) return newUserInfo;

        const updatedUserInfo = {
          ...prevUserInfo,
          cashAmount: newUserInfo.cashAmount,
          labPlots: newUserInfo.labPlots,
        };
        return updatedUserInfo;
      });
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

  return { buyLabPlot, loading, error };
}
