import { useState, useEffect } from "react";
import { startOfMinute, getUnixTime } from "date-fns";

const emojis = ["👨🏿", "👴🏻", "👩🏽", "👩‍🦳"];

export type ProductName = "Weed" | "Coke" | "Meth";

export function getIndexFromTimeStamp(timestamp: Date) {
  const roundedTimestamp = startOfMinute(timestamp);
  return getUnixTime(roundedTimestamp) / 60;
}

export function useCustomerIndex() {
  const [customerIndex, setCustomerIndex] = useState<number>();

  useEffect(() => {
    const getCustomerIndex = async () => {
      const index = getIndexFromTimeStamp(new Date());
      setCustomerIndex(index);
    };

    getCustomerIndex();
  }, []);

  return { customerIndex, setCustomerIndex };
}
