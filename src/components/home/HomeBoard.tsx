import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { LastTransaction } from "./LastTransaction";
import { Transaction } from "./utils/types";

const HomeBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  border-radius: 0.5rem;
  z-index: 2;
`;

const CustomerEmoji = styled.div`
  font-size: 1.5rem;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
`;

const CustomerCount = styled.div`
  font-size: 0.8rem;
  color: #cbd5e0;
  text-align: center;
  margin-top: 0.5em;
`;

const AnimatingEmojiContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
`;

const electricEffect = keyframes`
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
`;

const VerticalProgressBarContainer = styled.div`
  width: 10px;
  height: 20vh;
  min-height: 100px;
  max-height: 200px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 5px rgba(30, 144, 255, 0.3);
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff; }
  50% { box-shadow: 0 0 4px #1e90ff, 0 0 8px #1e90ff; }
  100% { box-shadow: 0 0 2px #1e90ff, 0 0 4px #1e90ff; }
`;

const decreaseAnimation = keyframes`
  0% { background-color: #5c36fb; }
  100% { background-color: #1e90ff; }
`;

const ProgressFill = styled.div<{ height: number; isDecreasing: boolean }>`
  width: 100%;
  height: ${(props) => props.height}%;
  background-color: #1e90ff;
  position: absolute;
  bottom: 0;
  transition: height 0.3s ease-out;
  animation: ${(props) => (props.isDecreasing ? decreaseAnimation : "none")}
    0.5s ease-out;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0)
    );
    animation: ${glowAnimation} 1.5s infinite;
  }
`;

const ElectricEffect = styled.div<{ height: number }>`
  position: absolute;
  bottom: ${(props) => props.height}%;
  left: -5px;
  right: -5px;
  height: 4px;
  background: linear-gradient(
    to right,
    transparent,
    #00ffff,
    #1e90ff,
    #00ffff,
    transparent
  );
  opacity: 0;
  animation: ${electricEffect} 0.5s ease-out;
  box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
  z-index: 1;
`;

interface HomeBoardProps {
  customer: string;
  customerAmount: number;
  animatingEmojis: { emoji: string; id: number; offset: string }[];
}

export const getRandomEmoji = () => {
  const emojiList = [
    "👶",
    "🧒",
    "👦",
    "👧",
    "🧑",
    "👱",
    "👨",
    "🧔",
    "👶🏿",
    "🧒🏿",
    "👦🏿",
    "👧🏿",
    "🧑🏿",
    "👱🏿",
    "👨🏿",
    "🧔🏿",
    "👶🏻",
    "🧒🏻",
    "👦🏻",
    "👧🏻",
    "🧑🏻",
    "👱🏻",
    "👨🏻",
    "🧔🏻",
    "👶🏽",
    "🧒🏽",
    "👦🏽",
    "👧🏽",
    "🧑🏽",
    "👱🏽",
    "👨🏽",
    "🧔🏽",
    "👶🏾",
    "🧒🏾",
    "👦🏾",
    "👧🏾",
    "🧑🏾",
    "👱🏾",
    "👨🏾",
    "🧔🏾",
  ];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
};

export const HomeBoard: React.FC<HomeBoardProps> = ({
  customer,
  customerAmount,
  animatingEmojis,
}) => {
  const maxCustomers = 500;
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isDecreasing, setIsDecreasing] = useState(false);
  const [showElectricEffect, setShowElectricEffect] = useState(false);
  const prevCustomerAmount = useRef(customerAmount);

  useEffect(() => {
    const newFillPercentage = Math.min(
      (customerAmount / maxCustomers) * 100,
      100,
    );
    setFillPercentage(newFillPercentage);

    if (customerAmount < prevCustomerAmount.current) {
      setIsDecreasing(true);
      setShowElectricEffect(true);
      setTimeout(() => {
        setIsDecreasing(false);
        setShowElectricEffect(false);
      }, 500);
    }
    prevCustomerAmount.current = customerAmount;
  }, [customerAmount]);

  return (
    <HomeBoardContainer>
      <div>
        {customerAmount}
        {customerAmount > 0 ? customer : "💀"}
      </div>
      <VerticalProgressBarContainer>
        <ProgressFill height={fillPercentage} isDecreasing={isDecreasing} />
        {showElectricEffect && <ElectricEffect height={fillPercentage} />}
      </VerticalProgressBarContainer>

      <AnimatingEmojiContainer>
        {animatingEmojis.map(({ emoji, id, offset }) => (
          <div
            key={`${id}${offset}`}
            className="absolute text-2xl text-white animate-move-up-random-x"
            style={
              {
                "--random-offset": offset,
                transform: `translateX(${offset})`,
              } as React.CSSProperties
            }
          >
            {emoji}
          </div>
        ))}
      </AnimatingEmojiContainer>
    </HomeBoardContainer>
  );
};
