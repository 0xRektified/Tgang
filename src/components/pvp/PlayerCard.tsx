import { motion } from "framer-motion";
import styled from "styled-components";

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
  font-size: 1.4rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
`;

const UserLevel = styled.p`
  font-size: 1rem;
  color: #48bb78;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
`;

const StatItem = styled.div`
  background-color: #3a3a3c;
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatLabel = styled.p`
  font-size: 0.8rem;
  color: #a0aec0;
  margin: 0;
`;

const StatValue = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
  margin-left: 0.5rem;
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

const Progress = styled.div<{ value: number }>`
  width: 100%;
  background-color: #4a4a4e;
  border-radius: 9999px;
  height: 0.5rem;
  overflow: hidden;
  margin-top: 0.5rem;

  &::after {
    content: "";
    display: block;
    width: ${(props) => props.value}%;
    height: 100%;
    background-color: #48bb78;
    transition: width 0.3s ease-in-out;
  }
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
  if (!player) return null;

  const attackVariants = {
    attacking: { y: [0, -10, 0], transition: { duration: 0.3 } },
    defending: { y: [0, 10, 0], transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      animate={isAttacking ? "attacking" : isDefending ? "defending" : "idle"}
      variants={attackVariants}
    >
      <StyledCard>
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
            </UserDetails>
          </UserInfo>
        </CardHeader>
        <CardContent>
          <StatsGrid>
            <StatItem>
              <StatLabel>Victories</StatLabel>
              <StatValue>{player.pvp.victory}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Defeats</StatLabel>
              <StatValue>{player.pvp.defeat}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Accuracy</StatLabel>
              <StatValue>{player.pvp.accuracy}%</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Attacks Today</StatLabel>
              <StatValue>{player.pvp.attacksToday}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Base HP</StatLabel>
              <StatValue>{player.pvp.baseHp}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Damage</StatLabel>
              <StatValue>{player.pvp.damage}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Evasion</StatLabel>
              <StatValue>{player.pvp.evasion}%</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Protection</StatLabel>
              <StatValue>{player.pvp.protection}%</StatValue>
            </StatItem>
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
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-400">
                Reputation
              </span>
              <span className="text-xs font-medium text-white">
                {player.reputation} / {player.userLevel.maxReputation}
              </span>
            </div>
            <Progress
              value={(player.reputation / player.userLevel.maxReputation) * 100}
            />
          </div>
        </CardContent>
      </StyledCard>
    </motion.div>
  );
}

export default PlayerCard;
