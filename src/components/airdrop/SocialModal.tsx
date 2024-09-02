import React from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { IUserInfo } from "../interfaces/user.interface";
import { CardTitle, NeonButton, Button } from "../styled/cardStyled";
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

interface SocialModalProps {
  onClose: () => void;
}

const SocialModal: React.FC<SocialModalProps> = ({
  onClose,
}) => {
  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <p>Thank you for joining!</p>
          Please wait so we can verify your membership, it can take up to an hour.
        </ModalHeader>
        <ButtonContainer>
          <StyledCloseButton onClick={onClose}>Close</StyledCloseButton>
        </ButtonContainer>
      </ModalContent>
    </ModalBackground>
  );
};

export default SocialModal;
