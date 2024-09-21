import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { IUserInfo } from "../interfaces/user.interface";
import { ICombatResult, useMultiplayer } from "../../hooks/useMultiplayer";
import PlayerCard from "./PlayerCard";
import InfoModal from "./InfoModal";
import styled from "styled-components";
import { PvpHeader } from "./PvpHeader";
import { PvpControls } from "./PvpControls";
import { PvpResult } from "./PvpResult";
import {
  FaBomb,
  FaBullseye,
  FaHeart,
  FaShieldAlt,
  FaSkull,
  FaTrophy,
  FaSpinner,
} from "react-icons/fa";
import { GiDodging } from "react-icons/gi";
import { EProductIcon } from "../interfaces/product.interface";
import { BsCash } from "react-icons/bs";

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

interface PvpProps {
  userInfo: IUserInfo;
  setUserInfo: (value: React.SetStateAction<IUserInfo>) => void;
}

export type CombatState =
  | "idle"
  | "searching"
  | "ready"
  | "fighting"
  | "result";

export default function Pvp({ userInfo, setUserInfo }: PvpProps) {
  const { searchPlayer, startFight, loading, error } = useMultiplayer(
    userInfo,
    setUserInfo,
  );
  const [opponent, setOpponent] = useState<any>(null);
  const [combatState, setCombatState] = useState<CombatState>("idle");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [combatResult, setCombatResult] = useState<ICombatResult | null>(null);
  const [userHealth, setUserHealth] = useState(userInfo.pvp?.baseHp || 1000);
  const [opponentHealth, setOpponentHealth] = useState(0);
  const [userDamageReceived, setUserDamageReceived] = useState<
    number | undefined
  >(undefined);
  const [opponentDamageReceived, setOpponentDamageReceived] = useState<
    number | undefined
  >(undefined);
  const [attacksLeft, setAttacksLeft] = useState(
    userInfo.pvp?.attacksToday || 0,
  );
  const [collectingRewards, setCollectingRewards] = useState(false);
  const [rewardPositions, setRewardPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});

  const userControls = useAnimation();
  const opponentControls = useAnimation();

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

  const resetCombatState = useCallback(() => {
    setUserDamageReceived(undefined);
    setOpponentDamageReceived(undefined);
    setUserHealth(userInfo.pvp?.baseHp || 1000);
    setOpponentHealth(opponent?.pvp?.baseHp || 1000);
  }, [userInfo.pvp?.baseHp, opponent]);

  const simulateCombat = useCallback(
    async (combatResult: ICombatResult) => {
      if (!opponent) return;
      let currentUserHealth = userInfo.pvp?.baseHp || 100;
      let currentOpponentHealth = opponent.pvp?.baseHp || 100;

      for (const round of combatResult.roundResults) {
        setOpponentDamageReceived(round.attackerDamage);
        await userControls.start({
          x: [0, 15, 0],
          transition: { duration: 0.25 },
        });

        if (round.attackerDamage > 0) {
          await opponentControls.start({
            rotate: [0, -7, 7, 0],
            transition: { duration: 0.25 },
          });
          currentOpponentHealth -= round.attackerDamage;
          setOpponentHealth(currentOpponentHealth);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
        setOpponentDamageReceived(undefined);

        setUserDamageReceived(round.defenderDamage);
        await opponentControls.start({
          x: [0, -15, 0],
          transition: { duration: 0.25 },
        });

        if (round.defenderDamage > 0) {
          await userControls.start({
            rotate: [0, -7, 7, 0],
            transition: { duration: 0.25 },
          });
          currentUserHealth -= round.defenderDamage;
          setUserHealth(currentUserHealth);
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
        setUserDamageReceived(undefined);

        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setCombatResult(combatResult);
      setCombatState("result");

      setTimeout(() => {
        resetCombatState();
      }, 1000);
    },
    [
      opponent,
      userControls,
      opponentControls,
      userInfo.pvp?.baseHp,
      resetCombatState,
    ],
  );

  const handleSearch = useCallback(async () => {
    setCombatState("searching");
    setOpponent(null);
    resetCombatState();

    const players = await searchPlayer();
    if (players && players.length > 0) {
      const opponentData = players[0];
      setOpponentHealth(opponentData.pvp?.baseHp || 100);
      setOpponent({
        ...opponentData,
        image: opponentData.image || "/assets/pvp/userImage.png",
      });
      setCombatState("ready");
    } else {
      setCombatState("idle");
    }
  }, [searchPlayer, resetCombatState]);

  const handleAttack = useCallback(async () => {
    if (!opponent) return;
    setCombatState("fighting");
    const result = await startFight(userInfo.id, opponent.id);
    if (result) {
      await simulateCombat(result);
      const attacksToday = userInfo.pvp?.attacksToday ?? 0;
      const attacksAvailable = userInfo.pvp?.attacksAvailable ?? 0;
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        pvp: {
          ...prevUserInfo.pvp!,
          victory:
            result.winner === prevUserInfo.username
              ? (prevUserInfo.pvp?.victory ?? 0) + 1
              : prevUserInfo.pvp?.victory ?? 0,
          defeat:
            result.loser === prevUserInfo.username
              ? (prevUserInfo.pvp?.defeat ?? 0) + 1
              : prevUserInfo.pvp?.defeat ?? 0,
          lastAttackDate: new Date(),
          attacksToday: attacksToday + 1,
          attacksAvailable: attacksAvailable - attacksToday + 1,
          lastDefendDate: prevUserInfo.pvp?.lastDefendDate ?? new Date(),
          baseHp: prevUserInfo.pvp?.baseHp ?? 0,
          damage: prevUserInfo.pvp?.damage ?? 0,
          lootPower: prevUserInfo.pvp?.lootPower ?? 0,
        },
        cashAmount:
          result.winner === prevUserInfo.username
            ? prevUserInfo.cashAmount + result.loot
            : prevUserInfo.cashAmount - result.loot,
      }));
    }
  }, [opponent, startFight, userInfo.id, simulateCombat, setUserInfo]);

  const handleButtonClick = useCallback(() => {
    switch (combatState) {
      case "idle":
        handleSearch();
        break;
      case "ready":
        handleAttack();
        break;
      case "result":
        setCombatState("idle");
        setOpponent(null);
        setCombatResult(null);
        resetCombatState();
        break;
    }
  }, [combatState, handleSearch, handleAttack, resetCombatState]);

  const handleInfoClick = useCallback((player: any) => {
    setSelectedPlayer(player);
    setIsInfoModalOpen(true);
  }, []);

  const handleGetMoreAttacks = () => {
    console.log("Getting more attacks");
  };

  const handleArmoryClick = () => {
    console.log("Navigating to Armory");
  };

  const [totalAttacks, setTotalAttacks] = useState(
    userInfo.pvp?.attacksAvailable || 10,
  );

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial size
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCollectAndReturn = useCallback(async () => {
    if (!combatResult) return;

    setCollectingRewards(true);

    const resultElement = document.querySelector('.pvp-result');
    if (resultElement) {
      const rect = resultElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const newRewardPositions: { [key: string]: { x: number; y: number } } = {};

      combatResult.productLoot.forEach((product, index) => {
        const angle = (index / combatResult.productLoot.length) * Math.PI * 2;
        const radius = 100; // Adjust this value to change the spread of the starting positions
        newRewardPositions[product.name] = { 
          x: centerX + Math.cos(angle) * radius, 
          y: centerY + Math.sin(angle) * radius 
        };
      });

      // Position cash slightly below the center
      newRewardPositions.cash = { x: centerX, y: centerY + 50 };

      setRewardPositions(newRewardPositions);
    }

    // Simulate collecting rewards
    await new Promise(resolve => setTimeout(resolve, 1500));

    setCollectingRewards(false);

    // Update user info with collected rewards
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      cashAmount: prevUserInfo.cashAmount + combatResult.loot,
      products: prevUserInfo.products.map(product => {
        const lootedProduct = combatResult.productLoot.find(p => p.name === product.name);
        return lootedProduct
          ? { ...product, quantity: product.quantity + lootedProduct.quantity }
          : product;
      }),
    }));

    // Return to the main menu
    setCombatState("idle");
    setOpponent(null);
    setCombatResult(null);
  }, [combatResult, setUserInfo]);

  return (
    <PvpContainer className="scrollable-content">
      <PvpContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={combatState === "fighting" ? "fighting" : combatState}
            className={combatState !== "fighting" ? "w-full animate-slide-in-from-right-bounce" : "w-full"}
          >
            {combatState === "idle" && (
              <>
                <PvpHeader
                  attacksLeft={userInfo.pvp?.attacksAvailable ?? 0}
                  totalAttacks={totalAttacks}
                  onGetMoreAttacks={handleGetMoreAttacks}
                  onArmoryClick={handleArmoryClick}
                />
              </>
            )}

            {combatState === "searching" && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <FaSpinner className="animate-spin text-4xl text-white" />
                <p className="text-white text-lg">Looking for Opponent...</p>
              </div>
            )}

            {(combatState === "ready" || combatState === "fighting") && opponent && (
              <motion.div animate={opponentControls}>
                <PlayerCard
                  player={opponent}
                  title="Opponent"
                  isAttacking={combatState === "fighting"}
                  isDefending={combatState === "fighting"}
                  onInfoClick={() => handleInfoClick(opponent)}
                  health={opponentHealth}
                  maxHealth={opponent.pvp?.baseHp || 100}
                  damageReceived={opponentDamageReceived}
                />
              </motion.div>
            )}

            {combatState === "result" && combatResult && (
              <PvpResult
                combatResult={combatResult}
                username={userInfo.username}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <PvpControls
          combatState={combatState}
          onButtonClick={handleButtonClick}
          onCollect={handleCollectAndReturn}
          isWinner={combatResult?.winner === userInfo.username}
        />

        <motion.div animate={userControls}>
          <PlayerCard
            player={userInfo}
            title="You"
            isAttacking={combatState === "fighting"}
            isDefending={combatState === "fighting"}
            onInfoClick={() => handleInfoClick(userInfo)}
            health={userHealth}
            maxHealth={userInfo.pvp?.baseHp || 100}
            damageReceived={userDamageReceived}
          />
        </motion.div>

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

        <AnimatePresence>
          {collectingRewards && (
            <>
              {combatResult?.productLoot.map((product, index) => (
                Array.from({ length: Math.min(product.quantity, 15) }).map((_, i) => {
                  const delay = (i * 1000) / Math.min(product.quantity, 15);
                  return (
                    <motion.div
                      key={`${product.name}-${i}`}
                      initial={{ 
                        opacity: 1, 
                        x: rewardPositions[product.name]?.x, 
                        y: rewardPositions[product.name]?.y, 
                        scale: 1 
                      }}
                      animate={{ 
                        opacity: 0, 
                        x: windowSize.width - 50,
                        y: 50,
                        scale: 0.5 
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: delay / 1000,
                        type: "spring",
                        stiffness: 100,
                        damping: 10
                      }}
                      style={{
                        position: 'fixed',
                        fontSize: '2rem',
                        color: 'white',
                        zIndex: 1000,
                      }}
                    >
                      {EProductIcon[product.name as keyof typeof EProductIcon]}
                    </motion.div>
                  );
                })
              ))}
              {Array.from({ length: Math.min(Math.floor(combatResult?.loot ?? 0 / 10) || 0, 15) }).map((_, i) => {
                const delay = (i * 1000) / Math.min(Math.floor(combatResult?.loot ?? 0 / 10) || 0, 15);
                return (
                  <motion.div
                    key={`cash-${i}`}
                    initial={{ 
                      opacity: 1, 
                      x: rewardPositions.cash?.x, 
                      y: rewardPositions.cash?.y, 
                      scale: 1 
                    }}
                    animate={{ 
                      opacity: 0, 
                      x: windowSize.width - 50,
                      y: 50,
                      scale: 0.5 
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: delay / 1000,
                      type: "spring",
                      stiffness: 100,
                      damping: 10
                    }}
                    style={{
                      position: 'fixed',
                      fontSize: '2rem',
                      color: '#00ff00',
                      zIndex: 1000,
                    }}
                  >
                    <BsCash />
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>
      </PvpContent>
    </PvpContainer>
  );
}
