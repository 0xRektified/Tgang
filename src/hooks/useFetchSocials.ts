import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosConfig";
import { SocialChannel, SocialData } from "../components/interfaces/social.interface";

export function useFetchSocials() {
  const [socials, setSocials] = useState<Record<SocialChannel, SocialData>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSocials = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get<Record<SocialChannel, SocialData>>(
        `/socials`
      );

      setSocials(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch socials data:", error);
      setError("Failed to fetch socials data");
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [socials]);

  return { socials, setSocials, loading, error, fetchSocials };
}
