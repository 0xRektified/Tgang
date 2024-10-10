import axios from "axios";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { IUserSocial } from "../components/interfaces/user.interface";
import { SocialChannel } from "../components/interfaces/social.interface";

export function useJoinSocial() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const joinSocial = async (
    chanel: SocialChannel,
    setIsSocialModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { data } = await axiosInstance.put<IUserSocial>(
        `/socials/join/${chanel}`,
      );
      if (data.joined) {
        setIsSocialModalOpen(true);
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

  return { joinSocial, loading, error, successMessage };
}
