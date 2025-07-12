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

import {
  CRAFTABLE_ITEMS,
  ECRAFTABLE_ITEM,
} from "../interfaces/craftableItem.interface";

const PvpWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const PvpContainer = styled.div`
  background-color: #1c1c1e;
  height: 100em;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled.button`
  background-color: #27272a;
  color: white;
  border: 2px solid #1e90ff;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 5px #1e90ff;

  &:hover {
    box-shadow: 0 0 10px #1e90ff;
  }

  &:disabled {
    background-color: #4a5568;
    border-color: #4a5568;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

interface PvpProps {
  userInfo: IUserInfo;
  setUserInfo: (value: React.SetStateAction<IUserInfo>) => void;
  socials: Record<SocialChannel, SocialData>;
  referralToken: string;
}

export type CombatState =
  | "idle"
  | "searching"
  | "ready"
  | "fighting"
  | "result";

// Add this interface to define the structure of an active effect
interface ActiveEffect {
  itemId: ECRAFTABLE_ITEM;
  effect: Record<string, number>;
  remainingRounds: number;
}

export default function Pvp({
  userInfo,
  setUserInfo,
  socials,
  referralToken,
}: PvpProps) {
  const {
    searchPlayer,
    startFight,
    combatAction,
    fetchBattleHistory,
    upsertBattleResult,
    fetchuser,
    battleHistory,
    loading: multiplayerLoading,
    error: multiplayerError,
    errorCode,
    successMessage: multiplayerSuccessMessage,
    maxAttacksReached,
    socialNetworkRequired,
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

  const [collectingRewards, setCollectingRewards] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);

  const userControls = useAnimation();
  const opponentControls = useAnimation();

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const [searchingStep, setSearchingStep] = useState<"searching" | "starting">(
    "searching",
  );
  const [isAttacking, setIsAttacking] = useState(false);
  const [specialItem, setSpecialItem] = useState<ECRAFTABLE_ITEM | null>(null);

  const [userHasActiveEffect, setUserHasActiveEffect] = useState(false);
  const [opponentHasActiveEffect, setOpponentHasActiveEffect] = useState(false);

  const [userItemUsed, setUserItemUsed] = useState<{
    itemId: ECRAFTABLE_ITEM;
    effects: Record<string, number>;
  } | null>(null);

  const [userActiveEffects, setUserActiveEffects] = useState<ActiveEffect[]>(
    [],
  );
  const [opponentActiveEffects, setOpponentActiveEffects] = useState<
    ActiveEffect[]
  >([]);

  const [userItems, setUserItems] = useState(userInfo.craftedItems || []);

  // Update userItems when userInfo changes
  useEffect(() => {
    setUserItems(userInfo.craftedItems || []);
  }, [userInfo]);

  const playSound = (sound: string) => {
    const audio = new Audio(sound);
    audio.volume = 0.4;
    audio.play();
  };

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (socialNetworkRequired) {
      setIsChannelModalOpen(true);
    }
  }, [socialNetworkRequired]);

  const resetCombatState = useCallback(() => {
    setUserDamageReceived(undefined);
    setOpponentDamageReceived(undefined);
    setUserHealth(userInfo.pvp?.healthPoints || 100);
    setOpponentHealth(opponent?.pvp?.healthPoints || 100);
  }, [userInfo.pvp?.healthPoints, opponent]);

  const simulateCombat = useCallback(
    async (combatResult: IBattle, isSpecialItemUse: boolean = false) => {
      console.log(combatResult);
      if (!opponent) return;
      let currentUserHealth = userHealth;
      let currentOpponentHealth = opponentHealth;
      const round =
        combatResult.roundResults[combatResult.roundResults.length - 1];

      // Update user stats based on active effects
      const activeEffect = combatResult.attacker.pvp.activeEffects[0];
      if (activeEffect) {
        setUserItemUsed({
          itemId: activeEffect.itemId as ECRAFTABLE_ITEM,
          effects: activeEffect.effect,
        });
      } else {
        setUserItemUsed(null);
      }

      // Skip attacker's turn if it's a special item use
      if (!isSpecialItemUse) {
        setOpponentDamageReceived(round.attackerDamage);
        await userControls.start({
          x: [0, 15, 0],
          transition: { duration: 0.25 },
        });

        if (round.attackerDamage > 0 && currentOpponentHealth > 0) {
          playSound("/assets/sounds/melehit.wav");
          WebApp.HapticFeedback.impactOccurred("rigid");
          await opponentControls.start({
            rotate: [0, -7, 7, 0],
            transition: { duration: 0.25 },
          });
          currentOpponentHealth = Math.max(
            0,
            currentOpponentHealth - round.attackerDamage,
          );
          setOpponentHealth(currentOpponentHealth);
        } else if (currentOpponentHealth > 0) {
          playSound("/assets/sounds/melemiss.wav");
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
        setOpponentDamageReceived(undefined);
      }

      // Defender's turn (only if opponent is still alive)
      if (currentOpponentHealth > 0) {
        setUserDamageReceived(round.defenderDamage);
        await opponentControls.start({
          x: [0, -15, 0],
          transition: { duration: 0.25 },
        });

        if (round.defenderDamage > 0) {
          playSound("/assets/sounds/melehit.wav");
          WebApp.HapticFeedback.impactOccurred("rigid");
          await userControls.start({
            rotate: [0, -7, 7, 0],
            transition: { duration: 0.25 },
          });
          currentUserHealth = Math.max(
            0,
            currentUserHealth - round.defenderDamage,
          );
          setUserHealth(currentUserHealth);
        } else {
          playSound("/assets/sounds/melemiss.wav");
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
        setUserDamageReceived(undefined);

        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setCombatResult(combatResult);

      if (combatResult.winner) {
        setCombatState("result");
      } else {
        setCombatState("fighting");
      }

      setCurrentBattle(combatResult);

      // Check for active effects
      setUserHasActiveEffect(
        combatResult.attacker.pvp.activeEffects?.length > 0,
      );
      setOpponentHasActiveEffect(
        combatResult.defender.pvp.activeEffects?.length > 0,
      );

      // Update user active effects
      const newUserActiveEffects = combatResult.attacker.pvp.activeEffects.map(
        (effect) => ({
          itemId: effect.itemId as ECRAFTABLE_ITEM,
          effect: effect.effect,
          remainingRounds: effect.remainingRounds,
        }),
      );
      setUserActiveEffects(newUserActiveEffects);

      // Update opponent active effects
      const newOpponentActiveEffects =
        combatResult.defender.pvp.activeEffects.map((effect) => ({
          itemId: effect.itemId as ECRAFTABLE_ITEM,
          effect: effect.effect,
          remainingRounds: effect.remainingRounds,
        }));
      setOpponentActiveEffects(newOpponentActiveEffects);

      // Update health if a health potion was used
      const healthPotion = newUserActiveEffects.find((effect) =>
        effect.itemId.includes("HEALTH_POTION"),
      );
      if (healthPotion) {
        const newHealth = Math.min(
          userInfo.pvp?.healthPoints || 100,
          currentUserHealth + (healthPotion.effect.healthPoints || 0),
        );
        setUserHealth(newHealth);
      }
    },
    [
      opponent,
      userControls,
      opponentControls,
      userHealth,
      opponentHealth,
      userInfo.pvp?.healthPoints,
    ],
  );

  const handleDeathmatchClick = useCallback(async () => {
    setCombatState("searching");
    setOpponent(null);
    resetCombatState();
    setSearchingStep("searching");

    try {
      const players = await searchPlayer();
      if (players && players.length > 0) {
        const opponentId = players[0].id;
        setSearchingStep("starting");
        const result = await startFight(userInfo.id, opponentId);
        console.log(result);

        if (result) {
          const opponentData = result.opponent || players[0];
          const opponentHealth =
            result.defender.pvp.healthPoints || players[0]?.pvp?.healthPoints;
          setOpponentHealth(opponentHealth || 100);
          setUserHealth(result.attacker.pvp.healthPoints || 100);
          setOpponent({
            ...opponentData,
            image: "/assets/pvp/userImage.png",
          });

          // Update active effects for both user and opponent
          if (result.attacker.pvp.activeEffects) {
            const userActiveEffects = result.attacker.pvp.activeEffects.map(
              (effect) => ({
                itemId: effect.itemId as ECRAFTABLE_ITEM,
                effect: effect.effect,
                remainingRounds: effect.remainingRounds,
              }),
            );
            setUserActiveEffects(userActiveEffects);
          }

          if (result.defender.pvp.activeEffects) {
            const opponentActiveEffects = result.defender.pvp.activeEffects.map(
              (effect) => ({
                itemId: effect.itemId as ECRAFTABLE_ITEM,
                effect: effect.effect,
                remainingRounds: effect.remainingRounds,
              }),
            );
            setOpponentActiveEffects(opponentActiveEffects);
          }
          // Set user and opponent active effect flags
          setUserHasActiveEffect(userActiveEffects.length > 0);
          setOpponentHasActiveEffect(opponentActiveEffects.length > 0);

          // Update special item
          const activeItem = userActiveEffects[0]?.itemId;
          const selectedItems = result.attacker.selectedItems;

          if (activeItem) {
            setSpecialItem(activeItem);
            setUserItemUsed({
              itemId: activeItem,
              effects: userActiveEffects[0].effect,
            });
          } else if (selectedItems && selectedItems.length > 0) {
            setSpecialItem(selectedItems[0].itemId as ECRAFTABLE_ITEM);
          } else {
            setSpecialItem(null);
            setUserItemUsed(null);
          }

          setCombatState("fighting");
          setCurrentBattle(result);
          await simulateCombat(result);
        }
      } else {
        setCombatState("idle");
      }
    } catch (error) {
      console.error("Error in deathmatch:", error);
      setCombatState("idle");
      if (socialNetworkRequired) {
        setIsChannelModalOpen(true);
      }
    }
  }, [
    searchPlayer,
    resetCombatState,
    startFight,
    userInfo.id,
    simulateCombat,
    socialNetworkRequired,
  ]);

  const handleAttack = useCallback(async () => {
    if (!opponent || !currentBattle || isAttacking) return;

    setIsAttacking(true);
    try {
      const result = await combatAction(currentBattle.battleId);
      if (result) {
        await simulateCombat(result);
      }
    } catch (error) {
      console.error("Attack error:", error);
    } finally {
      setIsAttacking(false);
    }
  }, [opponent, currentBattle, combatAction, simulateCombat, isAttacking]);

  const handleUseSpecialItem = useCallback(
    async (itemId: ECRAFTABLE_ITEM) => {
      if (!opponent || !currentBattle || isAttacking) return;

      setIsAttacking(true);
      try {
        const result = await combatAction(currentBattle.battleId, itemId);
        if (result && multiplayerSuccessMessage) {
          await simulateCombat(result, true);
          setSpecialItem(null);

          // Fetch updated user info after using an item
          const updatedUserInfo = await fetchuser();
          if (updatedUserInfo) {
            setUserInfo(updatedUserInfo);
            setUserItems(updatedUserInfo.craftedItems || []);
            console.log("Updated user items:", updatedUserInfo.craftedItems); // Add this log
          }
        } else {
          setUserItemUsed(null);
          console.error(
            "Failed to use special item:",
            multiplayerSuccessMessage || "Unknown error",
          );
        }
      } catch (error) {
        console.error("Use special item error:", error);
        setUserItemUsed(null);
      } finally {
        setIsAttacking(false);
      }
    },
    [
      opponent,
      currentBattle,
      combatAction,
      simulateCombat,
      isAttacking,
      multiplayerSuccessMessage,
      fetchuser,
      setUserInfo,
    ],
  );

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
    if (!combatResult || combatResult.winner !== "attacker") {
      fetchuser();
      return;
    }

    setCollectingRewards(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setCollectingRewards(false);

    fetchuser();

    upsertBattleResult(combatResult);

    setCombatState("idle");
    setOpponent(null);
    setCombatResult(null);
  }, [combatResult, setUserInfo, upsertBattleResult]);

  const handleTryAgain = useCallback(() => {
    fetchuser();
    setCombatState("idle");
    setOpponent(null);
    setCombatResult(null);
  }, []);

  const handleJoinChannel = useCallback(() => {
    const telegramChannel = socials[SocialChannel.TELEGRAM_CHANNEL];
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

  const handleReturnToMain = useCallback(() => {
    setCombatState("idle");
  }, []);

  const error = multiplayerError || verifyError || joinError;

  useEffect(() => {
    fetchBattleHistory();
  }, [fetchBattleHistory]);

  useEffect(() => {
    if (socialNetworkRequired) {
      setIsChannelModalOpen(true);
    }
  }, [socialNetworkRequired]);

  return (
    <PvpWrapper>
      <PvpContainer className="scrollable-content">
        <PvpContent>
          <PvpHeader
            userInfo={userInfo}
            attacksLeft={
              (userInfo.pvp?.attacksAvailable ?? 0) -
              (userInfo.pvp?.attacksToday ?? 0)
            }
            totalAttacks={totalAttacks}
            onGetMoreAttacks={handleGetMoreAttacks}
            onArmoryClick={handleArmoryClick}
            onDeathmatchClick={handleDeathmatchClick}
            combatState={combatState}
            battleHistory={battleHistory}
            isHistoryLoading={multiplayerLoading}
            referralToken={referralToken}
            userItems={userInfo.craftedItems || []}
          />

          <AnimatePresence>
            {combatState !== "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {combatState === "searching" &&
                  !maxAttacksReached &&
                  !socialNetworkRequired && (
                    <div className="flex flex-col items-center justify-center space-y-4 mt-4">
                      <FaSpinner className="animate-spin text-4xl text-white" />
                      <p className="text-white text-lg">
                        {searchingStep === "searching"
                          ? "Looking for Opponent..."
                          : "Starting Fight..."}
                      </p>
                    </div>
                  )}

                {maxAttacksReached && (
                  <div className="flex flex-col items-center justify-center space-y-4 mt-4 mb-10">
                    <p className="text-white text-lg  mb-5">
                      You have reached the maximum number of fights for today,
                      come back tomorrow
                    </p>
                    <StyledButton onClick={handleReturnToMain}>
                      Return to Main Page
                    </StyledButton>
                  </div>
                )}

                {!maxAttacksReached && socialNetworkRequired && (
                  <div className="flex flex-col items-center justify-center space-y-4 mt-4  mb-10">
                    <p className="text-white text-lg  mb-5">
                      You need to join our social network to participate in PvP.
                    </p>
                    <StyledButton onClick={handleReturnToMain}>
                      Return to Main Page
                    </StyledButton>
                  </div>
                )}

                {(combatState === "ready" || combatState === "fighting") &&
                  opponent && (
                    <>
                      <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <motion.div animate={opponentControls}>
                          <PlayerCard
                            player={opponent}
                            health={opponentHealth}
                            maxHealth={opponent.pvp?.healthPoints || 100}
                            damageReceived={opponentDamageReceived}
                            light={false}
                            activeEffects={opponentActiveEffects}
                          />
                        </motion.div>
                      </motion.div>
                      <PvpControls
                        combatState={combatState}
                        onAttackClick={handleAttack}
                        onUseSpecialItemClick={handleUseSpecialItem}
                        isWinner={combatResult?.winner === "attacker"}
                        isAttacking={isAttacking}
                        userItems={userItems}
                      />
                    </>
                  )}

                {combatState === "result" && combatResult && (
                  <PvpResult
                    combatResult={combatResult}
                    username={userInfo.username}
                    onCollect={handleCollectAndReturn}
                    onTryAgain={handleTryAgain}
                    collectingRewards={collectingRewards}
                  />
                )}

                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <motion.div animate={userControls}>
                    <PlayerCard
                      player={userInfo}
                      health={userHealth}
                      maxHealth={userInfo.pvp?.healthPoints || 100}
                      damageReceived={userDamageReceived}
                      light={false}
                      activeEffects={userActiveEffects}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <InfoModal
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
          >
            {selectedPlayer && (
              <>
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
      <ApiToast error={error} loading={false} successMessage={null} />
    </PvpWrapper>
  );
}
