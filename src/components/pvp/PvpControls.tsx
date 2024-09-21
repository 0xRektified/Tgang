import React from 'react';
import styled from 'styled-components';
import { NeonButton } from '../styled/cardStyled';

const NeonGreenButton = styled(NeonButton)`
  border: 2px solid #32cd32;
  box-shadow: 0 0 2px #32cd32, 0 0 6px #32cd32;

  &:hover, &:active {
    animation: greenGlow 1.5s infinite alternate, pulse 2s infinite;
  }

  @keyframes greenGlow {
    0% {
      box-shadow: 0 0 2px #32cd32, 0 0 4px #32cd32, 0 0 6px #32cd32,
        0 0 8px #32cd32;
    }
    100% {
      box-shadow: 0 0 8px #32cd32, 0 0 12px #32cd32, 0 0 16px #32cd32,
        0 0 20px #32cd32;
    }
  }
`;

interface PvpControlsProps {
  combatState: string;
  onButtonClick: () => void;
}

export const PvpControls: React.FC<PvpControlsProps> = ({ combatState, onButtonClick }) => {
  const getButtonText = () => {
    switch (combatState) {
      case "searching": return "Searching...";
      case "fighting": return "Attacking...";
      case "ready": return "Attack Opponent";
      case "result": return "Collect & Search Again";
      default: return "Search for Opponent";
    }
  };

  const ButtonComponent = combatState === "result" ? NeonGreenButton : NeonButton;

  return (
    <div className="my-6 flex justify-center">
      <ButtonComponent
        onClick={onButtonClick}
        disabled={combatState === "fighting" || combatState === "searching"}
        className={combatState === "fighting" || combatState === "searching" ? "disabled" : ""}
      >
        {getButtonText()}
      </ButtonComponent>
    </div>
  );
};