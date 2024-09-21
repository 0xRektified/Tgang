import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTrophy, FaSkull, FaDollarSign, FaClock } from 'react-icons/fa';
import { ICombatResult } from '../../hooks/useMultiplayer';

const ResultContainer = styled(motion.div)`
  background-color: #2c2c2e;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  color: #ffffff;
  width: 100%;
  max-width: 600px;
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #4a4a4e;
`;

const ResultTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const ResultIcon = styled.div`
  font-size: 2rem;
  color: ${(props) => props.color};
`;

const ResultContent = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
`;

const ResultItemIcon = styled.div`
  font-size: 0.8rem;
  margin-right: 0.5rem;
  color: #a0aec0;
`;

const ResultItemValue = styled.span`
  font-weight: bold;
`;

interface PvpResultProps {
  combatResult: ICombatResult;
  username: string;
}

export const PvpResult: React.FC<PvpResultProps> = ({ combatResult, username }) => {
  const isWinner = combatResult.winner === username;

  return (
    <ResultContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <ResultHeader>
        <ResultTitle>{isWinner ? "Victory!" : "Defeat!"}</ResultTitle>
        <ResultIcon color={isWinner ? "#48bb78" : "#e53e3e"}>
          {isWinner ? <FaTrophy /> : <FaSkull />}
        </ResultIcon>
      </ResultHeader>
      <ResultContent>
        <ResultItem>
          <ResultItemIcon><FaDollarSign /></ResultItemIcon>
          Loot: <ResultItemValue>${combatResult.loot}</ResultItemValue>
        </ResultItem>
        <ResultItem>
          <ResultItemIcon><FaClock /></ResultItemIcon>
          Rounds: <ResultItemValue>{combatResult.rounds}</ResultItemValue>
        </ResultItem>
        <ResultItem>
          <ResultItemIcon><FaSkull /></ResultItemIcon>
          <ResultItemValue>{combatResult.loser} Lost</ResultItemValue>
        </ResultItem>
      </ResultContent>
    </ResultContainer>
  );
};