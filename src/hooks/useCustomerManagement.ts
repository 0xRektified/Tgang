import { useEffect, Dispatch, SetStateAction } from "react";
import { IUserInfo } from "../components/interfaces/user.interface";
import axiosInstance from "../api/axiosConfig";
import { getUnixTime } from "date-fns";

const useCustomerManagement = (
  userInfo: IUserInfo,
  setUserInfo: Dispatch<SetStateAction<IUserInfo>>
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = getUnixTime(now) - getUnixTime(new Date(userInfo.lastSell));

      const newCustomers = Math.floor(
        (diff / 3600) * userInfo.customerAmountMax
      );
      const customerAmount = Math.min(
        userInfo.customerAmountRemaining + newCustomers,
        userInfo.customerAmountMax
      );
      console.log(`useCustomerManagement interval newCustomers`, newCustomers);
      console.log(
        `useCustomerManagement interval customerAmount`,
        customerAmount
      );
      // @note If max value is reach do not sync, it put less update on the state
      // and avoid bug where total customer is flipping to max during a sell
      if (customerAmount < userInfo.customerAmountMax) {
        setUserInfo({ ...userInfo, customerAmount });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [userInfo]);

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
    } catch (error) {
      console.error("Failed to sell products", error);
    }
  };

  return { handleSell };
};

export default useCustomerManagement;
