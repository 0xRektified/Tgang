import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IUserInfo } from "../interfaces/user.interface";
import { useMultiplayer } from "../../hooks/useMultiplayer";
import PlayerCard from "./PlayerCard";
import styled from "styled-components";

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
  background-color: #1c1c1e;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

const ResultContainer = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #ffffff;
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

interface PvpProps {
  userInfo: IUserInfo;
}

export default function Pvp({ userInfo }: PvpProps) {
  console.log(userInfo);
  const { searchPlayer, startFight, enablePvp, loading, error } =
    useMultiplayer();
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [opponent, setOpponent] = useState<any>(null);
  const [combatResult, setCombatResult] = useState<any>(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackAnimation, setAttackAnimation] = useState({
    attacker: "",
    defender: "",
  });
  const [isSearching, setIsSearching] = useState(false);
  const [player, setPlayer] = useState({
    ...userInfo,
    health: userInfo.pvp?.baseHp || 1000,
    maxHealth: userInfo.pvp?.baseHp || 1000,
    image: "/assets/pvp/userImage.png",
  });
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    if (!userInfo.pvp || !userInfo.pvp.pvpEnabled) {
      setShowEnableModal(true);
    }
  }, [userInfo]);

  const handleEnablePvp = async () => {
    await enablePvp();
    setShowEnableModal(false);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    const players = await searchPlayer();
    if (players && players.length > 0) {
      const opponentData = players[0];
      setOpponent({
        ...opponentData,
        health: opponentData.maxHealth || 1000,
        maxHealth: opponentData.maxHealth || 1000,
        image: opponentData.image || "/assets/pvp/userImage.png",
      });
      setPlayer((prev) => ({ ...prev, health: prev.maxHealth }));
      setCombatResult(null);
      setIsAttacking(false);
    }
    setIsSearching(false);
  };

  const handleAttack = useCallback(async () => {
    if (!opponent) return;
    setIsAttacking(true);
    setAttackAnimation({
      attacker: player.username,
      defender: opponent.username,
    });
    const result = await startFight(userInfo.id, opponent.id);
    setCombatResult(result);
    setShowExplosion(true);
    setTimeout(() => {
      setIsAttacking(false);
      setShowExplosion(false);
    }, 2000);
    setAttackAnimation({ attacker: "", defender: "" });
  }, [opponent, startFight, userInfo.id, player.username]);

  const handleButtonClick = async () => {
    if (opponent) {
      await handleAttack();
    } else {
      await handleSearch();
    }
  };

  return (
    <PvpContainer className="scrollable-content">
      <PvpContent>
        <h1 className="text-3xl font-bold mb-1 text-center text-white">
          Cartel War
        </h1>
        <div className="mt-6 flex flex-col items-center">
          <AnimatePresence>
            {combatResult && (
              <ResultContainer
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-xl font-bold mb-2">
                  {combatResult.winner === userInfo.username
                    ? "Victory!"
                    : "Defeat!"}
                </h2>
                <p>
                  {combatResult.winner === userInfo.username
                    ? `You stole $${combatResult.amountStolen} from ${opponent.username}!`
                    : `${opponent.username} stole $${combatResult.amountStolen} from you!`}
                </p>
              </ResultContainer>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {showExplosion && (
            <ExplosionAnimation
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: [0, 1.5, 1], rotate: [0, 180, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              💥
            </ExplosionAnimation>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {opponent ? (
            <motion.div
              key="opponent"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <PlayerCard
                player={opponent}
                title="Opponent"
                isAttacking={attackAnimation.attacker === opponent.username}
                isDefending={attackAnimation.defender === opponent.username}
              />
            </motion.div>
          ) : (
            <motion.div
              key="no-opponent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <div className="text-4xl mb-2">🎭</div>
                <p className="text-lg font-semibold">No opponent</p>
                <p className="text-sm text-gray-600">Search to start battle!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6 flex justify-center">
          <button
            onClick={handleButtonClick}
            disabled={isAttacking || isSearching}
            className={`px-6 py-3 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105 ${
              opponent
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSearching
              ? "Searching..."
              : isAttacking
              ? "Attacking..."
              : opponent
              ? "Attack Opponent"
              : "Search for Opponent"}
          </button>
        </div>

        {loading && (
          <div className="text-center p-4 bg-blue-100 rounded-lg mb-8">
            <p className="text-blue-800 font-semibold">Loading...</p>
          </div>
        )}
        {error && (
          <div className="text-center p-4 bg-red-100 rounded-lg mb-8">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PlayerCard
              player={player}
              title="You"
              isAttacking={attackAnimation.attacker === player.username}
              isDefending={attackAnimation.defender === player.username}
            />
          </motion.div>
        </div>

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
      </PvpContent>
    </PvpContainer>
  );
}
