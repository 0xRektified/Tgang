import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { IUserInfo } from "../interfaces/user.interface";
import { useMultiplayer } from "../../hooks/useMultiplayer";
import PlayerCard from "./PlayerCard";
import InfoModal from "./InfoModal";
import styled from "styled-components";
import { PvpHeader } from "./PvpHeader";
import { PvpControls } from "./PvpControls";
import { PvpResult } from "./PvpResult";
import { FaSpinner } from "react-icons/fa";
import { IBattle } from "../interfaces/multiplayer.interface";
import PvpModal from "./PvpModal";
import WebApp from "@twa-dev/sdk";
import { useVerifySocial } from "../../hooks/useVerifySocial";
import { useJoinSocial } from "../../hooks/useJoinSocial";
import { SocialChannel, SocialData } from "../interfaces/social.interface";
import { statIcons } from "./Pvp.constant";
import { ApiToast } from "../ApiToast";

const PvpWrapper = styled.div`
  position: relative;
  height: 100%;
`;

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
  socials: Record<SocialChannel, SocialData>;
}

export type CombatState =
  | "idle"
  | "searching"
  | "ready"
  | "fighting"
  | "result";

export default function Pvp({ userInfo, setUserInfo, socials }: PvpProps) {
  const {
    searchPlayer,
    startFight,
    loading: multiplayerLoading,
    error: multiplayerError,
    errorCode,
    performAttack,
    successMessage: multiplayerSuccessMessage,
  } = useMultiplayer(userInfo, setUserInfo);

  const {
    verifySocial,
    loading: verifyLoading,
    error: verifyError,
    successMessage: verifySuccessMessage,
  } = useVerifySocial();

  const {
    joinSocial,
    loading: joinLoading,
    error: joinError,
    successMessage: joinSuccessMessage,
  } = useJoinSocial();
  const [currentBattle, setCurrentBattle] = useState<IBattle | null>(null);
  const [opponent, setOpponent] = useState<any>(null);
  const [combatState, setCombatState] = useState<CombatState>("idle");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [combatResult, setCombatResult] = useState<IBattle | null>(null);
  const [userHealth, setUserHealth] = useState(
    userInfo.pvp?.healthPoints || 1000,
  );
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
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);

  const userControls = useAnimation();
  const opponentControls = useAnimation();

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (errorCode === 412) {
      setIsChannelModalOpen(true);
    }
  }, [errorCode]);

  const resetCombatState = useCallback(() => {
    setUserDamageReceived(undefined);
    setOpponentDamageReceived(undefined);
    setUserHealth(userInfo.pvp?.healthPoints || 1000);
    setOpponentHealth(opponent?.pvp?.healthPoints || 1000);
  }, [userInfo.pvp?.healthPoints, opponent]);

  const simulateCombat = useCallback(
    async (combatResult: IBattle) => {
      console.log(`combatResult`);
      console.log(combatResult);
      console.log(`opponent`);
      console.log(opponent);
      if (!opponent) return;
      let currentUserHealth = userHealth;
      let currentOpponentHealth = opponentHealth;
      const round =
        combatResult.roundResults[combatResult.roundResults.length - 1];

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

      setCombatResult(combatResult);

      if (combatResult.winner) {
        setCombatState("result");
      } else {
        setCombatState("fighting");
      }

      setCurrentBattle(combatResult);
    },
    [opponent, userControls, opponentControls, userHealth, opponentHealth],
  );

  const handleSearch = useCallback(async () => {
    setCombatState("searching");
    setOpponent(null);
    resetCombatState();

    const players = await searchPlayer();
    if (players && players.length > 0) {
      const opponentData = players[0];
      console.log(`opponentData`);
      console.log(opponentData);
      setOpponentHealth(opponentData.pvp?.healthPoints || 100);
      setOpponent({
        ...opponentData,
        image: "/assets/pvp/userImage.png",
      });
      setCombatState("ready");
    } else {
      setCombatState("idle");
    }
  }, [searchPlayer, resetCombatState]);

  const handleStart = useCallback(async () => {
    const result = await startFight(userInfo.id, opponent.id);
    console.log(`result`);
    console.log(result);
    if (result) {
      setCombatState("fighting");
      setCurrentBattle(result);
      await simulateCombat(result);
    }
  }, [opponent, startFight, userInfo.id, simulateCombat]);

  const handleAttack = useCallback(async () => {
    if (!currentBattle) return;
    const result = await performAttack(currentBattle.battleId);
    if (result) {
      await simulateCombat(result);
    }
  }, [currentBattle, performAttack, simulateCombat]);

  const handleButtonClick = useCallback(() => {
    console.log("Button Clicked", combatState);
    switch (combatState) {
      case "idle":
        handleSearch();
        break;
      case "ready":
        handleStart();
        break;
      case "fighting":
        handleAttack();
        break;
      case "result":
        setCombatState("idle");
        setOpponent(null);
        setCombatResult(null);
        resetCombatState();
        break;
    }
  }, [combatState, handleSearch, handleStart, handleAttack, resetCombatState]);

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

  const handleCollectAndReturn = useCallback(async () => {
    if (!combatResult) return;

    setCollectingRewards(true);

    // Simulate collecting rewards
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setCollectingRewards(false);

    // Update user info with collected rewards
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      cashAmount: prevUserInfo.cashAmount + (combatResult.cashLoot || 0),
      products: prevUserInfo.products.map((product) => {
        const lootedProduct = combatResult.productLoot?.find(
          (p) => p.name === product.name
        );
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

  const handleJoinChannel = useCallback(() => {
    const telegramChannel = socials[SocialChannel.TELEGRAM_CHANNEL];
    console.log(`telegramChannel`);
    console.log(telegramChannel);
    if (telegramChannel) {
      WebApp.openTelegramLink(telegramChannel.url);
      joinSocial(SocialChannel.TELEGRAM_CHANNEL, setIsChannelModalOpen);
    } else {
      console.error("Telegram channel not found in socials data");
    }
  }, [joinSocial, socials]);

  const handleVerifyChannel = useCallback(() => {
    verifySocial(SocialChannel.TELEGRAM_CHANNEL, setUserInfo);
    setIsChannelModalOpen(false);
  }, [verifySocial, setUserInfo]);

  const loading = multiplayerLoading || verifyLoading || joinLoading;
  const error = multiplayerError || verifyError || joinError;
  const successMessage =
    multiplayerSuccessMessage || verifySuccessMessage || joinSuccessMessage;
  console.log(`error`);
  console.log(error);
  console.log(`successMessage`);
  console.log(successMessage);
  return (
    <PvpWrapper>
      <PvpContainer className="scrollable-content">
        <PvpContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={combatState === "fighting" ? "fighting" : combatState}
              className={
                combatState !== "fighting"
                  ? "w-full animate-slide-in-from-right-bounce"
                  : "w-full"
              }
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

              {(combatState === "ready" || combatState === "fighting") &&
                opponent && (
                  <motion.div animate={opponentControls}>
                    <PlayerCard
                      player={opponent}
                      title="Opponent"
                      isAttacking={combatState === "fighting"}
                      isDefending={combatState === "fighting"}
                      onInfoClick={() => handleInfoClick(opponent)}
                      health={opponentHealth}
                      maxHealth={opponent.pvp?.healthPoints || 100}
                      damageReceived={opponentDamageReceived}
                    />
                  </motion.div>
                )}

              {combatState === "result" && combatResult && (
                <PvpResult
                  combatResult={combatResult}
                  username={userInfo.username}
                  onCollect={handleCollectAndReturn}
                  collectingRewards={collectingRewards}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <PvpControls
            combatState={combatState}
            onButtonClick={handleButtonClick}
            isWinner={combatResult?.winner === "attacker"}
          />

          <motion.div animate={userControls}>
            <PlayerCard
              player={userInfo}
              title="You"
              isAttacking={combatState === "fighting"}
              isDefending={combatState === "fighting"}
              onInfoClick={() => handleInfoClick(userInfo)}
              health={userHealth}
              maxHealth={userInfo.pvp?.healthPoints || 100}
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

          <PvpModal
            isOpen={isChannelModalOpen}
            onClose={() => setIsChannelModalOpen(false)}
            title="Join Channel Required"
            onJoin={handleJoinChannel}
            onVerify={handleVerifyChannel}
          >
            <p>You must join our Community channel to participate in PvP.</p>
          </PvpModal>
        </PvpContent>
      </PvpContainer>
      <ApiToast
        loading={loading}
        error={error}
        successMessage={successMessage}
      />
    </PvpWrapper>
  );
}
