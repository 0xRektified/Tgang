import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaPlus, FaWarehouse } from "react-icons/fa";

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #357abd;
  }
`;

const AttackCount = styled.span`
  color: white;
  font-weight: bold;
  margin-left: 1rem;
`;

interface PvpHeaderProps {
  attacksLeft: number;
  totalAttacks: number;
  onGetMoreAttacks: () => void;
  onArmoryClick: () => void;
}

export const PvpHeader: React.FC<PvpHeaderProps> = ({
  attacksLeft,
  totalAttacks,
  onGetMoreAttacks,
  onArmoryClick,
}) => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4 text-center text-white">
        Cartel War
      </h1>
      <motion.div
        key="buttons-and-count"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ButtonGroup>
          <div>
            <StyledButton onClick={onGetMoreAttacks}>
              <FaPlus /> Get More Attacks
            </StyledButton>
            <AttackCount>{attacksLeft} / {totalAttacks}</AttackCount>
          </div>
          <StyledButton onClick={onArmoryClick}>
            <FaWarehouse /> Armory
          </StyledButton>
        </ButtonGroup>
      </motion.div>
    </>
  );
};
