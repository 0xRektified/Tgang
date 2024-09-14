import { motion } from "framer-motion";
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
} from "react-icons/fa";
import { GiDodging } from "react-icons/gi";
import { useState } from "react";
import InfoModal from "./InfoModal";

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 0.5rem;
`;

// const StatItem = styled.div`
//   background-color: #3a3a3c;
//   border-radius: 0.5rem;
//   padding: 0.5rem;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;

// const StatIcon = styled.div`
//   font-size: 1.2rem;
//   color: #a0aec0;
//   margin-bottom: 0.2rem;
// `;

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
  padding: 1rem;
  border-bottom: 2px solid #4a4a4e;
`;

const CardContent = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
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

const Username = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
`;

const UserLevel = styled.p`
  font-size: 0.8rem;
  color: #48bb78;
  margin: 0;
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
`;

const StatIcon = styled.div`
  font-size: 1rem;
  margin-right: 0.2rem;
`;

const GoldIcon = styled(StatIcon)`
  color: gold;
`;

const WhiteIcon = styled(StatIcon)`
  color: white;
`;

const ProductsList = styled.div`
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #3a3a3c;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ProductImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 0.25rem;
`;

const ProductDetails = styled.div`
  flex-grow: 1;
`;

const ProductName = styled.p`
  font-size: 0.8rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
`;

const ProductQuantity = styled.p`
  font-size: 0.7rem;
  color: #a0aec0;
  margin: 0;
`;

const ModalList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ModalListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 1rem;
  color: #a0aec0;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalLabel = styled.strong`
  margin-bottom: 0.25rem;
`;

const ModalDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #a0aec0;
`;

export function PlayerCard({
  player,
  title,
  isAttacking,
  isDefending,
}: {
  player: any;
  title: string;
  isAttacking: boolean;
  isDefending: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!player) return null;

  const attackVariants = {
    attacking: { y: [0, -10, 0], transition: { duration: 0.3 } },
    defending: { y: [0, 10, 0], transition: { duration: 0.3 } },
  };

  const statIcons = [
    {
      icon: FaTrophy,
      value: player.pvp.victory,
      label: "Victories",
      description: "Total number of PvP battles won",
    },
    {
      icon: FaSkull,
      value: player.pvp.defeat,
      label: "Defeats",
      description: "Total number of PvP battles lost",
    },
    {
      icon: FaBullseye,
      value: `${player.pvp.accuracy}%`,
      label: "Accuracy",
      description: "Chance to hit the opponent in battle",
    },
    {
      icon: FaFistRaised,
      value: player.pvp.attacksToday,
      label: "Attacks Today",
      description: "Number of attacks performed today",
    },
    {
      icon: FaHeart,
      value: player.pvp.baseHp,
      label: "Base HP",
      description: "Base health points of the character",
    },
    {
      icon: FaBomb,
      value: player.pvp.damage,
      label: "Damage",
      description: "Amount of damage dealt in battles",
    },
    {
      icon: GiDodging,
      value: `${player.pvp.evasion}%`,
      label: "Evasion",
      description: "Chance to dodge enemy attacks",
    },
    {
      icon: FaShieldAlt,
      value: `${player.pvp.protection}%`,
      label: "Protection",
      description: "Percentage of damage reduction",
    },
  ];

  return (
    <motion.div
      animate={isAttacking ? "attacking" : isDefending ? "defending" : "idle"}
      variants={attackVariants}
    >
      <StyledCard>
        <QuestionButton onClick={() => setIsModalOpen(true)}>
          <FaQuestionCircle />
        </QuestionButton>
        <CardHeader>
          <UserInfo>
            <Avatar
              src={player.image || "/assets/pvp/userImage.png"}
              alt={player.username}
            />
            <UserDetails>
              <Username>{player.username}</Username>
              <UserLevel>
                {player.userLevel.title} (Level {player.userLevel.level})
              </UserLevel>
              <StatRow>
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
              </StatRow>
            </UserDetails>
          </UserInfo>
        </CardHeader>
        <CardContent>
          <StatsGrid>
            <StatRow>
              <StatItem>
                <StatIcon>
                  <FaHeart />
                </StatIcon>
                {player.pvp.baseHp}
              </StatItem>
              <StatItem>
                <StatIcon>
                  <FaBomb />
                </StatIcon>
                {player.pvp.damage}
              </StatItem>
              <StatItem>
                <StatIcon>
                  <GiDodging />
                </StatIcon>
                {player.pvp.evasion}%
              </StatItem>
              <StatItem>
                <StatIcon>
                  <FaShieldAlt />
                </StatIcon>
                {player.pvp.protection}%
              </StatItem>
            </StatRow>
            {/* {statIcons.slice(2).map((stat, index) => (
              <StatItem key={index}>
                <StatIcon>
                  <stat.icon />
                </StatIcon>
                <StatValue>{stat.value}</StatValue>
              </StatItem>
            ))} */}
          </StatsGrid>
          <div>
            <h4 className="text-white text-sm font-bold mb-1">Products</h4>
            <ProductsList>
              {player.products.map((product: any, index: number) => (
                <ProductItem key={index}>
                  <ProductImage src={product.image} alt={product.name} />
                  <ProductDetails>
                    <ProductName>{product.name}</ProductName>
                    <ProductQuantity>Qty: {product.quantity}</ProductQuantity>
                  </ProductDetails>
                </ProductItem>
              ))}
            </ProductsList>
          </div>
        </CardContent>
      </StyledCard>
      <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Stat Explanations</h2>
        <ModalList>
          {statIcons.map((stat, index) => (
            <ModalListItem key={index}>
              <ModalIcon>
                <stat.icon />
              </ModalIcon>
              <ModalContent>
                <ModalLabel>
                  {stat.label}: {stat.value}
                </ModalLabel>
                <ModalDescription>{stat.description}</ModalDescription>
              </ModalContent>
            </ModalListItem>
          ))}
        </ModalList>
      </InfoModal>
    </motion.div>
  );
}

export default PlayerCard;
