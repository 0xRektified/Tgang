import userCharacter from "/assets/home/user_no_background.png";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Product } from "../interfaces/user.interface";

const fadeInOut = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.2); }
`;

const SmokeEffect = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background: url("/assets/home/smoke.png") no-repeat;
  background-size: contain;
  pointer-events: none;
  animation: ${fadeInOut} 1s ease-out forwards;
  z-index: 3;
`;

const VisualContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  background: transparent;
  padding: 20px 0;
`;

const CharacterContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CharacterImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
`;

const WelcomeMessage = styled.div`
  text-align: center;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  opacity: 0.8;
  margin-top: 12px;
  padding: 0 20px;
`;

const AnimatingEmoji = styled.div<{ offset: string }>`
  position: absolute;
  font-size: 2rem;
  animation: ${fadeInOut} 1s ease-out forwards;
  transform: translate(${({ offset }) => offset}, -20px);
  pointer-events: none;
  z-index: 4;
`;

interface VisualAreaProps {
  products: Product[];
  customer: string;
  customerAmount: number;
  customerAmountMax: number;
  animatingEmojis: { emoji: string; id: number; offset: string }[];
  style?: React.CSSProperties;
}

export const VisualArea: React.FC<VisualAreaProps> = ({
  products,
  customer,
  customerAmount,
  customerAmountMax,
  animatingEmojis,
  style,
}) => {
  const [smokes, setSmokes] = useState<JSX.Element[]>([]);

  const preloadImage = (src: string) => {
    const img = new Image();
    img.src = src;
  };

  useEffect(() => {
    preloadImage(userCharacter);
  }, []);

  return (
    <VisualContainer style={style}>
      <CharacterContainer>
        <CharacterImage
          src={userCharacter}
          alt="Character"
          draggable="false"
        />
        {smokes}
        {animatingEmojis.map((emoji) => (
          <AnimatingEmoji key={emoji.id} offset={emoji.offset}>
            {emoji.emoji}
          </AnimatingEmoji>
        ))}
      </CharacterContainer>
      
      <WelcomeMessage>
        Welcome to the Cartel Trading Hub
      </WelcomeMessage>
    </VisualContainer>
  );
};