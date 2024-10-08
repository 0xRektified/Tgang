import React from "react";
import styled from "styled-components";
import { CombatState } from "./Pvp";
import { ECRAFTABLE_ITEM } from "../interfaces/craftableItem.interface";

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
  onUseItem: () => void;
  selectedItem: ECRAFTABLE_ITEM | null;
}

export const PvpControls: React.FC<PvpControlsProps> = ({
  combatState,
  onButtonClick,
  isWinner,
  isAttacking,
  onUseItem,
  selectedItem,
}) => {
  const getButtonText = () => {
    if (combatState === "ready") return "Start Fight";
    if (combatState === "fighting") return isAttacking ? "Attacking..." : "Attack";
    if (combatState === "result") return isWinner ? "Collect Rewards" : "Return to Menu";
    return "";
  };

  return (
    <div className="flex justify-center my-4 space-x-4">
      <ControlButton
        onClick={onButtonClick}
        disabled={isAttacking}
      >
        {getButtonText()}
      </ControlButton>
      {combatState === "fighting" && selectedItem && (
        <ControlButton
          onClick={onUseItem}
          disabled={isAttacking}
        >
          Use Item
        </ControlButton>
      )}
    </div>
  );
};
