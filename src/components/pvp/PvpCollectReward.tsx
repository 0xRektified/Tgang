import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IBattle } from '../interfaces/multiplayer.interface';
import { EProductIcon } from '../interfaces/product.interface';
import { BsCash } from 'react-icons/bs';
import { NeonGreenButton } from '../styled/cardStyled';

interface PvpCollectRewardProps {
  combatResult: IBattle | null;
  collectingRewards: boolean;
  windowSize: { width: number; height: number };
  onCollect: () => void;
}

const PvpCollectReward: React.FC<PvpCollectRewardProps> = ({
  combatResult,
  collectingRewards,
  windowSize,
  onCollect,
}) => {
  const [rewardPositions, setRewardPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});

  useEffect(() => {
    if (collectingRewards && combatResult) {
      const resultElement = document.querySelector('.pvp-result');
      if (resultElement) {
        const rect = resultElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const newRewardPositions: { [key: string]: { x: number; y: number } } = {};

        combatResult.productLoot?.forEach((product, index) => {
          const angle = (index / (combatResult.productLoot?.length || 1)) * Math.PI * 2;
          const radius = 100;
          newRewardPositions[product.name] = {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
          };
        });

        newRewardPositions.cash = { x: centerX, y: centerY + 50 };

        setRewardPositions(newRewardPositions);
      }
    }
  }, [collectingRewards, combatResult]);

  return (
    <AnimatePresence>
      {collectingRewards && combatResult && (
        <>
          {combatResult.productLoot?.map((product, index) =>
            Array.from({ length: Math.min(product.quantity, 15) }).map((_, i) => {
              const delay = (i * 1000) / Math.min(product.quantity, 15);
              return (
                <motion.div
                  key={`${product.name}-${i}`}
                  initial={{
                    opacity: 1,
                    x: rewardPositions[product.name]?.x,
                    y: rewardPositions[product.name]?.y,
                    scale: 1,
                  }}
                  animate={{
                    opacity: 0,
                    x: windowSize.width - 50,
                    y: 50,
                    scale: 0.5,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: delay / 1000,
                    type: 'spring',
                    stiffness: 100,
                    damping: 10,
                  }}
                  style={{
                    position: 'fixed',
                    fontSize: '2rem',
                    color: 'white',
                    zIndex: 1000,
                  }}
                >
                  {EProductIcon[product.name as keyof typeof EProductIcon]}
                </motion.div>
              );
            }),
          )}
          {Array.from({
            length: Math.min(Math.floor((combatResult.cashLoot || 0) / 10) || 0, 15),
          }).map((_, i) => {
            const delay = (i * 1000) / Math.min(Math.floor((combatResult.cashLoot || 0) / 10) || 0, 15);
            return (
              <motion.div
                key={`cash-${i}`}
                initial={{
                  opacity: 1,
                  x: rewardPositions.cash?.x,
                  y: rewardPositions.cash?.y,
                  scale: 1,
                }}
                animate={{
                  opacity: 0,
                  x: windowSize.width - 50,
                  y: 50,
                  scale: 0.5,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  delay: delay / 1000,
                  type: 'spring',
                  stiffness: 100,
                  damping: 10,
                }}
                style={{
                  position: 'fixed',
                  fontSize: '2rem',
                  color: '#00ff00',
                  zIndex: 1000,
                }}
              >
                <BsCash />
              </motion.div>
            );
          })}
        </>
      )}
    </AnimatePresence>
  );
};

export default PvpCollectReward;
