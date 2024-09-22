import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaSkull, FaDollarSign } from "react-icons/fa";
import { BsCash } from "react-icons/bs";

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
  onCollect: () => void;
  collectingRewards: boolean;
}

const getWinner = (combatResult: IBattle) => {
  if (combatResult.winner === combatResult.attacker.username) {
    return combatResult.attacker.username;
  } else {
    return combatResult.defender.username;
  }
};

const getLooser = (combatResult: IBattle) => {
  if (combatResult.winner !== combatResult.attacker.username) {
    return combatResult.attacker.username;
  } else {
    return combatResult.defender.username;
  }
};

export const PvpResult: React.FC<PvpResultProps> = ({
  combatResult,
  username,
  onCollect,
  collectingRewards,
}) => {
  const isWinner = combatResult.winner === username;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [visibleRewards, setVisibleRewards] = useState<Array<{ type: string; name?: string; index: number }>>([]);

  useEffect(() => {
    if (collectingRewards) {
      const rewards = [
        { type: "cash", amount: combatResult.cashLoot },
        ...combatResult.productLoot.map((product) => ({
          type: "product",
          ...product,
        })),
      ];

      rewards.forEach((item, itemIndex) => {
        const isCash = item.type === "cash";
        const quantity = isCash
          ? Math.min(Math.floor((item as { amount: number }).amount / 10) || 0, 15)
          : Math.min((item as { quantity: number }).quantity, 15);

        Array.from({ length: quantity }).forEach((_, index) => {
          const delay = itemIndex * 500 + index * 200;
          setTimeout(() => {
            setVisibleRewards((prev) => [
              ...prev,
              { type: item.type, name: isCash ? "cash" : (item as { name: string }).name, index },
            ]);
          }, delay);
        });
      });
    }
  }, [collectingRewards, combatResult]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

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
              <ProductItem
                key={productName}
                className="product-item"
                data-product={productName}
              >
                <ProductIcon>{emoji}</ProductIcon>
                <ProductQuantity>{quantity}</ProductQuantity>
              </ProductItem>
            );
          })}
        </ProductsGrid>
      </ResultContent>

      <AnimatePresence>
        {collectingRewards && (
          <motion.div className="absolute top-60 left-15 transform -translate-x-1/2  animate-move-up-right">
            {visibleRewards.map(({ type, name, index }) => {
              const isCash = type === "cash";
              const emoji = isCash ? "💰" : EProductIcon[name as EProduct];
              const text = isCash ? "10$" : "";

              return (
                <motion.div
                  key={`${type}-${name}-${index}`}
                  className="h-6 w-6 animate-move-up-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  onAnimationStart={playSound}
                  style={{
                    fontSize: "2rem",
                    color: type === "cash" ? "#00ff00" : "white",
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {emoji}
                  {text}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCollect}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        💰 Collect Rewards
      </motion.button>

      <audio ref={audioRef} src="/assets/cash.mp3" />
    </ResultContainer>
  );
};
