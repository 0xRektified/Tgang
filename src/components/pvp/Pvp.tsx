import React from "react";
import styled from "styled-components";
import { GiCrossedSwords } from "react-icons/gi";
import { IUserInfo } from "../interfaces/user.interface";
import { EProductIcon } from "../interfaces/product.interface";

const PvpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: calc(100vh - 120px); // Adjust this value based on your layout
  background-size: cover;
  background-position: center;
  color: white;
  padding: 1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: none;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 1rem;
  text-align: center;
`;

const FightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2a2a2e;
  border-radius: 0.375rem;
  padding: 1rem;
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
`;

const FightScene = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const Fighter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FighterName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #9ca3af;
  margin-top: 0.5rem;
`;

const Versus = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #dc2626;
  margin: 0 1rem;
`;

const PlayerListContainer = styled.div`
  width: 100%;
  max-width: 600px;
  overflow-x: auto;
  background-color: #2a2a2e;
  border-radius: 0.375rem;
  padding: 1rem;
`;

const PlayerList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const PlayerListItem = styled.li`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #4a4a4a;
  color: white;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const PlayerName = styled.div`
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: bold;
`;

const CashAmount = styled.div`
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-weight: bold;
  color: #16a34a;
`;

const PlayerStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  color: #9ca3af;
`;

const StatItem = styled.div`
  margin-right: 1rem;
  display: flex;
  align-items: center;

  & > span {
    margin-left: 0.25rem;
  }
`;

const ProductIcons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: clamp(0.8rem, 1.5vw, 1rem);
`;

const ProductIcon = styled.span`
  font-size: clamp(1rem, 2vw, 1.2rem);
`;

const FightButton = styled.button`
  background-color: #4a5568; /* Grey background indicating disabled state */
  color: #a0aec0; /* Lighter grey text */
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: not-allowed; /* Indicates that the button is not clickable */
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1rem;

  &:hover {
    background-color: #4a5568; /* Keeps the same background color on hover */
  }
`;
const players = [
  {
    name: "Johnny Blaze",
    cash: "$12,500",
    products: {
      Herb: 200,
      Mushroom: 150,
      Acid: 80,
      Pill: 120,
      Crystal: 50,
      Powder: 30,
    },
    reputation: 5,
    reputationTitle: "Thug",
    victories: 12,
  },
  {
    name: "Samantha Stone",
    cash: "$9,800",
    products: {
      Herb: 180,
      Mushroom: 120,
      Acid: 90,
      Pill: 110,
      Crystal: 60,
      Powder: 40,
    },
    reputation: 4,
    reputationTitle: "Gang Member",

    victories: 8,
  },
  {
    name: "Mickey Malone",
    cash: "$14,200",
    products: {
      Herb: 220,
      Mushroom: 170,
      Acid: 100,
      Pill: 140,
      Crystal: 80,
      Powder: 50,
    },
    reputation: 6,
    reputationTitle: "Lieutenant",
    victories: 15,
  },
  {
    name: "Lucy Lee",
    cash: "$10,600",
    products: {
      Herb: 160,
      Mushroom: 140,
      Acid: 70,
      Pill: 130,
      Crystal: 55,
      Powder: 35,
    },
    reputation: 3,
    reputationTitle: "Thug",
    victories: 10,
  },
];

interface PvpProps {
  userInfo: IUserInfo;
}

const Pvp: React.FC<PvpProps> = ({ userInfo }) => {
  return (
    <PvpContainer>
      <Title>PvP Battle Arena</Title>
      <FightContainer>
        <FightScene>
          <Fighter>
            <GiCrossedSwords size={50} />
            <FighterName>{userInfo.username}</FighterName>
          </Fighter>
          <Versus>VS</Versus>
          <Fighter>
            <GiCrossedSwords size={50} />
            <FighterName>Toni</FighterName>
          </Fighter>
        </FightScene>
        <p>Fight against other players to steal their resources!</p>
      </FightContainer>
      <PlayerListContainer className="scrollable-content">
        <Title>Available Players</Title>
        <PlayerList>
          {players.map((player, index) => (
            <PlayerListItem key={index}>
              <PlayerHeader>
                <PlayerName>{player.name}</PlayerName>
                <CashAmount>{player.cash}</CashAmount>
              </PlayerHeader>
              <PlayerStats>
                <StatItem>{player.reputationTitle}</StatItem>
                <StatItem>🧠 {player.victories} Victories</StatItem>
              </PlayerStats>
              <ProductIcons>
                {Object.entries(player.products).map(([product, amount]) => (
                  <StatItem key={product}>
                    <ProductIcon>
                      {EProductIcon[product as keyof typeof EProductIcon]}
                    </ProductIcon>
                    <span>{amount}</span>
                  </StatItem>
                ))}
              </ProductIcons>
              <FightButton disabled>Fight Player (Coming Soon)</FightButton>
            </PlayerListItem>
          ))}
        </PlayerList>
      </PlayerListContainer>
    </PvpContainer>
  );
};

export default Pvp;
