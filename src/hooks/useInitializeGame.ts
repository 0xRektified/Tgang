import { useState, useEffect, useCallback } from "react";
import { useAuthAndFetchUserData } from "./useAuthAndFetchUserData";
import { useFetchUpgrades } from "./useFetchUpgrades";
import { useMarketData } from "./useMarketData";
import { IUserInfo } from "../components/interfaces/user.interface";
import { useFetchLabs } from "./useFetchLabs";
import { useFetchShippingMethods } from "./useFetchShippingMethods";

const defaultUserInfo: IUserInfo = {
  id: "",
  username: "",
  cashAmount: 1000,
  products: [],
  shipping: [],
  labPlots: [],
  labPlotPrice: 0,
  referralToken: "",
  upgrades: [],
  referredUsers: [],
  lastSell: new Date(),
  customerAmount: 100,
  customerAmountRemaining: 0,
  customerAmountMax: 1000,
  dealerUpgrades: [],
  robberyStrike: 0,
  nextShipment: new Date(),
  reputation: 0,
  userLevel: {
    level: 0,
    minReputation: 0,
    maxReputation: 0,
    title: "",
  },
};

export function useInitializeGame() {
  const [user, setUser] = useState<IUserInfo>(defaultUserInfo);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { loading: authLoading, error: authError } =
    useAuthAndFetchUserData(setUser);

  const {
    upgrades,
    setUpgrades,
    loading: upgradesLoading,
    error: upgradesError,
    fetchUpgrades,
  } = useFetchUpgrades(user);

  const {
    labs,
    setLabs,
    loading: labsLoading,
    error: labsError,
    fetchLabs,
  } = useFetchLabs();

  const {
    shippingMethods,
    setShippingMethods,
    loading: shippingLoading,
    error: shippingError,
    fetchShippingMethods,
  } = useFetchShippingMethods();

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

      if (!user) {
        throw new Error("User info is not available");
      }

      const [upgradesData, marketData, labs, shippingMethods] =
        await Promise.all([
          fetchUpgrades(),
          fetchMarketData(),
          fetchLabs(),
          fetchShippingMethods(),
        ]);

      if (upgradesError || marketError || labsError) {
        throw new Error("Failed to fetch one or more game data");
      }

      setUpgrades(upgradesData?.upgrades);
      setMarketInfo(marketData?.marketInfo);
      setLabs(labs?.labs);
      setShippingMethods(shippingMethods?.shippingMethods);

      console.log(`upgradesData:`, upgradesData);
      console.log(`marketData:`, marketData);
      console.log(`labs:`, labs);
      console.log(`shippingMethods:`, shippingMethods);
    } catch (error) {
      setError(`Failed to initialize game: ${error}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [authError, fetchUpgrades, fetchMarketData, setUpgrades, setMarketInfo]);

  useEffect(() => {
    if (!authLoading) {
      initializeGame();
    }
  }, [authLoading]);

  return {
    userInfo: user,
    upgrades,
    marketInfo,
    labs,
    shippingMethods,
    setUserInfo: setUser,
    setUpgrades,
    setMarketInfo,
    setLabs,
    setShippingMethods,
    loading,
    error,
  };
}
