import { useEffect, Dispatch, SetStateAction, useCallback } from "react";
import { IUserInfo } from "../components/interfaces/user.interface";
import axiosInstance from "../api/axiosConfig";
import { getUnixTime } from "date-fns";
import mixpanel from "mixpanel-browser";
import { AxiosError } from "axios";

const useCustomerManagement = (
  setUserInfo: Dispatch<SetStateAction<IUserInfo>>
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setUserInfo((prevUserInfo) => {
        const now = new Date();
        const diff = getUnixTime(now) - getUnixTime(new Date(prevUserInfo.lastSell));
  
        const newCustomers = Math.floor(
          (diff / 3600) * prevUserInfo.customerAmountMax
        );
        let customerAmount = Math.min(
          prevUserInfo.customerAmountRemaining + newCustomers,
          prevUserInfo.customerAmountMax
        );
  
        if (customerAmount < 0) {
          customerAmount = 0;
        }

        if (customerAmount < prevUserInfo.customerAmountMax) {
          return { ...prevUserInfo, customerAmount };
        }
        
        return prevUserInfo;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);

  const fetchuser = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get<IUserInfo>(`/users`);;
      setUserInfo(data);
    } catch (error: any) {
      console.error("Failed to fetch user");
    }
  }, []);

  const handleSell = async (
    marketId: string,
    batch: { product: string; customers: number }[]
  ) => {
    try {
      const response = await axiosInstance.post(`/markets/${marketId}/sell`, {
        batch,
      });
      // @note There is still a small diff between server and client causing a +/- 1 customer
      setUserInfo(response.data);
    } catch (error: any) {
      console.error("Failed to sell products", error?.response?.data?.message);
      mixpanel.track("Failed to sell products", {
        error: error?.response?.data?.message || error.message,
        code: error.status,
      });
      fetchuser();
    }
  };

  return { handleSell };
};

export default useCustomerManagement;
