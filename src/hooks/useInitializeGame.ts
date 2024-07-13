import { useState, useEffect, useCallback } from "react";
import { useAuthAndFetchUserData } from "./useAuthAndFetchUserData";
import { useFetchUpgrades } from "./useFetchUpgrades";
import { useFetchCustomer } from "./useFetchCustomer";
import { useMarketData } from "./useMarketData";
import { Product } from "../components/interfaces/user.interface";

export function useInitializeGame() {
  const [carryAmount, setCarryAmount] = useState<number>(0);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    userInfo: fetchedUserInfo,
    setUserInfo: setFetchedUserInfo,
    loading: authLoading,
    error: authError,
  } = useAuthAndFetchUserData(setCashAmount, setCarryAmount, setProducts);

  const {
    upgrades,
    setUpgrades,
    loading: upgradesLoading,
    error: upgradesError,
    fetchUpgrades,
  } = useFetchUpgrades(fetchedUserInfo);

  const {
    customers,
    setCustomers,
    loading: customersLoading,
    error: customersError,
    fetchCustomers,
    nbrOfUserInBatch,
  } = useFetchCustomer();

  const {
    marketInfo,
    setMarketInfo,
    loading: marketLoading,
    error: marketError,
    fetchMarketData,
  } = useMarketData();

  const initializeGame = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (authError) {
        throw new Error(authError);
      }

      if (!fetchedUserInfo) {
        throw new Error("User info is not available");
      }

      setFetchedUserInfo(fetchedUserInfo);

      const [upgradesData, customerData, marketData] = await Promise.all([
        fetchUpgrades(),
        fetchCustomers(),
        fetchMarketData(),
      ]);

      if (upgradesError || customersError || marketError) {
        throw new Error("Failed to fetch one or more game data");
      }

      setUpgrades(upgradesData?.upgrades || []);
      setCustomers(customerData?.customers || []);
      setMarketInfo(marketData?.marketInfo);

      console.log("setUserInfo (initializeGame):", fetchedUserInfo);
      console.log("setUpgrades:", upgradesData?.upgrades);
      console.log("setCustomers:", customerData?.customers);
      console.log("setMarketInfo:", marketData?.marketInfo);
    } catch (error) {
      setError("Failed to initialize game");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    authError,
    fetchedUserInfo,
    fetchUpgrades,
    fetchCustomers,
    fetchMarketData,
    setUpgrades,
    setCustomers,
    setMarketInfo,
  ]);

  useEffect(() => {
    if (!authLoading) {
      initializeGame();
    }
  }, [authLoading]);

  return {
    cashAmount,
    carryAmount,
    products,
    userInfo: fetchedUserInfo,
    upgrades,
    customers,
    marketInfo,
    nbrOfUserInBatch,
    setUserInfo: setFetchedUserInfo,
    setProducts,
    setUpgrades,
    setCustomers,
    setCashAmount,
    setCarryAmount,
    setMarketInfo,
    fetchCustomers,
    loading,
    error,
  };
}
