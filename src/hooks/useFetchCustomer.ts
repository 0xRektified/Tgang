import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { ICustomerInfo } from "../components/interfaces/customer.interface";
import { marketId } from "../mocks/backend.mock";
import { getIndexFromTimeStamp, useCustomerIndex } from "./useCustomerIndex";

const emojis = ["👨🏿", "👴🏻", "👩🏽", "👩‍🦳"];

export type ProductName = "Weed" | "Coke" | "Meth";

export function useFetchCustomer() {
  let { customerIndex, setCustomerIndex } = useCustomerIndex();
  const [customers, setCustomers] = useState<ICustomerInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFetchCustomer = async () => {
      if (!customerIndex) {
        customerIndex = getIndexFromTimeStamp(new Date());
        setCustomerIndex(customerIndex);
      };

      try {
        const customerListResponse = await axiosInstance.get(
          `/customers/${marketId}/${customerIndex}`
        );
        if (customerListResponse.data) {
          const customersWithDetails: ICustomerInfo[] =
            customerListResponse.data.map((customer: ICustomerInfo) => ({
              ...customer,
              emoji: emojis[Math.floor(Math.random() * emojis.length)],
            }));

          setCustomers(customersWithDetails);
          setCustomerIndex(customerIndex + 1);
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
