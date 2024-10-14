import React from "react";
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
  const renderSpecialItemButton = () => {
    if (!specialItem) return null;

    const item = CRAFTABLE_ITEMS[specialItem];
    return (
      <SpecialItemButton onClick={onUseSpecialItemClick} disabled={isAttacking}>
        <ItemIconContainer>
          <UseText>Use</UseText>
          <ItemIcon src={item.image} alt={item.name} />
        </ItemIconContainer>
        <ItemStats>
          {item.pvpEffect.damage && (
            <StatItem>
              <StatValue>+{item.pvpEffect.damage}</StatValue>
              <StatIcon>
                <FaBomb />
              </StatIcon>
            </StatItem>
          )}
          {item.pvpEffect.protection && (
            <StatItem>
              <StatValue>+{item.pvpEffect.protection}%</StatValue>
              <StatIcon>
                <FaShieldAlt />
              </StatIcon>
            </StatItem>
          )}
          {item.pvpEffect.evasion && (
            <StatItem>
              <StatValue>+{item.pvpEffect.evasion}%</StatValue>
              <StatIcon>
                <GiDodging />
              </StatIcon>
            </StatItem>
          )}
        </ItemStats>
      </SpecialItemButton>
    );
  };

  return (
    <ControlsContainer>
      {combatState === "fighting" && (
        <>
          <ControlButton onClick={onAttackClick} disabled={isAttacking}>
            Attack
          </ControlButton>
          {renderSpecialItemButton()}
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
    </ControlsContainer>
  );
}
