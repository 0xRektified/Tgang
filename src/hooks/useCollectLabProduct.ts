import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import {
  IUserInfo,
  LabPlot,
  Product,
} from "../components/interfaces/user.interface";

export function useCollectLabProduct() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const collectLabProduct = async (
    plotId: number,
    setCashAmount: React.Dispatch<React.SetStateAction<number>>,
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
    setLabPlots: React.Dispatch<React.SetStateAction<LabPlot[]>>,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo | undefined>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post<IUserInfo>(`/labs/${plotId}/collect`);
      const newUserInfo = data;
      const newCashAmount = newUserInfo.cashAmount;

      setCashAmount(newCashAmount);
      setProducts(data.products);
      setLabPlots(data.labPlots);

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

  return { collectLabProduct, loading, error };
}
