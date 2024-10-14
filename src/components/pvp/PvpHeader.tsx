import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSkull,
  FaCoins,
  FaSpinner,
  FaTrophy,
  FaTimesCircle,
  FaUserFriends,
  FaCheck,
  FaHistory,
} from "react-icons/fa";
import { GiPistolGun, GiRank3 } from "react-icons/gi";
import { PiCopySimpleBold } from "react-icons/pi";
import { formatPrice } from "../utils/formater";
import { CombatState } from "./Pvp";
import { IHistoryBattleResult } from "../interfaces/multiplayer.interface";
import { EProductIcon } from "../interfaces/product.interface";
import PlayerCard from "./PlayerCard";
import { IUserInfo } from "../interfaces/user.interface";
import WebApp from "@twa-dev/sdk";
import styled, { css, keyframes } from "styled-components";
import { GiAk47 } from "react-icons/gi";
import {
  CRAFTABLE_ITEMS,
  ECRAFTABLE_ITEM,
} from "../interfaces/craftableItem.interface";
import CraftedItemModal from "./craftedItemModal";

// Define keyframes before using them
const glowingBorder = keyframes`
  0%, 100% { 
    box-shadow: 0 0 2px rgba(255, 255, 255, 0.1);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }
`;

const subtleBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

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
  background-color: #27272a;
  color: white;
  border: 2px solid #1e90ff;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 5px #1e90ff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.4rem;
  width: 9em;
  margin: 0;
  height: 4em;
  animation: ${glowingBorder} 3s infinite, ${subtleBounce} 2s infinite,
    ${pulse} 2s infinite;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px #1e90ff;
  }

  svg {
    font-size: 1.5rem; // Increase from 1.2rem
    animation: ${pulse} 2s infinite;
    font-weight: bold; // Add this line to make it bolder
  }
`;

const StatDesc = styled.span`
  font-weight: 600;
  color: white;
  margin: 0 0.5rem;
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
  color: white;
`;

const LootInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const LootItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

const CashLoot = styled(LootItem)`
  color: #4adf81;
  font-weight: bold;
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
    font-size: 2rem;
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
`;

const InfoList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: rgba(55, 65, 81, 0.5);
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(75, 85, 99, 0.5);
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #d1d5db;
`;

const InfoValue = styled.span`
  font-weight: 700;
  font-family: "Roboto Mono", monospace;
  color: white;
`;

const FriendCount = styled.span`
  font-weight: 700;
  color: #60a5fa;
`;

const InviteButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);

  &:hover {
    background-color: #2563eb;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.7);
    transform: translateY(-2px);
  }
`;

const FriendInviteCard = styled.div`
  background-color: rgba(39, 39, 42, 0.8);
  border: 1px solid #4a5568;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #e2e8f0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-shadow: 0 0 5px rgba(96, 165, 250, 0.5);
`;

const FriendInviteButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  width: 100%;

  &:hover {
    background-color: #2563eb;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.7);
    transform: translateY(-2px);
  }
`;

const CopyButton = styled(FriendInviteButton)`
  width: 3rem;
  padding: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const RewardInfo = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 1rem;
`;

const RewardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RewardIcon = styled.span`
  font-size: 1.2rem;
  color: #60a5fa;
`;

const RewardText = styled.span`
  font-weight: 600;
`;

const RewardAmount = styled.span`
  font-weight: 700;
  color: white;
`;

const RewardInfoBox = styled.div``;

const RewardRow = styled(InfoItem)`
  background-color: rgba(39, 39, 42, 0.8);
  justify-content: space-between;
  padding: 0.7rem;
  border: 1px solid #4a5568;
  border-radius: 0.5rem;
`;

const RewardLabel = styled(InfoLabel)`
  color: white;
  font-size: 1.1rem;
`;

const RewardValue = styled(InfoValue)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const XpLootInfo = styled(InfoItem)`
  background-color: rgba(39, 39, 42, 0.8);
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.7rem;
  border: 1px solid #4a5568;
  border-radius: 0.5rem;
`;

const XpLootRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 1.1rem;
`;

const XpLootIcon = styled.span`
  margin-right: 0.5rem;
`;

const XpLootText = styled.span`
  color: white;
`;

const XpLootValue = styled.span`
  padding-left: 0.3em;
  font-weight: bold;
  color: white;
`;

const AttackInfo = styled.span`
  font-weight: bold;
`;

const SpecialItemButton = styled.button`
  background-color: #5473a580;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 9em;
  height: 5em;
  text-align: center;

  &:hover {
    background-color: #2563eb;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.7);
  }
