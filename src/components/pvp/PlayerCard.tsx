import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import {
  FaTrophy,
  FaSkull,
  FaBullseye,
  FaFistRaised,
  FaHeart,
  FaBomb,
  FaShieldAlt,
  FaQuestionCircle,
  FaDollarSign,
} from "react-icons/fa";
import { GiDodging } from "react-icons/gi";
import { EProduct, EProductIcon } from "../interfaces/product.interface";

// Add this helper function at the top of the file
const truncateUsername = (username: string, maxLength: number = 19) => {
  if (username.length <= maxLength) return username;
  return `${username.slice(0, maxLength - 3)}...`;
};

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 0.9rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
`;

const QuestionButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #a0aec0;
  font-size: 1.2rem;
  cursor: pointer;
`;

const StyledCard = styled(motion.div)`
  background-color: #2c2c2e;
  border-radius: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  width: 100%;
  font-size: 0.9rem;
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #3a3a3c 0%, #2c2c2e 100%);
  padding: 0.5rem;
  border-bottom: 2px solid #4a4a4e;
`;

const CardContent = styled.div`
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid #48bb78;
  box-shadow: 0 0 10px rgba(72, 187, 120, 0.5);
`;

const UserDetails = styled.div`
  flex-grow: 1;
`;

const UsernameLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Username = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.5rem; // Add small gap between username and stats
`;

const UserLevel = styled.p`
  font-size: 0.8rem;
  color: #48bb78;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CashAmount = styled.span`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  color: #ffffff;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  padding: 0.5em;
`;

const StatIcon = styled.div`
  font-size: 1rem;
  margin-right: 0.2rem;
  gap: 0.5em;
`;

const RedIcon = styled(StatIcon)`
  color: #e53e3e; // Red color for heart (baseHP)
`;

const WhiteIcon = styled(StatIcon)`
  color: #ffffff; // White color for evasion
`;

const GoldIcon = styled(StatIcon)`
  color: gold;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.2rem;
  margin-top: 0.5rem;
`;

const ProductItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ProductIcon = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
`;

const ProductQuantity = styled.p`
  font-size: 0.7rem;
  color: #a0aec0;
  margin: 0;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const StatGroup = styled.div`
  display: flex;
  font-size: 0.8rem; // Reduce font size to match username
`;

const GreenIcon = styled(StatIcon)`
  color: #48bb78;
`;

const HealthBar = styled.div`
  flex-grow: 1;
  height: 10px;
  background-color: #e53e3e;
  border-radius: 10px;
  overflow: hidden;
`;

const HealthFill = styled(motion.div)`
  height: 100%;
  background-color: #48bb78;
`;

const HealthText = styled.p`
  font-size: 0.8rem;
  color: #ffffff;
  text-align: center;
  margin: 0.25rem 0 0;
`;

const DamagePastil = styled(motion.div)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff3333;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
`;

const HealthBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

interface PlayerCardProps {
  player: any;
  title: string;
  isAttacking: boolean;
  isDefending: boolean;
  onInfoClick: () => void;
  health: number;
  maxHealth: number;
  damageReceived?: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  title,
  isAttacking,
  isDefending,
  onInfoClick,
  health,
  maxHealth,
  damageReceived,
}) => {
  console.log("player", player);
  if (!player || !player.pvp) return null;

  const healthPercentage = (health / maxHealth) * 100;

  return (
    <StyledCard>
      <AnimatePresence>
        {damageReceived !== undefined && (
          <DamagePastil
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            {damageReceived === 0 ? "Miss" : damageReceived}
          </DamagePastil>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {damageReceived !== undefined && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{ backgroundColor: damageReceived === 0 ? "white" : "red" }}
          />
        )}
      </AnimatePresence>

      <QuestionButton onClick={onInfoClick}>
        <FaQuestionCircle />
      </QuestionButton>
      <CardHeader>
        <UserInfo>
          <Avatar
            src={player.image || "/assets/pvp/userImage.png"}
            alt={player.username}
          />
          <UserDetails>
            <UsernameLine>
              <Username title={player.username}>
                {truncateUsername(player.username)}
                <StatGroup>
                  <StatItem>
                    <GoldIcon>
                      <FaTrophy />
                    </GoldIcon>
                    {player.pvp.victory}
                  </StatItem>
                  <StatItem>
                    <WhiteIcon>
                      <FaSkull />
                    </WhiteIcon>
                    {player.pvp.defeat}
                  </StatItem>
                </StatGroup>
              </Username>
            </UsernameLine>
            <UserLevel>
              (Level {player.userLevel.level}) {player.userLevel.title}
              <CashAmount>
                <GreenIcon>
                  <FaDollarSign />
                </GreenIcon>
                {player.cashAmount}
              </CashAmount>
            </UserLevel>
            <StatsRow>
              <StatGroup>
                <StatItem>
                  <WhiteIcon>
                    <FaShieldAlt />
                  </WhiteIcon>
                  {player.pvp.protection}%
                </StatItem>
                <StatItem>
                  <WhiteIcon>
                    <FaBomb />
                  </WhiteIcon>
                  {player.pvp.damage}
                </StatItem>
                <StatItem>
                  <WhiteIcon>
                    <GiDodging />
                  </WhiteIcon>
                  {player.pvp.evasion}%
                </StatItem>
              </StatGroup>
            </StatsRow>
          </UserDetails>
        </UserInfo>
        <HealthBarContainer>
          <HealthBar>
            <HealthFill
              initial={{ width: `${healthPercentage}%` }}
              animate={{ width: `${healthPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </HealthBar>
          <HealthText>{`${health} / ${maxHealth}`}</HealthText>
        </HealthBarContainer>
      </CardHeader>
      <CardContent>
        <div>
          <ProductsGrid>
            {Object.values(EProduct).map((productName: string) => {
              const product = player.products.find(
                (p: { name: string }) => p.name === productName,
              );
              const quantity = product ? product.quantity : 0;
              const emoji =
                EProductIcon[productName as keyof typeof EProductIcon];
              return (
                <ProductItem key={productName}>
                  <ProductIcon>{emoji}</ProductIcon>
                  <ProductQuantity>{quantity}</ProductQuantity>
                </ProductItem>
              );
            })}
          </ProductsGrid>
        </div>
      </CardContent>
    </StyledCard>
  );
};

export default PlayerCard;
