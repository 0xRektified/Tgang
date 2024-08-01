import { useState } from "react";
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const claimDailyReward = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axiosInstance.post(`/users/robbery`);
      setRobberyStrike(response.data.robberyStrike);
      setUserInfo(response.data);
      setSuccessMessage("Daily robbery successful!");
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

  return { robberyStrike, claimDailyReward, loading, error, successMessage };
};

export default useDailyRobbery;
