import { useState, useEffect } from "react";
import { useAuthAndFetchUserData } from "./useAuthAndFetchUserData";
import { useFetchUpgrades } from "./useFetchUpgrades";
import { useFetchCustomer } from "./useFetchCustomer";
import { useMarketData } from "./useMarketData";
import { IUserInfo, Product } from "../components/interfaces/user.interface";
import { IUpgradesCategory } from "../components/interfaces/upgrade.interface";
import { ICustomerInfo } from "../components/interfaces/customer.interface";
import { IMarketInfo } from "../components/interfaces/market.interface";

export function useInitializeGame() {
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined);
  const [upgrades, setUpgrades] = useState<IUpgradesCategory[] | undefined>(
    undefined
  );
  const [customers, setCustomers] = useState<ICustomerInfo[]>([]);
  const [marketInfo, setMarketInfo] = useState<IMarketInfo | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    userInfo: fetchedUserInfo,
    setUserInfo: setFetchedUserInfo,
    loading: authLoading,
    error: authError,
  } = useAuthAndFetchUserData(setCashAmount, setProducts);
  const {
    upgrades: fetchedUpgrades,
    setUpgrades: setFetchedUpgrades,
    loading: upgradesLoading,
    error: upgradesError,
  } = useFetchUpgrades(fetchedUserInfo);
  const {
    customers: fetchedCustomers,
    setCustomers: setFetchedCustomers,
    loading: customersLoading,
    error: customersError,
  } = useFetchCustomer();
  const {
    marketInfo: fetchedMarketInfo,
    loading: marketLoading,
    error: marketError,
  } = useMarketData();

  useEffect(() => {
    const initializeGame = async () => {
      try {
        setLoading(true);
        setError(null);

        if (authError) {
          throw new Error(authError);
        }
        if (upgradesError) {
          throw new Error(upgradesError);
        }
        if (customersError) {
          throw new Error(customersError);
        }
        if (marketError) {
          throw new Error(marketError);
        }

        setUserInfo(fetchedUserInfo);
        setUpgrades(fetchedUpgrades);
        setCustomers(fetchedCustomers);
        setMarketInfo(fetchedMarketInfo);
      } catch (error) {
        setError("Failed to initialize game");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initializeGame();
  }, [authLoading, upgradesLoading, customersLoading, marketLoading]);

  return {
    cashAmount,
    products,
    userInfo,
    upgrades,
    customers,
    marketInfo,
    setUserInfo: setFetchedUserInfo,
    setProducts,
    setUpgrades: setFetchedUpgrades,
    setCustomers: setFetchedCustomers,
    setCashAmount,
    setMarketInfo,
    loading,
    error,
  };
}
