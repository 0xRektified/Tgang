import { useEffect, useCallback, useState, useRef } from "react";
import { IUserInfo } from "../components/interfaces/user.interface";
import axiosInstance from "../api/axiosConfig";
import { getUnixTime } from "date-fns";
import mixpanel from "mixpanel-browser";

const useCustomerManagement = (initialUserInfo: IUserInfo) => {
  const [userInfo, setUserInfo] = useState<IUserInfo>(initialUserInfo);
  const lastUpdateTimeRef = useRef(getUnixTime(new Date()));
  console.log("userInfo in useCustomerManagement", userInfo);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = getUnixTime(new Date());
      const diff = now - lastUpdateTimeRef.current;
      
      setUserInfo((prevUserInfo) => {
        const newCustomersFloat = (diff / 3600) * prevUserInfo.customerAmountMax;
        console.log("newCustomersFloat", newCustomersFloat);  
        const newCustomers = Math.floor(newCustomersFloat);
        console.log("newCustomers", newCustomers);
        
        if (newCustomers > 0) {
          lastUpdateTimeRef.current = now - ((newCustomersFloat - newCustomers) * 3600 / prevUserInfo.customerAmountMax);
          
          const customerAmount = Math.min(
            prevUserInfo.customerAmountRemaining + newCustomers,
            prevUserInfo.customerAmountMax
          );
          console.log("customerAmount", customerAmount);
          return {
            ...prevUserInfo,
            customerAmount,
            customerAmountRemaining: customerAmount,
          };
        }
        
        return prevUserInfo;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);

  const decreaseCustomer = useCallback(() => {
    setUserInfo((prevUser) => {
      const customerAmount =
        prevUser.customerAmount - 1 < 0 ? 0 : prevUser.customerAmount - 1;
      const customerAmountRemaining =
        prevUser.customerAmountRemaining - 1 < 0
          ? 0
          : prevUser.customerAmountRemaining - 1;
      return {
        ...prevUser,
        customerAmount,
        customerAmountRemaining,
      };
    });
  }, []);

  const fetchuser = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get<IUserInfo>(`/users`);
      setUserInfo(data);
    } catch (error: any) {
      console.error("Failed to fetch user");
    }
  }, []);

  const handleSell = async (
    marketId: string,
    batch: { product: string; customers: number }[],
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

  return { userInfo, setUserInfo, decreaseCustomer, handleSell };
};

export default useCustomerManagement;
