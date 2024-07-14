import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { EProduct } from "../interfaces/product.interface";
import { useBuyLab } from "../../hooks/useBuyLab";
import { LabPlot, IUserInfo } from "../interfaces/user.interface";
import { useBuyLabPlot } from "../../hooks/useBuyLabPlot";

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
  @apply bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full;
`;

const LabItem = styled.div`
  @apply bg-gray-700 p-4 rounded-lg flex flex-col justify-between;
`;

const LabButton = styled.button`
  @apply py-2 px-4 mt-2 bg-green-600 rounded-lg hover:bg-green-700 text-white font-bold;
`;

const CloseButton = styled.button`
  @apply mt-4 py-2 px-4 bg-red-600 rounded-lg hover:bg-red-700 text-white font-bold;
`;

interface LabModalProps {
  plotPrice: number;
  onClose: () => void;
  setCashAmount: React.Dispatch<React.SetStateAction<number>>,
  setLabPlots: React.Dispatch<React.SetStateAction<LabPlot[]>>,
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo | undefined>>,
}

const LabModal: React.FC<LabModalProps> = ({ plotPrice, onClose, setLabPlots, setCashAmount, setUserInfo }) => {
  const { buyLabPlot } = useBuyLabPlot();

  const buyAndClose = () => {
    buyLabPlot(setCashAmount, setLabPlots, setUserInfo);
    onClose();
  };

  return (
    <ModalBackground>
      <ModalContent>
        <h2 className="text-lg font-bold text-white mb-4">Buy Lab Plot for {plotPrice}</h2>
        <div className="grid grid-cols-2 gap-4">
          <LabButton onClick={() => buyAndClose()}>Buy</LabButton>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </div>
      </ModalContent>
    </ModalBackground>
  );
};

export default LabModal;
