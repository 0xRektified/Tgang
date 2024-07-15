import { useEffect, useRef, useState } from "react";

export const useBatchSell = (
  marketId: string,
  handleSell: (
    marketId: string,
    batch: { product: string; amountToSell: number }[]
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
    const batchArray = Array.from(batch, ([product, amountToSell]) => ({
      product,
      amountToSell,
    }));
    setBatch(new Map());
    await handleSell(marketId, batchArray);
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

  return { addToBatch };
};
