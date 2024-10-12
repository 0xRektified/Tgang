import React, { useState } from "react";
import styled from "styled-components";
import "tailwindcss/tailwind.css";
import { CardTitle, LockedButton, NeonButton } from "./styled/cardStyled";
import { formatPrice } from "./utils/formater";
import { useCountdown } from "../hooks/useCountDown";
import TimerComponent from "./TimerComponent";

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

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.2rem;
  margin-top: 0.75rem;
`;

const OptionCard = styled.div`
  background-color: #374151;
  padding: 0.4rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const OptionIcon = styled.div`
  font-size: 1.5rem;
  color: #10b981;
  margin-bottom: 0.25rem;
`;

const OptionLabel = styled.div`
  color: #e5e7eb;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
`;

const OptionValue = styled.span`
  color: #10b981;
  font-size: 1.25rem;
  font-weight: bold;
`;

const OptionPrice = styled.div`
  color: #22c55e;
  font-size: 0.875rem;
`;

const CostLabel = styled.span`
  color: white;
  font-size: 0.8rem;
`;

const ModalContent = styled.div`
  background-color: #1f2937;
  padding: 0.3rem;
  border-radius: 0.5rem;
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
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
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

const StyledLockedButton = styled(LockedButton)`
  color: #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TimerContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimerText = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

const TimerIcon = styled.span`
  margin-right: 8px;
  font-size: 16px;
`;

interface UpgradeOption {
  label: string;
  valueDiff: string;
  price: number;
  icon: React.ReactElement;
  nextUpgrade?: Date;
  onClick: () => void;
}

interface GenericUpgradeModalProps {
  title: string;
  options: UpgradeOption[];
  onClose: () => void;
}

const formatTimeDiff = (value: string): string => {
  const timeRegex = /^(\d+)h(\d+)m$/;
  const match = value.match(timeRegex);

  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    if (hours === 0 && minutes < 2) {
      return `${minutes * 60}s`;
    } else if (hours === 0) {
      return `${minutes}m`;
    } else {
      return `${hours}h${minutes}m`;
    }
  }

  return value;
};

export const UpgradeConfirmationModal: React.FC<GenericUpgradeModalProps> = ({
  title,
  options,
  onClose,
}) => {
  const [expiredOptions, setExpiredOptions] = useState<Set<number>>(new Set());

  const handleState = async (option: UpgradeOption) => {
    await option.onClick();
    onClose();
  };

  const handleExpired = (index: number) => {
    setExpiredOptions(prev => new Set(prev).add(index));
  };

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalHeader>{title}</ModalHeader>
        <OptionsGrid>
          {options.map((option, index) => {
            const isExpired = expiredOptions.has(index);
            return (
              <OptionCard key={index}>
                <OptionIcon>{option.icon}</OptionIcon>
                <OptionLabel>
                  {option.label}{" "}
                  <OptionValue>{formatTimeDiff(option.valueDiff)}</OptionValue>
                </OptionLabel>
                <OptionPrice>
                  <CostLabel>Cost: </CostLabel>
                  {formatPrice(option.price, false)}
                </OptionPrice>
                {isExpired || !option.nextUpgrade ? (
                  <StyledNeonButton onClick={() => handleState(option)}>
                    {option.icon} Purchase
                  </StyledNeonButton>
                ) : (
                  <TimerComponent 
                    nextUpgrade={option.nextUpgrade} 
                    onExpired={() => handleExpired(index)}
                  />
                )}
              </OptionCard>
            )
          })}
        </OptionsGrid>
      </ModalContent>
    </ModalBackground>
  );
};
