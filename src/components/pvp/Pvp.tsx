import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IUserInfo } from "../interfaces/user.interface";
import { useMultiplayer } from "../../hooks/useMultiplayer";
import PlayerCard from "./PlayerCard";
import InfoModal from "./InfoModal";
import styled from "styled-components";
import {
  FaTrophy,
  FaSkull,
  FaBullseye,
  FaFistRaised,
  FaHeart,
  FaBomb,
  FaShieldAlt,
  FaDollarSign,
  FaClock,
} from "react-icons/fa";
import { GiDodging, GiPunchBlast } from "react-icons/gi";
import { SocialChannel } from "../interfaces/social.interface";

const PvpContainer = styled.div`
  background-color: #000000;
  height: 100em;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;

  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  -webkit-overflow-scrolling: touch;
  max-height: calc(100vh - 120px);
`;

const PvpContent = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  margin-bottom: 4rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

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

const ExplosionAnimation = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: #ff9900;
  text-shadow: 0 0 10px #ff9900;
`;

const AttackButton = styled.button`
  background-color: #ff4136;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff1a1a;
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const SpinnerContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

interface PvpProps {
  userInfo: IUserInfo;
  setUserInfo: (value: React.SetStateAction<IUserInfo>) => void;
}

type CombatState = "idle" | "searching" | "ready" | "fighting" | "result";

