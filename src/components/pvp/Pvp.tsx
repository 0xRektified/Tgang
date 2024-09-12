import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GiCrossedSwords } from "react-icons/gi";
import { IUserInfo } from "../interfaces/user.interface";
import { EProductIcon } from "../interfaces/product.interface";
import { useMultiplayer } from "../../hooks/useMultiplayer";

const PvpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: calc(100vh - 120px); // Adjust this value based on your layout
  background-size: cover;
  background-position: center;
  color: white;
  padding: 1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: none;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
  text-align: center;
`;

const FightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2a2a2e;
  border-radius: 0.375rem;
  padding: 1rem;
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

const FightScene = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const Fighter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FighterName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #9ca3af;
  margin-top: 0.5rem;
`;

const Versus = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #dc2626;
  margin: 0 1rem;
`;

const PlayerListContainer = styled.div`
  width: 100%;
  max-width: 600px;
  overflow-x: auto;
  background-color: #2a2a2e;
  border-radius: 0.375rem;
  padding: 1rem;
`;

const PlayerList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const PlayerListItem = styled.li`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #4a4a4a;
  color: white;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const PlayerName = styled.div`
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: bold;
`;

const CashAmount = styled.div`
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-weight: bold;
  color: #16a34a;
`;

const PlayerStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  color: #9ca3af;
`;

const StatItem = styled.div`
  margin-right: 1rem;
  display: flex;
  align-items: center;

  & > span {
    margin-left: 0.25rem;
  }
`;

const ProductIcons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: clamp(0.8rem, 1.5vw, 1rem);
`;

const ProductIcon = styled.span`
  font-size: clamp(1rem, 2vw, 1.2rem);
`;

const SearchButton = styled.button`
  background-color: #4a5568;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2d3748;
  }
`;

const OpponentCard = styled.div`
  background-color: #2a2a2e;
  border-radius: 0.375rem;
  padding: 1.5rem;
  margin-top: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

const OpponentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const OpponentName = styled.h3`
  font-size: 1.25rem;
  color: #ffffff;
`;

const OpponentStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const StatValue = styled.div`
  font-size: 1.125rem;
  font-weight: bold;
  color: #ffffff;
`;

const FightButton = styled(SearchButton)`
  background-color: #dc2626;
  width: 100%;

  &:hover {
    background-color: #b91c1c;
  }
`;

// Modal components
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
  background-color: #1a1a1d;
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  color: #ffffff;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ffffff;
  cursor: pointer;
`;

// Modal component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalBackground onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </ModalBackground>
  );
};

interface PvpProps {
  userInfo: IUserInfo;
}

interface Player {
  id: string;
  username: string;
  cashAmount: number;
  reputation: number;
  pvp: {
    victory: number;
    defeat: number;
  };
}

const Pvp: React.FC<PvpProps> = ({ userInfo }) => {
  const { searchPlayer, startFight, enablePvp } = useMultiplayer();
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [fightResult, setFightResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!userInfo.pvp || !userInfo.pvp.pvpEnabled) {
      setShowEnableModal(true);
    }
  }, [userInfo]);

  const handleEnablePvp = async () => {
    await enablePvp();
    setShowEnableModal(false);
  };

  const handleSearchPlayers = async () => {
    setIsSearching(true);
    const players = await searchPlayer();
    if (players.length > 0) {
      setOpponent(players[0]);
    }
    setIsSearching(false);
  };

  const handleStartFight = async () => {
    if (opponent) {
      const result = await startFight(userInfo.id, opponent.id);
      setFightResult(result);
    }
  };

  return (
    <PvpContainer>
      <Title>PvP Battle Arena</Title>
      <FightContainer>
        <FightScene>
          <Fighter>
            <GiCrossedSwords size={50} />
            <FighterName>{userInfo.username}</FighterName>
          </Fighter>
          <Versus>VS</Versus>
          <Fighter>
            <GiCrossedSwords size={50} />
            <FighterName>{opponent ? opponent.username : "?"}</FighterName>
          </Fighter>
        </FightScene>
        <p>Fight against other players to steal their resources!</p>
        {!opponent && (
          <SearchButton onClick={handleSearchPlayers} disabled={isSearching}>
            {isSearching ? "Searching..." : "Search for Opponent"}
          </SearchButton>
        )}
      </FightContainer>

      {opponent && (
        <OpponentCard>
          <OpponentHeader>
            <OpponentName>{opponent.username}</OpponentName>
            <CashAmount>${opponent.cashAmount.toLocaleString()}</CashAmount>
          </OpponentHeader>
          <OpponentStats>
            <Stat>
              <StatLabel>Reputation</StatLabel>
              <StatValue>{opponent.reputation}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Victories</StatLabel>
              <StatValue>{opponent.pvp.victory}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Defeats</StatLabel>
              <StatValue>{opponent.pvp.defeat}</StatValue>
            </Stat>
          </OpponentStats>
          <FightButton onClick={handleStartFight}>Fight!</FightButton>
        </OpponentCard>
      )}

      {fightResult && (
        <OpponentCard>
          <Title>Fight Result</Title>
          <p>Winner: {fightResult.winner}</p>
          <p>Loser: {fightResult.loser}</p>
          <p>Rounds: {fightResult.rounds}</p>
          <p>Loot: ${fightResult.loot.toLocaleString()}</p>
        </OpponentCard>
      )}

      <Modal isOpen={showEnableModal} onClose={() => setShowEnableModal(false)}>
        <ModalTitle>Enable PvP</ModalTitle>
        <p>Do you want to enable PvP mode?</p>
        <SearchButton onClick={handleEnablePvp}>Enable PvP</SearchButton>
      </Modal>
    </PvpContainer>
  );
};

export default Pvp;
