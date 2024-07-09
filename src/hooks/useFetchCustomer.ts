import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import { ICustomerInfo } from "../components/interfaces/customer.interface";
import { Product } from "../components/interfaces/user.interface";
import { marketId } from "../mocks/backend.mock";
import { getIndexFromTimeStamp, useCustomerIndex } from "./useCustomerIndex";

const emojis = ["👨🏿", "👴🏻", "👩🏽", "👩‍🦳"];

export type ProductName = "Weed" | "Coke" | "Meth";

export function useFetchCustomer(externalSetters?: {
  setCustomers?: React.Dispatch<React.SetStateAction<ICustomerInfo[]>>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  let { customerIndex, setCustomerIndex } = useCustomerIndex();
  const [customers, setCustomersInternal] = useState<ICustomerInfo[]>([]);
  const [loading, setLoadingInternal] = useState<boolean>(true);
  const [error, setErrorInternal] = useState<string | null>(null);

  const setCustomers = externalSetters?.setCustomers || setCustomersInternal;
  const setLoading = externalSetters?.setLoading || setLoadingInternal;
  const setError = externalSetters?.setError || setErrorInternal;
  useEffect(() => {
    const getFetchCustomer = async () => {
      if (!customerIndex) {
        customerIndex = getIndexFromTimeStamp(new Date());
        setCustomerIndex(customerIndex);
      }

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
