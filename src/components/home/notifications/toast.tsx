import React from "react";

interface ToastProps {
  show: boolean;
  message: string;
  type: "error" | "info" | "success";
}

export const Toast: React.FC<ToastProps> = ({ show, message, type }) => {
  if (!show) return null;

  const typeClass =
    type === "error"
      ? "bg-red-600"
      : type === "info"
      ? "bg-yellow-600"
      : "bg-green-600";

  return (
    <div
      className={`fixed top-0 right-0 m-4 animate-slide-in-from-left animate-slide-out-to-right ${typeClass}`}
    >
      <div className="toast toast-top toast-end">
        <div className="alert p-4 rounded shadow-lg text-white font-bold">
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};
