import React from "react";
import styled from "styled-components";
import { CombatState } from "./Pvp";
import { ECRAFTABLE_ITEM } from "../interfaces/craftableItem.interface";

const ControlButton = styled.button`
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
  margin: 0.5rem;

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

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

interface PvpControlsProps {
  combatState: CombatState;
  onAttackClick: () => void;
  onUseSpecialItemClick: () => void;
  isWinner: boolean;
  isAttacking: boolean;
  specialItem: ECRAFTABLE_ITEM | null;
  onStartBattle: () => void;
}

export function PvpControls({
  combatState,
  onAttackClick,
  onUseSpecialItemClick,
  isWinner,
  isAttacking,
  specialItem,
  onStartBattle,
}: PvpControlsProps) {
  const getItemName = (itemId: ECRAFTABLE_ITEM) => {
    // Replace this with your actual item name mapping
    return itemId.replace(/_/g, ' ').toLowerCase();
  };

  return (
    <ControlsContainer>
      {combatState === "fighting" && (
        <>
          <ControlButton
            onClick={onAttackClick}
            disabled={isAttacking}
          >
            Attack
          </ControlButton>
          <ControlButton
            onClick={onUseSpecialItemClick}
            disabled={isAttacking || !specialItem}
          >
            Use {specialItem ? getItemName(specialItem) : "Special Item"}
          </ControlButton>
        </>
      )}
      {combatState === "ready" && (
        <ControlButton onClick={onStartBattle}>
          Start Battle
        </ControlButton>
      )}
      {combatState === "result" && (
        <ControlButton onClick={onAttackClick}>
          {isWinner ? "Collect Rewards" : "Try Again"}
        </ControlButton>
      )}
    </ControlsContainer>
  );
}
