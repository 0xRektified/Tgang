import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSkull,
  FaCoins,
  FaSpinner,
  FaTrophy,
  FaTimesCircle,
} from "react-icons/fa";
import { GiPistolGun } from "react-icons/gi";
import styled from "styled-components";
import { formatPrice } from "../utils/formater";

import { CombatState } from "./Pvp";
import { IHistoryBattleResult } from "../interfaces/multiplayer.interface";
import { EProductIcon } from "../interfaces/product.interface";
import PlayerCard from "./PlayerCard"; // Import the PlayerCard component
import { IUserInfo } from "../interfaces/user.interface";

const PvpCard = styled.div`
  background-color: #34373e;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px #636363;
  overflow: hidden;
  position: relative;
  padding: 1rem;
  border: 2px solid #636363;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-family: "Roboto", sans-serif;
`;

const PvpTitle = styled.h1`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2rem;
  margin-bottom: 0;
  font-weight: 700;
`;

const PvpButton = styled.button`
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  &:hover {
    box-shadow: 0 0 10px #1e90ff;
  }

  svg {
    font-size: 1rem;
  }
`;

const PvpButtonDeatchmatch = styled(PvpButton)`
  animation: glow 1.5s infinite alternate;
  padding: 0.5rem 0.75rem;
  width: 100%;
  margin: 0 auto;
`;

const RewardInfo = styled.div`
  background-color: rgba(74, 144, 226, 0.1);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 0.5rem;
  padding: 0.75rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
  font-size: 1rem;
`;

const StatDesc = styled.span`
  font-weight: 600;
  color: white;
  margin: 0 0.5rem;
`;

const RewardAmount = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const CombatHistoryTitle = styled.h3`
  margin-top: 0;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CombatHistoryList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const CombatHistoryItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  background-color: rgba(255, 255, 255, 0.05);
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;

  &:last-child {
    border-bottom: none;
  }
`;

const BattleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const PlayerName = styled.span`
  font-weight: bold;
`;

const WinnerIcon = styled.span`
  font-size: 1.5rem;
  color: gold;
`;

const LoserIcon = styled.span`
  font-size: 1.5rem;
  color: #ff4136;
`;

const LootInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
`;

const LootItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const CashLoot = styled.span`
  color: #4adf81;
`;

const DateInfo = styled.div`
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.5rem;
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  font-size: 1.5rem;
  color: white;
`;

const ProductIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 0.25rem;
`;

const ArmoryButton = styled(PvpButton)`
  background-color: #4a5568;
  border: 2px solid #718096;
  color: #e2e8f0;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2d3748;
    border-color: #a0aec0;
    box-shadow: 0 0 15px rgba(160, 174, 192, 0.5);
  }

  svg {
    font-size: 1.3rem;
    margin-right: 0.5rem;
  }
`;

const getProductIcon = (productName: string): string => {
  return EProductIcon[productName as keyof typeof EProductIcon] || "❓";
};

const Separator = styled.hr`
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.75),
    rgba(255, 255, 255, 0)
  );
  margin: 1rem 0;
`;

interface PvpHeaderProps {
  userInfo: IUserInfo;
  attacksLeft: number;
  totalAttacks: number;
  onGetMoreAttacks: () => void;
  onDeathmatchClick: () => void;
  onArmoryClick: () => void;
  combatState: CombatState;
  battleHistory: IHistoryBattleResult[];
  isHistoryLoading: boolean;
}

export const PvpHeader: React.FC<PvpHeaderProps> = ({
  userInfo,
  attacksLeft,
  totalAttacks,
  onGetMoreAttacks,
  onDeathmatchClick,
  onArmoryClick,
  combatState,
  battleHistory,
  isHistoryLoading,
}) => {
  return (
    <AnimatePresence>
      {combatState === "idle" && (
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
        >
          <PvpCard>
            <PvpTitle>
              <GiPistolGun /> Cartel War
            </PvpTitle>

            <PvpButtonDeatchmatch onClick={onDeathmatchClick}>
              <FaSkull /> Deathmatch
            </PvpButtonDeatchmatch>
            <RewardInfo>
              <FaCoins />
              <StatDesc>Attacks Available:</StatDesc>
              <RewardAmount>
                {attacksLeft} / {totalAttacks}
              </RewardAmount>
            </RewardInfo>

            <div>
              <PlayerCard
                player={userInfo}
                title="You"
                isAttacking={false}
                isDefending={false}
                onInfoClick={() => {}}
                health={userInfo.pvp?.healthPoints || 100}
                maxHealth={userInfo.pvp?.healthPoints || 100}
                damageReceived={undefined}
                light={true}
              />
            </div>

            <Separator />

            <CombatHistoryTitle>Combat History</CombatHistoryTitle>
            {isHistoryLoading ? (
              <LoadingSpinner />
            ) : (
              <CombatHistoryList>
                {battleHistory.slice(0, 5).map((battle) => (
                  <CombatHistoryItem key={battle.battleId}>
                    <BattleHeader>
                      <PlayerName>{battle.attacker.username}</PlayerName>
                      <span>vs</span>
                      <PlayerName>{battle.defender.username}</PlayerName>
                    </BattleHeader>
                    <LootInfo>
                      {battle.winner === battle.attacker.id.toString() ? (
                        <WinnerIcon>
                          <FaTrophy />
                        </WinnerIcon>
                      ) : (
                        <LoserIcon>
                          <FaTimesCircle />
                        </LoserIcon>
                      )}
                      <LootItem>
                        <CashLoot>
                          {formatPrice(battle.cashLoot, false)}
                        </CashLoot>
                      </LootItem>
                      {battle.productLoot.map((loot, index) => (
                        <LootItem key={index}>
                          <ProductIcon>{getProductIcon(loot.name)}</ProductIcon>
                          {loot.quantity}
                        </LootItem>
                      ))}
                    </LootInfo>
                    {/* <DateInfo>
                      {new Date(battle.createdAt).toLocaleString()}
                    </DateInfo> */}
                  </CombatHistoryItem>
                ))}
              </CombatHistoryList>
            )}
          </PvpCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