export default function Pvp({ userInfo, setUserInfo }: PvpProps) {
  const {
    searchPlayer,
    startFight,
    loading,
    error,
    combatResult,
    setCombatResult,
  } = useMultiplayer(userInfo, setUserInfo);
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [opponent, setOpponent] = useState<any>(null);
  const [combatState, setCombatState] = useState<CombatState>("idle");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  const statIcons = [
    {
      icon: FaTrophy,
      label: "Victories",
      description: "Total number of PvP battles won",
    },
    {
      icon: FaSkull,
      label: "Defeats",
      description: "Total number of PvP battles lost",
    },
    {
      icon: FaBullseye,
      label: "Accuracy",
      description: "Chance to hit the opponent in battle",
    },
    {
      icon: FaFistRaised,
      label: "Attacks Today",
      description: "Number of attacks performed today",
    },
    {
      icon: FaHeart,
      label: "Base HP",
      description: "Base health points of the character",
    },
    {
      icon: FaBomb,
      label: "Damage",
      description: "Amount of damage dealt in battles",
    },
    {
      icon: GiDodging,
      label: "Evasion",
      description: "Chance to dodge enemy attacks",
    },
    {
      icon: FaShieldAlt,
      label: "Protection",
      description: "Percentage of damage reduction",
    },
  ];

  useEffect(() => {
    const social = userInfo.socials?.find((s) => s.channel === SocialChannel.TELEGRAM_CHANNEL);
    if (!social?.member) {
      setShowEnableModal(true);
    }
  }, [userInfo]);

  const handleEnablePvp = async () => {
    // await enablePvp();
    setShowEnableModal(false);
  };

  const handleSearch = useCallback(async () => {
    setCombatState("searching");
    setCombatResult(null);
    setOpponent(null);
    const players = await searchPlayer();
    if (players && players.length > 0) {
      const opponentData = players[0];
      setOpponent({
        ...opponentData,
        health: opponentData.maxHealth || 1000,
        maxHealth: opponentData.maxHealth || 1000,
        image: opponentData.image || "/assets/pvp/userImage.png",
      });
      setCombatState("ready");
    } else {
      setCombatState("idle");
    }
  }, [searchPlayer, setCombatResult]);

  const handleAttack = useCallback(async () => {
    if (!opponent) return;
    setCombatState("fighting");
    await startFight(userInfo.id, opponent.id);
    setTimeout(() => {
      setCombatState("result");
    }, 2000); // Adjust this timing as needed
  }, [opponent, startFight, userInfo.id]);

  const handleButtonClick = useCallback(() => {
    switch (combatState) {
      case "idle":
      case "result":
        handleSearch();
        break;
      case "ready":
        handleAttack();
        break;
    }
  }, [combatState, handleSearch, handleAttack]);

  const handleInfoClick = useCallback((player: any) => {
    setSelectedPlayer(player);
    setIsInfoModalOpen(true);
  }, []);

  return (
    <PvpContainer className="scrollable-content">
      <PvpContent>
        <h1 className="text-3xl font-bold mb-1 text-center text-white">
          Cartel War
        </h1>
        <AnimatePresence mode="wait">
          {combatState === "result" && combatResult && (
            <ResultContainer
              key="result"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ResultHeader>
                <ResultTitle>
                  {combatResult.winner === userInfo.username
                    ? "Victory!"
                    : "Defeat!"}
                </ResultTitle>
                <ResultIcon
                  color={
                    combatResult.winner === userInfo.username
                      ? "#48bb78"
                      : "#e53e3e"
                  }
                >
                  {combatResult.winner === userInfo.username ? (
                    <FaTrophy />
                  ) : (
                    <FaSkull />
                  )}
                </ResultIcon>
              </ResultHeader>
              <ResultContent>
                <ResultItem>
                  <ResultItemIcon>
                    <FaDollarSign />
                  </ResultItemIcon>
                  Loot: <ResultItemValue>${combatResult.loot}</ResultItemValue>
                </ResultItem>
                <ResultItem>
                  <ResultItemIcon>
                    <FaClock />
                  </ResultItemIcon>
                  Rounds:{" "}
                  <ResultItemValue>{combatResult.rounds}</ResultItemValue>
                </ResultItem>
                <ResultItem>
                  <ResultItemIcon>
                    <FaSkull />
                  </ResultItemIcon>
                  <ResultItemValue>{combatResult.loser} Lost</ResultItemValue>
                </ResultItem>
              </ResultContent>
            </ResultContainer>
          )}
          {(combatState === "ready" || combatState === "fighting") &&
            opponent && (
              <motion.div
                key="opponent"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PlayerCard
                  player={opponent}
                  title="Opponent"
                  isAttacking={combatState === "fighting"}
                  isDefending={combatState === "fighting"}
                  onInfoClick={() => handleInfoClick(opponent)}
                />
              </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
          {combatState === "searching" && (
            <SpinnerContainer
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </SpinnerContainer>
          )}
        </AnimatePresence>

        <div className="my-6 flex justify-center">
          <button
            onClick={handleButtonClick}
            disabled={combatState === "fighting" || combatState === "searching"}
            className={`px-6 py-3 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105 ${
              combatState === "ready"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {combatState === "searching"
              ? "Searching..."
              : combatState === "fighting"
              ? "Attacking..."
              : combatState === "ready"
              ? "Attack Opponent"
              : "Search for Opponent"}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PlayerCard
            player={userInfo}
            title="You"
            isAttacking={combatState === "fighting"}
            isDefending={combatState === "fighting"}
            onInfoClick={() => handleInfoClick(userInfo)}
          />
        </motion.div>

        {showEnableModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-lg p-8 max-w-md w-full"
            >
              <h3 className="font-bold text-2xl mb-4">Enable PvP</h3>
              <p className="text-gray-600 mb-6">
                Do you want to enable PvP mode and enter the arena?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowEnableModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnablePvp}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Enable PvP
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <InfoModal
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
        >
          {selectedPlayer && (
            <>
              <h2 className="text-xl font-bold mb-4">
                Player Stats: {selectedPlayer.username}
              </h2>
              <ul className="space-y-4">
                {statIcons.map((stat, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-2xl mr-4">
                      <stat.icon />
                    </span>
                    <div>
                      <strong className="block">{stat.label}</strong>
                      <span className="text-sm text-gray-600">
                        {stat.description}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </InfoModal>
      </PvpContent>
    </PvpContainer>
  );
}
