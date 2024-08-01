import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";
import { IBuyLab } from "../components/interfaces/lab.interface";

export function useBuyLab() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const buyLab = async (
    lab: IBuyLab,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { data } = await axiosInstance.post<IUserInfo>(`/labs/buy`, {
        plotId: lab.plotId,
        labProduct: lab.labProduct,
      });
      const newUserInfo = data;
      setUserInfo(newUserInfo);
      setSuccessMessage("Lab purchased successfully.");
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

  return { buyLab, loading, error, successMessage };
}
