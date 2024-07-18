import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { IUserInfo } from "../interfaces/user.interface";
import { useBuyLabPlot } from "../../hooks/useBuyLabPlot";
import { formatPrice } from "../utils/formater";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1f2937;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 90%;
  width: 100%;
  overflow-y: auto;
  position: relative;
`;

const LabButton = styled.button`
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  background-color: #10b981;
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #059669;
    transform: scale(1.05);
  }
`;

const CloseButton = styled.button`
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  background-color: #ef4444;
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #dc2626;
    transform: scale(1.05);
  }
`;

interface LabModalProps {
  plotPrice: number;
  onClose: () => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const LabModal: React.FC<LabModalProps> = ({
  plotPrice,
  onClose,
  setUserInfo,
}) => {
  const { buyLabPlot } = useBuyLabPlot();

  const buyAndClose = () => {
    buyLabPlot(setUserInfo);
    onClose();
  };

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent>
        <h2 className="text-lg font-bold text-white mb-4">
          Buy a new Lab Plot for {formatPrice(plotPrice, false)}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <LabButton onClick={() => buyAndClose()}>Buy</LabButton>
          <CloseButton onClick={onClose}>Cancel</CloseButton>
        </div>
      </ModalContent>
    </ModalBackground>
  );
};

export default LabModal;
