import React, { useState } from "react";
import styled from "styled-components";
import { CombatState } from "./Pvp";
import {
  ECRAFTABLE_ITEM,
  CRAFTABLE_ITEMS,
} from "../interfaces/craftableItem.interface";
import { FaFistRaised, FaBomb, FaShieldAlt } from "react-icons/fa";
import { GiDodging } from "react-icons/gi";

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

const SpecialItemButton = styled(ControlButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  height: 60px;
  width: auto;
`;

const ItemIconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.2em;
`;

const ItemIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const UseText = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  gap: 0px;
`;

const ItemStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StatIcon = styled.div`
  font-size: 0.9rem;
  color: #a0aec0;
`;

const StatValue = styled.span`
  font-size: 0.8rem;
  color: #ffffff;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #27272a;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
`;

const ItemButton = styled.button`
  background-color: #3a3a3d;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #4a4a4d;
  }
`;

interface PvpControlsProps {
  combatState: CombatState;
  onAttackClick: () => void;
  onUseSpecialItemClick: (itemId: ECRAFTABLE_ITEM) => void;
  isWinner: boolean;
  isAttacking: boolean;
  userItems: Array<{ itemId: ECRAFTABLE_ITEM; quantity: number }>;
  onStartBattle: () => void;
}

export function PvpControls({
  combatState,
  onAttackClick,
  onUseSpecialItemClick,
  isWinner,
  isAttacking,
  userItems,
  onStartBattle,
}: PvpControlsProps) {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const renderItemButton = (item: ECRAFTABLE_ITEM, quantity: number) => {
    const itemData = CRAFTABLE_ITEMS[item];
    return (
      <ItemButton key={item} onClick={() => handleItemClick(item)}>
        <img src={itemData.image} alt={itemData.name} width="50" height="50" />
        <div>{itemData.name}</div>
        <div>Quantity: {quantity}</div>
      </ItemButton>
    );
  };

  const handleItemClick = (itemId: ECRAFTABLE_ITEM) => {
    onUseSpecialItemClick(itemId);
    setIsItemModalOpen(false);
  };

  return (
    <ControlsContainer>
      {combatState === "fighting" && (
        <>
          <ControlButton onClick={onAttackClick} disabled={isAttacking}>
            Attack
          </ControlButton>
          <ControlButton onClick={() => setIsItemModalOpen(true)} disabled={isAttacking}>
            Use Item
          </ControlButton>
        </>
      )}
      {combatState === "ready" && (
        <ControlButton onClick={onStartBattle}>Start Battle</ControlButton>
      )}
      {combatState === "result" && (
        <ControlButton onClick={onAttackClick}>
          {isWinner ? "Collect Rewards" : "Try Again"}
        </ControlButton>
      )}

      {isItemModalOpen && (
        <ModalBackground onClick={() => setIsItemModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Select an Item to Use</h2>
            <ItemGrid>
              {userItems.map((item) => renderItemButton(item.itemId, item.quantity))}
            </ItemGrid>
          </ModalContent>
        </ModalBackground>
      )}
    </ControlsContainer>
  );
}
