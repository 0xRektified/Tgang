import React, { useState, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { IUserInfo } from "../interfaces/user.interface";
import { ICombatResult, useMultiplayer } from "../../hooks/useMultiplayer";
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
  FaPlus,
  FaWarehouse,
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

const GaugeBar = styled.div`
  width: 100%;
  height: 30px;
  background-color: #2c2c2e;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const GaugeFill = styled(motion.div)`
  height: 100%;
  background-color: #4a90e2;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
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

const DoorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  pointer-events: none;
`;

const Door = styled(motion.div)`
  width: 100%;
  height: 50vh;
  background-image: url('/assets/multi-door.png');
  background-size: cover;
  background-position: center;
  position: absolute;
`;

const TopDoor = styled(Door)`
  top: 0;
`;

const BottomDoor = styled(Door)`
  bottom: 0;
`;

interface PvpProps {
  userInfo: IUserInfo;
  setUserInfo: (value: React.SetStateAction<IUserInfo>) => void;
}

type CombatState = "idle" | "searching" | "ready" | "fighting" | "result";

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
  const [attacksLeft, setAttacksLeft] = useState(userInfo.pvp?.attacksToday || 0);
  const [showDoors, setShowDoors] = useState(false);

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

  const resetCombatState = useCallback(() => {
    setUserDamageReceived(undefined);
    setOpponentDamageReceived(undefined);
    setUserHealth(userInfo.pvp?.baseHp || 100);
    setOpponentHealth(opponent?.pvp?.baseHp || 100);
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
    setShowDoors(true);
    setCombatState("searching");
    setOpponent(null);
    resetCombatState();
    
    // Animate doors closing
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
    
    // Animate doors opening
    await new Promise(resolve => setTimeout(resolve, 500));
    setShowDoors(false);
  }, [searchPlayer, resetCombatState]);

  const handleAttack = useCallback(async () => {
    if (!opponent) return;
    setCombatState("fighting");
    const result = await startFight(userInfo.id, opponent.id);
    if (result) {
      await simulateCombat(result);
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
          attacksToday: (prevUserInfo.pvp?.attacksToday ?? 0) + 1,
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

  const handleGetMoreAttacks = () => {
    // Implement logic to get more attacks
    console.log("Getting more attacks");
  };

  const handleArmoryClick = () => {
    // Implement navigation to Armory view
    console.log("Navigating to Armory");
  };

  return (
    <PvpContainer className="scrollable-content">
      <PvpContent>
        <h1 className="text-3xl font-bold mb-4 text-center text-white">
          Cartel War
        </h1>
        
        <GaugeBar>
          <GaugeFill
            initial={{ width: "0%" }}
            animate={{ width: `${(attacksLeft / 10) * 100}%` }}
          />
        </GaugeBar>
        
        <ButtonGroup>
          <StyledButton onClick={handleGetMoreAttacks}>
            <FaPlus /> Get More Attacks
          </StyledButton>
          <StyledButton onClick={handleArmoryClick}>
            <FaWarehouse /> Armory
          </StyledButton>
        </ButtonGroup>

        <div className="my-6 flex justify-center">
          <button
            onClick={handleSearch}
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
          {showDoors && (
            <DoorContainer>
              <TopDoor
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.5 }}
              />
              <BottomDoor
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </DoorContainer>
          )}
        </AnimatePresence>
      </PvpContent>
    </PvpContainer>
  );
}