`;

const SelectedItemCard = styled(SpecialItemButton)`
  background: linear-gradient(135deg, #3a3a3c, #2c2c2e);
  border: 2px solid #1e90ff;
  box-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
  flex-direction: row;
  justify-content: space-between;
  padding: 0.4rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 15px rgba(30, 144, 255, 0.7);
  }
`;

const ItemImageColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40%;
  gap: 0px;
`;

const ItemImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const ItemEffectColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
`;

const ItemName = styled.div`
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const ItemEffectContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemEffect = styled.div`
  font-size: 0.6rem;
  color: white;
`;

const ItemDuration = styled.div`
  font-size: 0.6rem;
  color: #4ade80;
  margin-top: 0.25rem;
`;

const ModalContent = styled.div`
  border-radius: 0.5rem;
  padding: 1rem;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ItemButton = styled.button<{ isSelected: boolean }>`
  background: ${(props) =>
    props.isSelected
      ? "linear-gradient(135deg, #3a3a3c, #2c2c2e)"
      : "linear-gradient(135deg, #2c2c2e, #1c1c1e)"};
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 150px;
  border: 2px solid ${(props) => (props.isSelected ? "#1e90ff" : "transparent")};
  box-shadow: ${(props) =>
    props.isSelected ? "0 0 10px rgba(30, 144, 255, 0.5)" : "none"};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
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
  referralToken: string;
  won?: boolean;
  userItems: { itemId: ECRAFTABLE_ITEM; quantity: number }[];
  selectedItem: ECRAFTABLE_ITEM | null;
  onSelectItem: (item: ECRAFTABLE_ITEM | null) => void;
}

const BattleResult = styled.span`
  font-weight: bold;
  color: white;
`;

