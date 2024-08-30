import { useEffect, useRef, useState } from "react";

export const useBatchSell = (
  marketId: string,
  handleSell: (
    marketId: string,
    batch: { product: string; customers: number }[]
  ) => Promise<void>
) => {
  const [batch, setBatch] = useState<Map<string, number>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerTrigger = 2000;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (batch.size > 0) {
        sendBatch();
      }
    }, timerTrigger);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [batch]);

  const sendBatch = async () => {
    if (batch.size === 0) return;
    const batchArray = Array.from(batch, ([product, customers]) => ({
      product,
      customers,
    }));
    setBatch(new Map());
    await handleSell(marketId, batchArray);
  };

  const addToBatch = (product: string) => {
    setBatch((prevBatch) => {
      const newBatch = new Map(prevBatch);
      if (newBatch.has(product)) {
        newBatch.set(product, newBatch.get(product)! + 1);
      } else {
        newBatch.set(product, 1);
      }
      return newBatch;
    });
  };

  return { addToBatch };
};
