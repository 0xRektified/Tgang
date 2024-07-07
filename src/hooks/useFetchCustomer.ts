import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { ICustomerInfo } from "../components/interfaces/customer.interface";
import { marketId } from "../mocks/backend.mock";
import { startOfMinute, getUnixTime } from "date-fns";

const emojis = ["👨🏿", "👴🏻", "👩🏽", "👩‍🦳"];

export type ProductName = "Weed" | "Coke" | "Meth";

function getIndexFromTimeStamp(timestamp: Date) {
  const roundedTimestamp = startOfMinute(timestamp);
  return getUnixTime(roundedTimestamp) / 60;
}

export function useFetchCustomer() {
  const [customers, setCustomers] = useState<ICustomerInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFetchCustomer = async () => {
      try {
        const index = getIndexFromTimeStamp(new Date());
        const customerListResponse = await axiosInstance.get(
          `/customers/${marketId}/${index}`
        );
        if (customerListResponse.data) {
          const customersWithDetails: ICustomerInfo[] =
            customerListResponse.data.map((customer: ICustomerInfo) => ({
              ...customer,
              emoji: emojis[Math.floor(Math.random() * emojis.length)],
            }));

          setCustomers(customersWithDetails);
        }
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setError("Failed to fetch market data");
      } finally {
        setLoading(false);
      }
    };

    getFetchCustomer();
  }, []);

  return { customers, setCustomers, loading, error };
}
