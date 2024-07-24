import { useState, useEffect, useCallback } from "react";
import { useAuthAndFetchUserData } from "./useAuthAndFetchUserData";
import { useFetchUpgrades } from "./useFetchUpgrades";
import { useMarketData } from "./useMarketData";
import { IUserInfo } from "../components/interfaces/user.interface";
import { useFetchLabs } from "./useFetchLabs";

const defaultUserInfo: IUserInfo = {
  id: "",
  username: "",
  cashAmount: 1000,
  products: [],
  labPlots: [],
  labPlotPrice: 0,
  referralToken: "",
  upgrades: [],
  referredUsers: [],
  customerAmount: 3600,
  lastSell: new Date(),
  customerAmountRemaining: 3600,
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

      const [upgradesData, marketData, labs] = await Promise.all([
        fetchUpgrades(),
        fetchMarketData(),
        fetchLabs(),
      ]);

      if (upgradesError || marketError || labsError) {
        throw new Error("Failed to fetch one or more game data");
      }

      setUpgrades(upgradesData?.upgrades);
      setMarketInfo(marketData?.marketInfo);
      setLabs(labs?.labs);

      console.log("setUserInfo (initializeGame):", user);
      console.log("setUpgrades:", upgradesData?.upgrades);
      console.log("setMarketInfo:", marketData?.marketInfo);
    } catch (error) {
      setError("Failed to initialize game");
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
    setUserInfo: setUser,
    setUpgrades,
    setMarketInfo,
    setLabs,
    loading,
    error,
  };
}
