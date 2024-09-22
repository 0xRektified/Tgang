import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaSkull, FaHistory } from "react-icons/fa";
import { GiPistolGun } from "react-icons/gi";
import styled from "styled-components";

import { CombatState } from "./Pvp";
import { StyledButton } from "../styled/shopStyled";

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const NeonButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px #4a90e2, 0 0 20px #4a90e2, 0 0 30px #4a90e2;

  &:hover {
    background-color: #357abd;
    box-shadow: 0 0 20px #4a90e2, 0 0 40px #4a90e2, 0 0 60px #4a90e2;
  }
`;

const AttackCount = styled.span`
  color: white;
  font-weight: bold;
  margin-left: 1rem;
`;

const PageTitle = styled.h1`
  font-family: "Bangers", cursive; // Cool font (make sure to import it)
  color: #ff4500; // Bright red-orange color
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 3rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: #ddd;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  height: 100%;
  background-color: #4a90e2;
  transition: width 0.3s ease-in-out;
`;

const GoldButton = styled(StyledButton)`
  background-color: gold;
  color: black;
  &:hover {
    background-color: #ffd700;
  }
`;

interface PvpHeaderProps {
  attacksLeft: number;
  totalAttacks: number;
  onGetMoreAttacks: () => void;
  onDeathmatchClick: () => void;
  onArmoryClick: () => void;
  combatState: CombatState;
}

export const PvpHeader: React.FC<PvpHeaderProps> = ({
  attacksLeft,
  totalAttacks,
  onGetMoreAttacks,
  onDeathmatchClick,
  onArmoryClick,
  combatState,
}) => {
  return (
    <AnimatePresence>
      {combatState === 'idle' && (
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3 }}
        >
          <PageTitle>
            <GiPistolGun /> Cartel War
          </PageTitle>
          <ButtonGroup>
            <div>
              <h2>Attacks Available</h2>
              <AttackCount>
                {attacksLeft} / {totalAttacks}
              </AttackCount>
              <NeonButton onClick={onGetMoreAttacks}>
                <FaPlus /> Get More
              </NeonButton>
            </div>
            <ProgressBar>
              <ProgressFill width={`${(attacksLeft / totalAttacks) * 100}%`} />
            </ProgressBar>
          </ButtonGroup>
          <NeonButton onClick={onArmoryClick}>
            <FaSkull /> Armory
          </NeonButton>
          <NeonButton onClick={onDeathmatchClick}>
            <FaSkull /> Deathmatch
          </NeonButton>
          <h3>
            <FaHistory /> Combat History
          </h3>
          {/* Combat history list will be added here */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
