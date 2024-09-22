import React, { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { MdCheckCircle, MdError } from "react-icons/md";
import styled from "styled-components";

const ToastContainer = styled.div`
  position: fixed;
  top: 5em;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

const ToastContent = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  max-width: 80%;
`;

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

  console.log("visible", visible);
  if (!visible) return null;

  return (
    <ToastContainer>
      <ToastContent>
        <div className="flex-shrink-0 mr-2">
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
      </ToastContent>
    </ToastContainer>
  );
};
