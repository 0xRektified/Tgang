import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { ILab } from "../interfaces/lab.interface";
import { EProduct } from "../interfaces/product.interface";
import { useBuyLab } from "../../hooks/useBuyLab";
import { LabPlot, IUserInfo } from "../interfaces/user.interface";

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
  labs: Record<EProduct, ILab>;
  plotId: number;
  onClose: () => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const LabModal: React.FC<LabModalProps> = ({
  labs,
  plotId,
  onClose,
  setUserInfo,
}) => {
  const { buyLab } = useBuyLab();

  const buyAndClose = (labProduct: EProduct, plotId: number) => {
    buyLab(
      {
        labProduct,
        plotId,
      },
      setUserInfo
    );
    onClose();
  };

  return (
    <ModalBackground>
      <ModalContent>
        <h2 className="text-lg font-bold text-white mb-4">Select a Lab</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(labs).map((lab) => (
            <LabItem key={lab[0]}>
              <img src={lab[1].image} alt={lab[0]} className="w-16 h-16" />
              <div className="text-white">Type: {lab[0]}</div>
              <div className="text-white">Capacity: {lab[1].baseCapacity}</div>
              <div className="text-white">
                Production: {lab[1].baseProduction}
              </div>
              <div className="text-white">Price: ${lab[1].labPrice}</div>
              <LabButton
                onClick={() => buyAndClose(lab[0] as EProduct, plotId)}
              >
                Buy
              </LabButton>
            </LabItem>
          ))}
        </div>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </ModalContent>
    </ModalBackground>
  );
};

export default LabModal;
