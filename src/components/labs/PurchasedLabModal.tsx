import React from "react";
import { LuPackagePlus } from "react-icons/lu";
import { MdConveyorBelt } from "react-icons/md";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { LabPlot, IUserInfo, UserLab } from "../interfaces/user.interface";
import { useUpgradeLabCapacity } from "../../hooks/useUpgradeLabCapacity";
import { useUpgradeLabProduction } from "../../hooks/useUpgradeLabProduction";

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

interface PurchasedLabModalProps {
  plot: LabPlot;
  onClose: () => void;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}

const PurchasedLabModal: React.FC<PurchasedLabModalProps> = ({
  plot,
  onClose,
  setUserInfo,
}) => {
  const { upgradeLabCapacity } = useUpgradeLabCapacity();
  const { upgradeLabProduction } = useUpgradeLabProduction();

  const upgradeCapacity = () => {
    upgradeLabCapacity(plot.plotId, setUserInfo);
    onClose();
  };

  const upgradeProduction = () => {
    upgradeLabProduction(plot.plotId, setUserInfo);
    onClose();
  };

  return (
    <ModalBackground>
      <ModalContent>
        <h2 className="text-lg font-bold text-white mb-4">Lab details</h2>
        <div className="grid grid-cols-1 gap-4">
          <LabButton onClick={() => upgradeCapacity()}>
            <LuPackagePlus /> ${plot.lab?.upgradeCapacityPrice}
          </LabButton>
          <LabButton onClick={() => upgradeProduction()}>
            <MdConveyorBelt /> ${plot.lab?.upgradeProductionPrice}
          </LabButton>
        </div>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </ModalContent>
    </ModalBackground>
  );
};

export default PurchasedLabModal;
