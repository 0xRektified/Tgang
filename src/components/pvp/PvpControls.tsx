import React from "react";
import styled from "styled-components";
import { CombatState } from "./Pvp";

const ControlButton = styled.button`
  // ... existing styles ...
  background-color: #27272a;
  color: white;
  border: 2px solid #1e90ff;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 5px #1e90ff;
  
  &:hover {
    box-shadow: 0 0 10px #1e90ff;
  }

  &:disabled {
    background-color: #4a5568;
    border-color: #4a5568;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

interface PvpControlsProps {
  combatState: CombatState;
  onButtonClick: () => void;
  isWinner?: boolean;
  isAttacking: boolean;
}

export const PvpControls: React.FC<PvpControlsProps> = ({
  combatState,
  onButtonClick,
  isWinner,
  isAttacking,
}) => {
  const getButtonText = () => {
    if (combatState === "ready") return "Start Fight";
    if (combatState === "fighting") return isAttacking ? "Attacking..." : "Attack";
    if (combatState === "result") return isWinner ? "Collect Rewards" : "Return to Menu";
    return "";
  };

  return (
    <div className="flex justify-center my-4">
      <ControlButton
        onClick={onButtonClick}
        disabled={isAttacking}
      >
        {getButtonText()}
      </ControlButton>
    </div>
  );
};
