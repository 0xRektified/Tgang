import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";

interface UserInfo {
  id: string;
  username: string;
}

const useGetUserInfo = () => {
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get<UserInfo>(`/users`);
        console.log(`response`);
        console.log(response);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userData, loading, error };
};

export default useGetUserInfo;
