import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";

import { IUserInfo } from "../components/interfaces/user.interface";

const useDailyRobbery = (
  user: IUserInfo,
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
) => {
  const [robberyStrike, setRobberyStrike] = useState<number>(
    user?.robberyStrike || 0
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const claimDailyReward = async () => {
    try {
      const response = await axiosInstance.get(`/users/claimDailyReward`);
      setRobberyStrike(response.data.robberyStrike);
      setUserInfo(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { robberyStrike, claimDailyReward, loading, error };
};

export default useDailyRobbery;
