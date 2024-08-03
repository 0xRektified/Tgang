import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { CardTitle, NeonButton } from "./styled/cardStyled";

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
  font-size: 1.5rem;
`;

const OptionContainer = styled.div`
  background-color: #374151;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const OptionLabel = styled.div`
  color: #e5e7eb;
  font-size: 1.2rem;
  text-align: center;
`;

const OptionValue = styled.div`
  color: #10b981;
  font-size: 1.5rem;
  font-weight: bold;
`;

const OptionPrice = styled.div`
  color: #22c55e;
  font-size: 1rem;
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
  margin-top: 1rem;

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

interface UpgradeOption {
  label: string;
  valueDiff: string;
  price: number;
  icon: React.ReactElement;
  onClick: () => void;
}

interface GenericUpgradeModalProps {
  title: string;
  options: UpgradeOption[];
  onClose: () => void;
}

export const UpgradeConfirmationModal: React.FC<GenericUpgradeModalProps> = ({
  title,
  options,
  onClose,
}) => {
  const handleState = async (option: UpgradeOption) => {
    await option.onClick();
    onClose();
  };

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalHeader>{title}</ModalHeader>
        <ButtonContainer>
          {options.map((option, index) => (
            <OptionContainer key={index}>
              <OptionLabel>{option.label}</OptionLabel>
              <OptionValue>{option.valueDiff}</OptionValue>
              <OptionPrice>${option.price}</OptionPrice>
              <StyledNeonButton onClick={() => handleState(option)}>
                {option.icon} Purchase
              </StyledNeonButton>
            </OptionContainer>
          ))}
        </ButtonContainer>
      </ModalContent>
    </ModalBackground>
  );
};
