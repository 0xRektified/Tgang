import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";
import { SocialChannel } from "../components/interfaces/social.interface";

export function useVerifySocial() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const verifySocial = async (
    chanel: SocialChannel,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>,
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { data } = await axiosInstance.put<IUserInfo>(
        `/socials/verify/${chanel}`,
      );
      if (data) {
        const newUserInfo = data;
        setUserInfo(newUserInfo);
        setSuccessMessage("Thank you for joining!");
      } else {
        setError("An unexpected error occurred");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        setError(message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { verifySocial, loading, error, successMessage };
}
