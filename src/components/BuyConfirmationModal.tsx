import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { NeonButton } from "./styled/cardStyled";

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

const ModalHeader = styled.h2`
  text-align: center;
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ModalText = styled.p`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const PriceText = styled.span`
  color: #22c55e; /* Green color for the price */
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
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

interface BuyConfirmationModalProps {
  itemTitle: string;
  itemCost: number;
  onConfirm: (e: React.TouchEvent<HTMLButtonElement>) => void;
  onClose: () => void;
}

const BuyConfirmationModal: React.FC<BuyConfirmationModalProps> = ({
  itemTitle,
  itemCost,
  onConfirm,
  onClose,
}) => {
  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalHeader>Confirm Purchase</ModalHeader>
        <ModalText>
          Are you sure you want to buy {itemTitle} for{" "}
          <PriceText>${itemCost}</PriceText>?
        </ModalText>
        <ButtonContainer>
          <NeonButton onTouchStart={onConfirm}>Confirm</NeonButton>
          <NeonButton onTouchStart={onClose}>Cancel</NeonButton>
        </ButtonContainer>
      </ModalContent>
    </ModalBackground>
  );
};

export default BuyConfirmationModal;
