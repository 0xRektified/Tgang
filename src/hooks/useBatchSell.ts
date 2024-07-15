import { useEffect, useRef, useState } from "react";
import useSellProduct from "./useSellProduct";
import { IUserInfo, Product } from "../components/interfaces/user.interface";
import { ICustomerInfo } from "../components/interfaces/customer.interface";

type BatchMap = Map<string, number>;

const useBatchSell = (
  marketId: string,
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
) => {
  const [batch, setBatch] = useState<BatchMap>(new Map());
  const { sellProduct, loading, error } = useSellProduct();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const timerTrigger = 2000;
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    if (batch.size === 0) return;

    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (batch.size >= 50) {
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

  const sendBatch = async () => {
    if (batch.size === 0) return;
    try {
      const batchArray = Array.from(batch, ([product, amountToSell]) => ({
        product,
        amountToSell,
      }));
      await sellProduct(marketId, batchArray, setUserInfo);
      setBatch(new Map());
    } catch (error) {
      console.error("Failed to send batch", error);
    }
  };

  const addToBatch = (product: string, amountToSell: number) => {
    setBatch((prevBatch) => {
      const newBatch = new Map(prevBatch);
      if (newBatch.has(product)) {
        newBatch.set(product, newBatch.get(product)! + amountToSell);
      } else {
        newBatch.set(product, amountToSell);
      }
      return newBatch;
    });
  };

  return { addToBatch, loading, error };
};

export default useBatchSell;
