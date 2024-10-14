import React, { useState } from "react";
import styled from "styled-components";
import { CombatState } from "./Pvp";
import {
  ECRAFTABLE_ITEM,
  CRAFTABLE_ITEMS,
  PvpEffect,
} from "../interfaces/craftableItem.interface";
import { FaFistRaised, FaBomb, FaShieldAlt, FaTimes } from "react-icons/fa";
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
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #27272a;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
`;

const ItemCard = styled.div<{ isAvailable: boolean }>`
  background-color: ${({ isAvailable }) =>
    isAvailable ? "#3a3a3d" : "#2a2a2d"};
  border: 2px solid
    ${({ isAvailable }) => (isAvailable ? "#4a4a4d" : "#3a3a3d")};
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  opacity: ${({ isAvailable }) => (isAvailable ? 1 : 0.6)};
`;

const ItemName = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

const ItemContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
`;

const ItemLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const ItemRightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemIcon = styled.img`
  width: 4em;
  height: 4em;
  margin-bottom: 1rem;
`;

const ItemInfo = styled.div`
  color: white;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const UseButton = styled.button<{ isAvailable: boolean }>`
  background-color: ${({ isAvailable }) =>
    isAvailable ? "#27272a" : "#4a5568"};
  color: white;
  border: 2px solid ${({ isAvailable }) =>
    isAvailable ? "#1e90ff" : "#4a5568"};
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: ${({ isAvailable }) => (isAvailable ? "pointer" : "not-allowed")}};
  transition: all 0.3s ease;
  box-shadow: ${({ isAvailable }) =>
    isAvailable ? "0 0 5px #1e90ff" : "none"};
  width: 100%;

  &:hover {
    box-shadow: ${({ isAvailable }) =>
      isAvailable ? "0 0 10px #1e90ff" : "none"};
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

  const renderPvpEffects = (effects: PvpEffect) => {
    return Object.entries(effects).map(([key, value]) => (
      <ItemInfo key={key}>
        {key.charAt(0).toUpperCase() + key.slice(1)}: <strong>+{value}</strong>
      </ItemInfo>
    ));
  };

  const renderItemCard = (itemId: ECRAFTABLE_ITEM) => {
    const userItem = userItems.find((item) => item.itemId === itemId);
    const quantity = userItem ? userItem.quantity : 0;
    const isAvailable = quantity > 0;
    const itemData = CRAFTABLE_ITEMS[itemId];

    return (
      <ItemCard key={itemId} isAvailable={isAvailable}>
        <ItemName>{itemData.name}</ItemName>
        <ItemContent>
          <ItemLeftColumn>
            <ItemIcon src={itemData.image} alt={itemData.name} />
            <UseButton
              isAvailable={isAvailable}
              onClick={() => isAvailable && handleItemClick(itemId)}
              disabled={!isAvailable}
            >
              Use
            </UseButton>
          </ItemLeftColumn>
          <ItemRightColumn>
            <ItemInfo>
              Quantity: <strong>{quantity}</strong>
            </ItemInfo>
            <ItemInfo>
              Duration: <strong>{itemData.duration}</strong> turn(s)
            </ItemInfo>
            {renderPvpEffects(itemData.pvpEffect)}
          </ItemRightColumn>
        </ItemContent>
      </ItemCard>
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
          <ControlButton
            onClick={() => setIsItemModalOpen(true)}
            disabled={isAttacking}
          >
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
            <CloseButton onClick={() => setIsItemModalOpen(false)}>
              <FaTimes />
            </CloseButton>
            <h2>Select an Item to Use</h2>
            <ItemGrid>
              {Object.values(ECRAFTABLE_ITEM).map(renderItemCard)}
            </ItemGrid>
          </ModalContent>
        </ModalBackground>
      )}
    </ControlsContainer>
  );
}
