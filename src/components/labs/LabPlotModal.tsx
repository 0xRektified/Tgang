import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { IUserInfo } from "../interfaces/user.interface";
import { useBuyLabPlot } from "../../hooks/useBuyLabPlot";
import { formatPrice } from "../utils/formater";
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
  justify-content: space-around;
  margin-top: 1rem;
`;

const StyledNeonButton = styled(NeonButton)`
  padding: 0.75rem 1.5rem;
`;

const StyledCloseButton = styled(Button)`
  padding: 0.75rem 1.5rem;
  background-color: #ef4444;
  border-color: #ef4444;

  &:hover {
    background-color: #dc2626;
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
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          Buy a new Lab Plot for {formatPrice(plotPrice, false)}
        </ModalHeader>
        <ButtonContainer>
          <StyledNeonButton onClick={buyAndClose}>Buy</StyledNeonButton>
          <StyledCloseButton onClick={onClose}>Cancel</StyledCloseButton>
        </ButtonContainer>
      </ModalContent>
    </ModalBackground>
  );
};

export default LabModal;