const TickerSymbol = styled.span`
  color: #1da1f2;
  font-weight: bold;
`;

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
  referralToken,
  userItems,
  selectedItem,
  onSelectItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefForward = () => {
    WebApp.openTelegramLink(
      `https://t.me/share/url?url=${
        import.meta.env.VITE_WEB_APP_URL
      }?startapp=${referralToken}`,
    );
  };

  const handleRefClick = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_WEB_APP_URL}?startapp=${referralToken}`,
    );
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSelectItem = (item: ECRAFTABLE_ITEM) => {
    onSelectItem(selectedItem === item ? null : item);
    handleCloseModal();
  };

  const renderEffectText = (
    item: (typeof CRAFTABLE_ITEMS)[ECRAFTABLE_ITEM],
  ) => {
    return Object.entries(item.pvpEffect)
      .map(([key, value]) => `${key}: +${value}`)
      .join(", ");
  };

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
            <PvpTitle>Cartel War</PvpTitle>

            <RewardInfoBox>
              <RewardRow>
                <RewardLabel>Raids Available:</RewardLabel>
                <RewardValue>
                  <FaCoins />
                  {attacksLeft} / {totalAttacks}
                </RewardValue>
              </RewardRow>
              <XpLootInfo>
                <XpLootRow>
                  <XpLootIcon>
                    <FaTrophy />
                  </XpLootIcon>
                  <XpLootText>
                    <TickerSymbol>2000 $KRTLP</TickerSymbol> per victory
                  </XpLootText>
                </XpLootRow>
                <XpLootRow>
                  <XpLootIcon>
                    <FaCoins />
                  </XpLootIcon>
                  <XpLootText>Cash + resources loot:</XpLootText>
                  <XpLootValue> 1%</XpLootValue>
                </XpLootRow>
              </XpLootInfo>
            </RewardInfoBox>
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
                hasActiveEffect={false}
              />
            </div>

            <ActionRow>
              {selectedItem ? (
                <SelectedItemCard onClick={handleOpenModal}>
                  <ItemImageColumn>
                    <ItemImage
                      src={CRAFTABLE_ITEMS[selectedItem].image}
                      alt={CRAFTABLE_ITEMS[selectedItem].name}
                    />
                  </ItemImageColumn>
                  <ItemEffectColumn>
                    <ItemName>{CRAFTABLE_ITEMS[selectedItem].name}</ItemName>
                  </ItemEffectColumn>
                </SelectedItemCard>
              ) : (
                <SpecialItemButton onClick={handleOpenModal}>
                  Special Item
                </SpecialItemButton>
              )}
              <PvpButtonDeatchmatch onClick={onDeathmatchClick}>
                <GiAk47 style={{ marginRight: "0.3rem", fontSize: "2em" }} />
                Raid
                <GiAk47 style={{ marginLeft: "0.3rem", fontSize: "2em" }} />
              </PvpButtonDeatchmatch>
            </ActionRow>
            <Separator />
            <FriendInviteCard>
              <SectionTitle>
                <FaUserFriends /> More Raids
              </SectionTitle>
              <InfoList>
                <InfoItem>
                  <InfoLabel>
                    More than <FriendCount>20</FriendCount> friends:
                  </InfoLabel>
                  <InfoValue>+3 attacks</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>
                    More than <FriendCount>10</FriendCount> friends:
                  </InfoLabel>
                  <InfoValue>+2 attacks</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>
                    More than <FriendCount>5</FriendCount> friends:
                  </InfoLabel>
                  <InfoValue>+1 attack</InfoValue>
                </InfoItem>
              </InfoList>
              <RewardInfo>
                <RewardItem>
                  <RewardIcon>
                    <FaCoins />
                  </RewardIcon>
                  <RewardText>Reward</RewardText>
                  <RewardAmount>1000$</RewardAmount>
                </RewardItem>
                <RewardItem>
                  <RewardIcon>
                    <GiRank3 />
                  </RewardIcon>
                  <RewardText>$KRTLP</RewardText>
                  <RewardAmount>+2000</RewardAmount>
                </RewardItem>
              </RewardInfo>
              <ButtonContainer>
                <FriendInviteButton onClick={handleRefForward}>
                  <FaUserFriends /> Invite Friends
                </FriendInviteButton>
                <CopyButton onClick={handleRefClick}>
                  <PiCopySimpleBold />
                </CopyButton>
              </ButtonContainer>
            </FriendInviteCard>
            <Separator />
            <SectionTitle>
              <FaHistory /> Combat History
            </SectionTitle>
            {isHistoryLoading ? (
              <LoadingSpinner />
            ) : (
              <CombatHistoryList>
                {battleHistory.map((battle) => (
                  <CombatHistoryItem key={battle.battleId}>
                    <BattleHeader>
                      <PlayerName>
                        {battle.attacker.id.toString() == userInfo.id
                          ? userInfo.username
                          : battle.attacker.username}
                      </PlayerName>
                      {battle.attacker.id.toString() != userInfo.id ? (
                        <AttackInfo>
                          attacked you and
                          <BattleResult>
                            {battle.winner == userInfo.id ? " lost" : " won"}
                          </BattleResult>
                        </AttackInfo>
                      ) : (
                        <>
                          <span>vs</span>
                          <PlayerName>{battle.defender.username}</PlayerName>
                        </>
                      )}
                    </BattleHeader>
                    <LootInfo>
                      {battle.winner === userInfo.id.toString() ? (
                        <WinnerIcon>
                          <FaTrophy />
                        </WinnerIcon>
                      ) : (
                        <LoserIcon>
                          <FaSkull />
                        </LoserIcon>
                      )}
                      <CashLoot>{formatPrice(battle.cashLoot, false)}</CashLoot>
                      {battle.productLoot.map((loot, index) => (
                        <LootItem key={index}>
                          <ProductIcon>{getProductIcon(loot.name)}</ProductIcon>
                          {loot.quantity}
                        </LootItem>
                      ))}
                    </LootInfo>
                  </CombatHistoryItem>
                ))}
              </CombatHistoryList>
            )}
          </PvpCard>

          <CraftedItemModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Select Special Item"
          >
            <ModalContent>
              <ItemGrid>
                {userItems.map((item) => (
                  <ItemButton
                    key={item.itemId}
                    isSelected={selectedItem === item.itemId}
                    onClick={() => handleSelectItem(item.itemId)}
                    disabled={item.quantity === 0}
                  >
                    <ItemName>{CRAFTABLE_ITEMS[item.itemId].name}</ItemName>
                    <ItemImage
                      src={CRAFTABLE_ITEMS[item.itemId].image}
                      alt={CRAFTABLE_ITEMS[item.itemId].name}
                    />
                    <ItemEffectContainer>
                      <ItemEffect>
                        {renderEffectText(CRAFTABLE_ITEMS[item.itemId])}
                      </ItemEffect>
                      <ItemDuration>
                        {CRAFTABLE_ITEMS[item.itemId].duration} rounds
                      </ItemDuration>
                    </ItemEffectContainer>
                    <span>({item.quantity})</span>
                  </ItemButton>
                ))}
              </ItemGrid>
            </ModalContent>
          </CraftedItemModal>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
