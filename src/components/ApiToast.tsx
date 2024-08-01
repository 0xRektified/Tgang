import React, { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { MdCheckCircle, MdError } from "react-icons/md";

interface ApiToastProps {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const ApiToast: React.FC<ApiToastProps> = ({
  loading,
  error,
  successMessage,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loading) {
      setMessage("Loading...");
      setVisible(true);
    } else if (error) {
      setMessage(error);
      setVisible(true);
      WebApp.HapticFeedback.impactOccurred("heavy");
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (successMessage) {
      setMessage(successMessage);
      setVisible(true);
      WebApp.HapticFeedback.impactOccurred("heavy");
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [loading, error, successMessage]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-[10em] right-0 m-4">
      <div className="toast toast-top toast-end">
        <div
          className={`alert p-2 rounded shadow-lg text-white font-bold bg-black bg-opacity-75 flex items-center`}
          style={{ minHeight: "2.5em" }}
        >
          {loading ? (
            <span className="loading loading-dots loading-lg"></span>
          ) : error ? (
            <MdError className="text-red-500 mr-2" size={24} />
          ) : (
            <MdCheckCircle className="text-green-500 mr-2" size={24} />
          )}
          <span>{loading ? "Loading..." : message}</span>
        </div>
      </div>
    </div>
  );
};
