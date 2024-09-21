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
import { PvpDoors } from "./PvpDoors";
import {
  FaBomb,
  FaBullseye,
  FaFistRaised,
  FaHeart,
  FaShieldAlt,
  FaSkull,
  FaTrophy,
} from "react-icons/fa";
import { GiDodging } from "react-icons/gi";

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
  const [attacksLeft, setAttacksLeft] = useState(
    userInfo.pvp?.attacksToday || 0,
  );
  const [showDoors, setShowDoors] = useState(false);

  const [doorImages, setDoorImages] = useState<{
    top: string | null;
    bottom: string | null;
  }>({ top: null, bottom: null });

  useEffect(() => {
    const loadImages = async () => {
      const topImage = await import("/assets/multi-door-top.png");
      const bottomImage = await import("/assets/multi-door-bottom.png");
      setDoorImages({ top: topImage.default, bottom: bottomImage.default });
    };
    loadImages();
  }, []);

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
    setShowDoors(true);
    setCombatState("searching");
    setOpponent(null);
    resetCombatState();

    // Animate doors closing
    await new Promise((resolve) => setTimeout(resolve, 500));

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
    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowDoors(false);
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
        setShowDoors(true);
        setTimeout(() => {
          setCombatState("idle");
          setOpponent(null);
          resetCombatState();
          setTimeout(() => {
            setShowDoors(false);
          }, 500);
        }, 500);
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

  // Add a new state for total attacks
  const [totalAttacks, setTotalAttacks] = useState(
    userInfo.pvp?.attacksAvailable || 10,
  ); // Set an initial value, adjust as needed

  return (
    <PvpContainer className="scrollable-content">
      <PvpContent>
        <AnimatePresence mode="wait">
          {combatState === "idle" && (
            <PvpHeader
              attacksLeft={userInfo.pvp?.attacksAvailable ?? 0}
              totalAttacks={totalAttacks}
              onGetMoreAttacks={handleGetMoreAttacks}
              onArmoryClick={handleArmoryClick}
            />
          )}

          {(combatState === "ready" || combatState === "fighting") &&
            opponent && (
              <motion.div
                key="opponent-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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

          {combatState === "result" && combatResult && (
            <PvpResult
              combatResult={combatResult}
              username={userInfo.username}
            />
          )}
        </AnimatePresence>

        <PvpControls
          combatState={combatState}
          onButtonClick={handleButtonClick}
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

        <PvpDoors showDoors={showDoors} doorImages={doorImages} />
      </PvpContent>
    </PvpContainer>
  );
}
