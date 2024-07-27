import React from "react";
import { LuPackagePlus } from "react-icons/lu";
import { MdConveyorBelt } from "react-icons/md";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { LabPlot, IUserInfo, UserLab } from "../interfaces/user.interface";
import { useUpgradeLabCapacity } from "../../hooks/useUpgradeLabCapacity";
import { useUpgradeLabProduction } from "../../hooks/useUpgradeLabProduction";
import { NeonButton, Button, CardTitle } from "../styled/renderUpgradesStyled";

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

const ModalHeader = styled(CardTitle)`
  text-align: center;
  color: white;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const StyledNeonButton = styled(NeonButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  & > svg {
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #ef44449c;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background-color 0.3s;

  &:hover {
    transform: scale(1.2);
    background-color: #dc2626;
  }
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

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const upgradeCapacityDiff = plot.lab?.upgradeCapacity! - plot.lab?.capacity!;
  const upgradeProductionDiff =
    plot.lab?.upgradeProduction! - plot.lab?.production!;

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalHeader>Lab Details</ModalHeader>
        <ButtonContainer>
          <StyledNeonButton onClick={upgradeCapacity}>
            Capacity +{upgradeCapacityDiff}<LuPackagePlus />{" "}
            {formatPrice(plot.lab?.upgradeCapacityPrice || 0)}
          </StyledNeonButton>
          <StyledNeonButton onClick={upgradeProduction}>
            Production +{upgradeProductionDiff}<MdConveyorBelt />{" "}
            {formatPrice(plot.lab?.upgradeProductionPrice || 0)}
          </StyledNeonButton>
        </ButtonContainer>
      </ModalContent>
    </ModalBackground>
  );
};

export default PurchasedLabModal;
