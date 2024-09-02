import React from "react";

const Loading: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/loading.webp')",
      }}
    >
      <div className="text-center text-white">
        <span className="loading loading-spinner loading-md"></span>
        <p
          style={{
            color: "white",
            textShadow: "0 0 8px red",
            fontSize: "3rem",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          BETA ACCESS
        </p>
        <p className="mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
