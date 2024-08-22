import WebApp from "@twa-dev/sdk";
import queryString from "query-string";
import validator from "validator";
import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance, { setAuthToken } from "../api/axiosConfig";
import { IUserInfo } from "../components/interfaces/user.interface";

export function useAuthAndFetchUserData(
  setUser: React.Dispatch<React.SetStateAction<IUserInfo>>,
) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const login = async () => {
      let sanitizedResult: Record<string, any> = {};
      try {
        const decodedInput = decodeURIComponent(WebApp.initData);
        const parsedQuery = queryString.parse(decodedInput);
        const sanitizeQuery = (query: Record<string, any>) => {
          const sanitizedQuery: Record<string, any> = {};
          if (query.query_id && typeof query.query_id === "string") {
            sanitizedQuery.query_id = validator.escape(query.query_id);
          }
          if (query.auth_date && typeof query.auth_date === "string") {
            sanitizedQuery.auth_date = validator.escape(query.auth_date);
          }
          if (query.user && typeof query.user === "string") {
            try {
              const user = JSON.parse(query.user);
              if (user.id && validator.isInt(user.id.toString())) {
                sanitizedQuery.user = {
                  id: user.id,
                  first_name: validator.escape(user.first_name),
                  username: user.username
                    ? validator.escape(user.username)
                    : undefined,
                  language_code: validator.escape(user.language_code),
                };
              }
            } catch (error) {
              throw new Error(`Invalid user JSON format ${error}`);
            }
          }
          return sanitizedQuery;
        };
        const sanitizedResult = sanitizeQuery(parsedQuery);
        const response = await axios.post<{ access_token: string }>(
          `${import.meta.env.VITE_BACKEND_URL}/auth/login?${decodedInput}`,
          sanitizedResult,
        );
        const { access_token } = response.data;
        setAuthToken(access_token);
        const userInfoResponse = await axiosInstance.get<IUserInfo>(`/users`);
        setUser(userInfoResponse.data);
      } catch (error) {
        console.error("Failed to parse and sanitize query or login:", error);
        setError(`Failed to authenticate and fetch user data ${error}`);
      } finally {
        setLoading(false);
      }
    };

    login();
  }, [setLoading, setError]);
  return { loading, error };
}
