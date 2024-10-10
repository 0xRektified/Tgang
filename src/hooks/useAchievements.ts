import { useCallback, useState } from "react";
import { IAchievement } from "../components/interfaces/achievements.interface";
import axiosInstance from "../api/axiosConfig";
import axios from "axios";
import { IUserInfo } from "../components/interfaces/user.interface";

export const useAchievements = (
  setUserInfo: (value: React.SetStateAction<IUserInfo>) => void,
) => {
  const [achievements, setAchievements] = useState<IAchievement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAchievementsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get("/achievements");
      setAchievements(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        setError(message);
      } else {
        setError("An unexpected error occurred while fetching achievements");
      }
    } finally {
      setLoading(false);
    }
  };

  const unlockAchievement = async (achievementId: number) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await axiosInstance.get(`/achievements/unlock/${achievementId}`);
      setAchievements((prevAchievements) =>
        prevAchievements.map((achievement) =>
          achievement.id === achievementId
            ? { ...achievement, unlocked: true }
            : achievement,
        ),
      );
      fetchuser();
      setSuccessMessage("Achievement unlocked successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        setError(message);
      } else {
        setError(
          "An unexpected error occurred while unlocking the achievement",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchuser = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get<IUserInfo>(`/users`);
      setUserInfo(data);
    } catch (error: any) {
      console.error("Failed to fetch user");
    }
  }, []);

  return {
    achievements,
    fetchAchievements: fetchAchievementsData,
    unlockAchievement,
    loading,
    error,
    successMessage,
  };
};
