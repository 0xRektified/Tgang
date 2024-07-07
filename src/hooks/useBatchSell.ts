import { useEffect, useRef, useState } from "react";
import useSellProduct from "./useSellProduct";
import {
  ICustomerInfo,
  ICustomerSellRequest,
} from "../components/interfaces/customer.interface";
import { Product } from "../components/interfaces/user.interface";
import { EProduct } from "../components/interfaces/product.interface";

const useBatchSell = (
  marketId: string,
  setCashAmount: React.Dispatch<React.SetStateAction<number>>,
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  const [batch, setBatch] = useState<ICustomerSellRequest[]>([]);
  const { sellProduct, loading, error } = useSellProduct();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const timerTrigger = 2000;
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

  const sendBatch = async () => {
    if (batch.length === 0) return;
    try {
      await sellProduct(marketId, batch, setCashAmount, setProducts);
      setBatch([]);
    } catch (error) {
      console.error("Failed to send batch", error);
    }
  };

  const addToBatch = (customer: ICustomerInfo) => {
    const customerBatchDto: ICustomerSellRequest = {
      product: customer.product.name as EProduct,
      quantity: customer.quantity,
      customerIndex: customer.customerIndex,
    };
    setBatch((prevBatch) => [...prevBatch, customerBatchDto]);
  };

  return { addToBatch, loading, error };
};

export default useBatchSell;
