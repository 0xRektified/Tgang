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
    <div className="fixed bottom-[10em] left-0 right-0 mx-auto px-4 max-w-sm">
      <div className="toast toast-top toast-center w-full">
        <div
          className={`alert p-2 rounded shadow-lg text-white font-bold bg-black bg-opacity-75 flex items-start`}
        >
          <div className="flex-shrink-0 mr-2 mt-1">
            {loading ? (
              <span className="loading loading-dots loading-md"></span>
            ) : error ? (
              <MdError className="text-red-500" size={20} />
            ) : (
              <MdCheckCircle className="text-green-500" size={20} />
            )}
          </div>
          <div className="flex-grow text-sm break-words">
            {loading ? "Loading..." : message}
          </div>
        </div>
      </div>
    </div>
  );
};
