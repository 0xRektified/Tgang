import WebApp from "@twa-dev/sdk";
import queryString from "query-string";
import validator from "validator";
import { useState, useEffect } from "react";

export function useTelegramUserInfo() {
  const [sanitizedQuery, setSanitizedQuery] = useState<Record<
    string,
    any
  > | null>(null);

  useEffect(() => {
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
                username: validator.escape(user.username),
                language_code: validator.escape(user.language_code),
              };
            }
          } catch (error) {
            throw new Error("Invalid user JSON format");
          }
        }
        return sanitizedQuery;
      };

      const sanitizedResult = sanitizeQuery(parsedQuery);
      setSanitizedQuery(sanitizedResult);
    } catch (error) {
      console.error("Failed to parse and sanitize query:", error);
      setSanitizedQuery(null);
    }
  }, []);

  return { sanitizedQuery };
}
