import { useState, useEffect, useCallback } from "react";
import { useAuthAndFetchUserData } from "./useAuthAndFetchUserData";
import { useFetchUpgrades } from "./useFetchUpgrades";
import { IUserInfo } from "../components/interfaces/user.interface";
import { useFetchLabs } from "./useFetchLabs";
import { useFetchSocials } from "./useFetchSocials";
import { useFetchPools } from "./useFetchPools";

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
  lastSell: new Date(),
  customerAmount: 100,
  customerAmountRemaining: 0,
  customerAmountMax: 1000,
  dealerUpgrades: [],
  robberyStrike: 0,
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

  const {
    loading: authLoading,
    error: authError,
    signup,
  } = useAuthAndFetchUserData(setUser);

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
    socials,
    setSocials,
    loading: socialsLoading,
    error: socialsError,
    fetchSocials,
  } = useFetchSocials();

  const {
    pools,
    setPools,
    loading: poolsLoading,
    error: poolsError,
    fetchPools,
  } = useFetchPools();

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

      const [upgradesData, labs, socials, pools] =
        await Promise.all([
          fetchUpgrades(),
          fetchLabs(),
          fetchSocials(),
          fetchPools(),
        ]);

      if (upgradesError || labsError || poolsError) {
        throw new Error("Failed to fetch one or more game data");
      }

      setUpgrades(upgradesData?.upgrades);
      setLabs(labs?.labs);
      setSocials(socials);
      setPools(pools);
    } catch (error) {
      setError(`Failed to initialize game: ${error}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [authError, fetchUpgrades, setUpgrades, setSocials, fetchPools, setPools]);

  useEffect(() => {
    if (!authLoading) {
      initializeGame();
    }
  }, [authLoading]);

  return {
    userInfo: user,
    upgrades,
    labs,
    pools,
    socials,
    setUserInfo: setUser,
    setUpgrades,
    setLabs,
    setPools,
    loading,
    error,
    signup,
  };
}
