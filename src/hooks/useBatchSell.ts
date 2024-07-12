import { useEffect, useRef, useState } from "react";
import useSellProduct from "./useSellProduct";
import { Product } from "../components/interfaces/user.interface";
import { ICustomerInfo } from "../components/interfaces/customer.interface";

const useBatchSell = (
  marketId: string,
  nbrOfUserInBatch: number,
  customers: ICustomerInfo[],
  setCashAmount: React.Dispatch<React.SetStateAction<number>>,
  setCarryAmount: React.Dispatch<React.SetStateAction<number>>,
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  fetchCustomers: () => Promise<
    | {
        customers: ICustomerInfo[];
      }
    | undefined
  >
) => {
  const [batch, setBatch] = useState<number[]>([]);
  const { sellProduct, loading, error } = useSellProduct();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const timerTrigger = 2000;
  const [isFetching, setIsFetching] = useState<boolean>(false);
  useEffect(() => {
    if (batch.length === 0) return;

    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (batch.length >= 50) {
      sendBatch();
    } else {
      timer.current = setTimeout(() => {
        sendBatch();
      }, timerTrigger);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [batch]);

  useEffect(() => {
    if (customers.length < nbrOfUserInBatch / 2 && !isFetching) {
      fetchMoreCustomers();
    }
  }, [customers.length, nbrOfUserInBatch, isFetching]);

  const fetchMoreCustomers = async () => {
    setIsFetching(true);
    try {
      await fetchCustomers();
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setIsFetching(false);
    }
  };

  const sendBatch = async () => {
    if (batch.length === 0) return;
    try {
      await sellProduct(marketId, batch, setCashAmount, setProducts, setCarryAmount);
      setBatch([]);
    } catch (error) {
      console.error("Failed to send batch", error);
    }
  };

  const addToBatch = (customerIndex: number) => {
    setBatch((prevBatch) => [...prevBatch, customerIndex]);
  };

  return { addToBatch, loading, error };
};

export default useBatchSell;
