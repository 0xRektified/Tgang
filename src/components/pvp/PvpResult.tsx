import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaTrophy, FaSkull, FaDollarSign } from "react-icons/fa";
import { EProduct, EProductIcon } from "../interfaces/product.interface";
import { IBattle } from "../interfaces/multiplayer.interface";

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
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
`;

const ResultItemIcon = styled.div`
  font-size: 1rem;
  margin-right: 0.5rem;
  color: #a0aec0;
`;

const ResultItemValue = styled.span`
  font-weight: bold;
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

interface PvpResultProps {
  combatResult: IBattle;
  username: string;
}

const getWinner = (combatResult: IBattle) => {
  if (combatResult.winner === combatResult.attacker.username) {
    return combatResult.attacker.username;
  } else {
    return combatResult.defender.username;
  }
}

const getLooser = (combatResult: IBattle) => {
  if (combatResult.winner !== combatResult.attacker.username) {
    return combatResult.attacker.username;
  } else {
    return combatResult.defender.username;
  }
}

export const PvpResult: React.FC<PvpResultProps> = ({
  combatResult,
  username,
}) => {
  const isWinner = combatResult.winner === username;

  return (
    <ResultContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="pvp-result"
    >
      <ResultHeader>
        <ResultTitle>{isWinner ? "Victory!" : "Defeat!"}</ResultTitle>
        <ResultIcon color={isWinner ? "gold" : "white"}>
          {isWinner ? <FaTrophy /> : <FaSkull />}
        </ResultIcon>
      </ResultHeader>
      <ResultContent>
        <ResultItem>
          <ResultItemIcon>
            <FaSkull />
          </ResultItemIcon>
          <ResultItemValue>{getLooser(combatResult)} Lost</ResultItemValue>
        </ResultItem>
        <ResultItem>
          <ResultItemIcon>
            <FaDollarSign />
          </ResultItemIcon>
          You Stole <ResultItemValue> ${combatResult.cashLoot}</ResultItemValue>
        </ResultItem>
        <ProductsGrid>
          {Object.values(EProduct).map((productName: string) => {
            const lootedProduct = combatResult.productLoot.find(
              (p) => p.name === productName,
            );
            const quantity = lootedProduct ? lootedProduct.quantity : 0;
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
      </ResultContent>
    </ResultContainer>
  );
};
