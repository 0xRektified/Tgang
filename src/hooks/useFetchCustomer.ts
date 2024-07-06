import { useState, useEffect } from "react";
import { customerList } from "../mocks/backend.mock";

const emojis = ["👨🏿", "👴🏻", "👩🏽", "👩‍🦳"];

export type ProductName = "Weed" | "Coke" | "Meth";
interface Customer {
  [key: string]: {
    quantity: number;
    emoji: string;
  };
}

export function useFetchCustomer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFetchCustomer = () => {
      try {
        const customersWithDetails: Customer[] = customerList.map(
          (customer) => {
            const productName = Object.keys(customer)[0] as ProductName;
            const quantity = customer[productName];

            if (quantity !== undefined) {
              return {
                [productName]: {
                  quantity,
                  emoji: emojis[Math.floor(Math.random() * emojis.length)],
                },
              };
            } else {
              throw new Error("Invalid customer data: quantity is undefined");
            }
          }
        );

        setCustomers(customersWithDetails);
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
