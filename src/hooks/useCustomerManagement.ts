import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { getRandomEmoji } from "../components/home/CustomersBoard";
import { Transaction } from "../components/home/utils/types";
import { EDealerUpgrade } from "../components/interfaces/upgrade.interface";
import { IUserInfo } from "../components/interfaces/user.interface";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";

const useCustomerManagement = (
  userInfo: IUserInfo,
  setUserInfo: Dispatch<SetStateAction<IUserInfo>>
) => {
  const [customers, setCustomers] = useState<string[]>(() => {
    const initialCustomers = Math.max(0, userInfo.customerAmount);
    return Array(initialCustomers)
      .fill(null)
      .map(() => getRandomEmoji());
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCustomers((prevCustomers) => {
        const { customersPerSecond, customerAmountMax } =
          calculateCustomersPerSecond(userInfo);
        const newCustomerCount = Math.floor(customersPerSecond);
        if (prevCustomers.length < customerAmountMax && newCustomerCount > 0) {
          const newCustomers = Array(newCustomerCount)
            .fill(null)
            .map(() => getRandomEmoji());
          return [...prevCustomers, ...newCustomers].slice(
            0,
            customerAmountMax
          );
        }
        return prevCustomers;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [userInfo.upgrades]);

  const calculateCustomersPerSecond = (
    userInfo: IUserInfo
  ): { customersPerSecond: number; customerAmountMax: number } => {
    const customerAmountUpgrade = userInfo.upgrades.find(
      (e) => e.id === EDealerUpgrade.CUSTOMER_AMOUNT
    );
    if (!customerAmountUpgrade) {
      return { customersPerSecond: 0, customerAmountMax: 0 };
    }
    const customerAmountMax =
      customerAmountUpgrade.value[customerAmountUpgrade.level];
    const customersPerSecond = customerAmountMax / 3600;
    return { customersPerSecond, customerAmountMax };
  };

  const handleSell = async (
    marketId: string,
    batch: { product: string; amountToSell: number }[]
  ) => {
    try {
      const response = await axiosInstance.post(`/products/${marketId}/sell`, {
        batch,
      });
      setUserInfo(response.data);
      setCustomers((prevCustomers) => {
        const newCustomerCount =
          response.data.customerAmount - prevCustomers.length;
        if (newCustomerCount > 0) {
          const newCustomers = Array(newCustomerCount)
            .fill(null)
            .map(() => getRandomEmoji());
          return [...prevCustomers, ...newCustomers];
        }
        return prevCustomers.slice(0, response.data.customerAmount);
      });
    } catch (error) {
      console.error("Failed to sell products", error);
    }
  };

  return { customers, setCustomers, handleSell };
};

export default useCustomerManagement;
