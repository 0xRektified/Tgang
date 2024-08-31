import React from "react";

const MobileOnly: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/home/street.webp')",
      }}
    >
      <div className="text-center text-white">
        <p
          style={{
            color: "#1e90ff",
            textShadow: "0 0 8px #1e90ff",
            fontSize: "1rem",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Scan the QR code to open on your mobile device
        </p>
        <img
          src="/assets/mobile_qr.svg"
          alt="QR Code"
          className="mx-auto w-64 h-64"
        />
      </div>
    </div>
  );
};

export default MobileOnly;
